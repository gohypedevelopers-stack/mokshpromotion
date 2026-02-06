
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return new NextResponse("Unauthorized", { status: 401 })

        const body = await req.json()
        const inventoryId = body.inventoryId
        const inventoryIds: number[] = body.inventoryIds || (inventoryId ? [inventoryId] : [])
        const leadId = Number(params.id)

        if (inventoryIds.length === 0) {
            return new NextResponse("No inventory IDs provided", { status: 400 })
        }

        // Fetch all inventory items
        const inventoryItems = await db.inventoryHoarding.findMany({
            where: { id: { in: inventoryIds } }
        })

        if (inventoryItems.length === 0) {
            return new NextResponse("Inventory items not found", { status: 404 })
        }

        let addedCount = 0
        let totalAddedValue = 0

        // Create campaign items
        // We do this individually or createMany. createMany doesn't return created records easily for logging detailed names if we wanted, 
        // but for bulk add, "Batch add" log is sufficient.
        const campaignItemsData = inventoryItems.map(item => {
            const rate = item.rate ? Number(item.rate) : 0
            const printing = item.printingCharge ? Number(item.printingCharge) : 0
            const itemTotal = rate + printing
            totalAddedValue += itemTotal
            addedCount++

            return {
                leadId,
                inventoryHoardingId: item.id,
                rate,
                printingCharge: printing,
                total: itemTotal
            }
        })

        // Create campaign items via Promise.all (createMany not supported in this env)
        await Promise.all(campaignItemsData.map(data =>
            db.leadCampaignItem.create({ data })
        ))

        // Recalculate Lead Totals
        // 1. Sum all campaign items
        const allItems = await db.leadCampaignItem.findMany({
            where: { leadId }
        })

        const newBaseTotal = allItems.reduce((sum, item) => sum + Number(item.total), 0)

        // 2. Fetch Lead to get discount info
        const lead = await db.lead.findUnique({ where: { id: leadId } })
        if (!lead) return new NextResponse("Lead not found", { status: 404 })

        let updateData: any = { baseTotal: newBaseTotal }

        // Recalculate discount if exists
        if (lead.discountPercentApplied) {
            const discountAmount = (newBaseTotal * lead.discountPercentApplied) / 100
            updateData.discountAmount = discountAmount
            updateData.finalTotal = newBaseTotal - discountAmount
        } else {
            updateData.finalTotal = newBaseTotal
        }

        await db.lead.update({
            where: { id: leadId },
            data: updateData
        })

        // Log it
        await db.leadLog.create({
            data: {
                leadId,
                userId: Number(session.user.id),
                action: "CAMPAIGN_ADD",
                details: addedCount > 1
                    ? `Bulk added ${addedCount} campaign locations. Total value increased by ${totalAddedValue}.`
                    : `Added campaign location: ${inventoryItems[0].location} (${inventoryItems[0].city}). Price increased by ${totalAddedValue}.`
            }
        })

        return NextResponse.json({ success: true, newBaseTotal, addedCount })
    } catch (error) {
        console.error(error)
        return new NextResponse("Error adding item", { status: 500 })
    }
}

// DELETE to remove an item
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return new NextResponse("Unauthorized", { status: 401 })

        const { searchParams } = new URL(req.url)
        const itemId = searchParams.get("itemId")

        if (!itemId) return new NextResponse("Item ID required", { status: 400 })

        const item = await db.leadCampaignItem.findUnique({
            where: { id: Number(itemId) },
            include: { inventoryHoarding: true }
        })

        if (!item) return new NextResponse("Item not found", { status: 404 })

        // Check ownership/permissions if needed

        await db.leadCampaignItem.delete({
            where: { id: Number(itemId) }
        })

        // Recalculate Lead Totals
        const leadId = Number(params.id)
        // 1. Sum all campaign items
        const allItems = await db.leadCampaignItem.findMany({
            where: { leadId }
        })

        const newBaseTotal = allItems.reduce((sum, item) => sum + Number(item.total), 0)

        const lead = await db.lead.findUnique({ where: { id: leadId } })
        if (lead) {
            let updateData: any = { baseTotal: newBaseTotal }

            if (lead.discountPercentApplied) {
                const discountAmount = (newBaseTotal * lead.discountPercentApplied) / 100
                updateData.discountAmount = discountAmount
                updateData.finalTotal = newBaseTotal - discountAmount
            } else {
                updateData.finalTotal = newBaseTotal
            }

            await db.lead.update({
                where: { id: leadId },
                data: updateData
            })

            await db.leadLog.create({
                data: {
                    leadId,
                    userId: Number(session.user.id),
                    action: "CAMPAIGN_REMOVE",
                    details: `Removed campaign location: ${item.inventoryHoarding.location}. Price decreased by ${item.total}.`
                }
            })
        }

        return NextResponse.json({ success: true, newBaseTotal })

    } catch (error) {
        console.error(error)
        return new NextResponse("Error deleting item", { status: 500 })
    }
}
