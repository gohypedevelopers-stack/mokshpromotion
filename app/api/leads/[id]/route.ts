import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"
import { z } from "zod"

const updateLeadSchema = z.object({
    status: z.string().optional(),
    assigneeId: z.number().optional().nullable(),
    financeUserId: z.number().optional(),
    opsUserId: z.number().optional(),
    remark: z.string().optional(),
    notes: z.string().optional(),
    baseTotal: z.number().optional()
})

// Define statuses that trigger a "BOOKED" state for inventory
const BOOKING_STATUSES = ["HANDOFF_TO_OPS", "UNDER_PRINTING", "UNDER_INSTALLATION", "CLOSED", "PROCESSING", "DEAL_CLOSED"]

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { status, assigneeId, financeUserId, opsUserId, remark, notes, baseTotal } = updateLeadSchema.parse(body)

        const leadId = Number(params.id)

        // Use a transaction to ensure atomic lead update + inventory booking
        const result = await db.$transaction(async (tx) => {
            // 1. Fetch current lead state
            const lead = await tx.lead.findUnique({
                where: { id: leadId },
                include: { campaignItems: true }
            })

            if (!lead) {
                throw new Error("Lead not found")
            }

            // Prepare update data
            let updateData: any = {}
            let logAction = "UPDATE"
            let logDetails = ""

            // 0. Base Total Update
            if (baseTotal !== undefined && baseTotal !== Number(lead.baseTotal)) {
                updateData.baseTotal = baseTotal
                if (lead.discountPercentApplied) {
                    const discountAmount = (baseTotal * lead.discountPercentApplied) / 100
                    updateData.discountAmount = discountAmount
                    updateData.finalTotal = baseTotal - discountAmount
                    logDetails += `Base Price updated to ${baseTotal}. Discount recalculated. `
                } else {
                    updateData.finalTotal = baseTotal
                    logDetails += `Base Price updated to ${baseTotal}. `
                }
            }

            // 1. Status Change logic
            const newStatus = status || (opsUserId ? "HANDOFF_TO_OPS" : (financeUserId ? "IN_PROGRESS" : lead.status))
            const isNowBooked = BOOKING_STATUSES.includes(newStatus)
            const wasBooked = BOOKING_STATUSES.includes(lead.status)

            if (status && status !== lead.status) {
                updateData.status = status
                logAction = "STATUS_CHANGE"
                logDetails += `Status changed from ${lead.status} to ${status}. `
            }

            // 2. Assignee/Handoff logic
            if (assigneeId !== undefined) {
                updateData.assigneeId = assigneeId
                if (assigneeId !== lead.assigneeId) {
                    logDetails += `Reassigned to User #${assigneeId}. `
                }
            }

            if (financeUserId) {
                updateData.financeUserId = financeUserId
                updateData.assigneeId = financeUserId
                updateData.status = "IN_PROGRESS"
                logAction = "HANDOFF_FINANCE"
                logDetails += `Handed off to Finance User #${financeUserId}. `
            }

            if (opsUserId) {
                updateData.opsUserId = opsUserId
                updateData.assigneeId = opsUserId
                updateData.status = "HANDOFF_TO_OPS"
                logAction = "HANDOFF_OPS"
                logDetails += `Handed off to Ops User #${opsUserId}. `
            }

            // 3. Remark / Notes
            if (remark) {
                logDetails += `Remark: ${remark} `
                if (logAction === "UPDATE") logAction = "NOTE"
            }

            if (notes !== undefined && notes !== lead.notes) {
                updateData.notes = notes
                logDetails += `Notes updated. `
                if (logAction === "UPDATE") logAction = "NOTE_UPDATE"
            }

            // 4. Persistence of Sales User
            if ((financeUserId || opsUserId) && !lead.salesUserId && lead.assigneeId) {
                updateData.salesUserId = lead.assigneeId
            }

            // 5. INVENTORY BOOKING TRIGGER
            // If lead is moving to a "Booked" status
            if (isNowBooked && !wasBooked) {
                // Check if any campaign item is already booked by ANOTHER lead
                for (const item of lead.campaignItems) {
                    const inventory = await tx.inventoryHoarding.findUnique({
                        where: { id: item.inventoryHoardingId }
                    })

                    if (inventory && (inventory as any).availabilityStatus === "BOOKED" && (inventory as any).currentLeadId !== leadId) {
                        throw new Error(`Inventory item "${inventory.outletName}" is already booked by Lead #${(inventory as any).currentLeadId}`)
                    }
                }

                // All items are available, proceed to book them
                for (const item of lead.campaignItems) {
                    await (tx.inventoryHoarding.update as any)({
                        where: { id: item.inventoryHoardingId },
                        data: {
                            availabilityStatus: "BOOKED",
                            bookedAt: new Date(),
                            currentLeadId: leadId
                        }
                    })
                }
                logDetails += "Linked inventory items marked as BOOKED. "
            }
            // If lead is moving OUT of a booked status (e.g. to LOST or back to INTERESTED)
            else if (!isNowBooked && wasBooked) {
                for (const item of lead.campaignItems) {
                    await (tx.inventoryHoarding.update as any)({
                        where: { id: item.inventoryHoardingId },
                        data: {
                            availabilityStatus: "AVAILABLE",
                            bookedAt: null,
                            currentLeadId: null
                        }
                    })
                }
                logDetails += "Linked inventory items released to AVAILABLE. "
            }

            // 6. Perform Lead Update
            await tx.lead.update({
                where: { id: leadId },
                data: updateData
            })

            // 7. Create Log Entry
            if (logDetails || remark) {
                await tx.leadLog.create({
                    data: {
                        leadId: lead.id,
                        userId: Number(session.user.id),
                        action: logAction,
                        details: logDetails || (remark || "Updated lead details")
                    }
                })
            }

            // Fetch final state
            return await tx.lead.findUnique({
                where: { id: leadId },
                include: {
                    assignee: { select: { name: true } },
                    salesUser: { select: { name: true } },
                    financeUser: { select: { name: true } },
                    opsUser: { select: { name: true } },
                    logs: {
                        orderBy: { createdAt: 'desc' },
                        include: { user: { select: { name: true, role: true } } }
                    }
                }
            })
        })

        return NextResponse.json(result)
    } catch (error: any) {
        console.error("LEAD_PATCH_ERROR", error)
        return new NextResponse(error.message || "Internal Error", { status: 400 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== 'ADMIN') {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const leadId = Number(params.id)

        // Use transaction to ensure complete cleanup
        await db.$transaction(async (tx) => {
            // 0. Release inventory before deleting lead
            const campaignItems = await tx.leadCampaignItem.findMany({
                where: { leadId }
            })

            for (const item of campaignItems) {
                await (tx.inventoryHoarding.update as any)({
                    where: { id: item.inventoryHoardingId },
                    data: {
                        availabilityStatus: "AVAILABLE",
                        bookedAt: null,
                        currentLeadId: null
                    }
                })
            }

            // 1. Clean up Payment module related data if exists
            const leadPayment = await tx.leadPayment.findUnique({
                where: { leadId }
            })

            if (leadPayment) {
                await tx.paymentTransaction.deleteMany({ where: { leadPaymentId: leadPayment.id } })
                await tx.paymentReminderLog.deleteMany({ where: { leadPaymentId: leadPayment.id } })
                await tx.paymentFollowupNote.deleteMany({ where: { leadPaymentId: leadPayment.id } })
                await tx.leadPayment.delete({ where: { id: leadPayment.id } })
            }

            // 2. Clean up other direct relations
            await tx.discountRequest.deleteMany({ where: { leadId } })
            await tx.leadCampaignItem.deleteMany({ where: { leadId } })
            await tx.leadLog.deleteMany({ where: { leadId } })

            // 3. Delete the Lead itself
            await tx.lead.delete({ where: { id: leadId } })
        })

        return new NextResponse("Deleted", { status: 200 })
    } catch (error) {
        console.error("LEAD_DELETE", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
