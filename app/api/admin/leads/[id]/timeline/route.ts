
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"
import { z } from "zod"

// Helper to normalize date to start of day (UTC or local consistency)
// Simplest way to ensure "date only" comparison logic in JS:
// We will rely on the input being YYYY-MM-DD string, and create a Date from it at midnight UTC or local.
// Given the user wants "Date-only", passing strings is safest, then transforming for Prisma.

const updateTimelineSchema = z.object({
    inventoryIds: z.array(z.number()),
    bookingStartDate: z.string().refine(val => !isNaN(Date.parse(val)), "Invalid Start Date"),
    bookingEndDate: z.string().refine(val => !isNaN(Date.parse(val)), "Invalid End Date"),
})

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return new NextResponse("Unauthorized", { status: 401 })

        // Check permissions if needed (assuming ADMIN or SALES with access)

        const leadId = Number(params.id)
        if (isNaN(leadId)) return new NextResponse("Invalid Lead ID", { status: 400 })

        const leadItems = await db.leadCampaignItem.findMany({
            where: { leadId },
            include: {
                inventoryHoarding: {
                    select: {
                        id: true,
                        outletName: true,
                        locationName: true,
                        city: true
                    }
                }
            }
        })

        const timelineData = leadItems.map(item => ({
            itemId: item.id,
            inventoryId: item.inventoryHoardingId,
            inventoryName: `${item.inventoryHoarding.outletName} - ${item.inventoryHoarding.locationName}`,
            bookingStartDate: item.bookingStartDate,
            bookingEndDate: item.bookingEndDate,
            // Status could be computed here or frontend
        }))

        return NextResponse.json(timelineData)

    } catch (error) {
        console.error("TIMELINE_GET_ERROR", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return new NextResponse("Unauthorized", { status: 401 })

        const leadId = Number(params.id)
        if (isNaN(leadId)) return new NextResponse("Invalid Lead ID", { status: 400 })

        const body = await req.json()
        const { inventoryIds, bookingStartDate, bookingEndDate } = updateTimelineSchema.parse(body)

        // Parse dates to objects for Prisma
        const start = new Date(bookingStartDate)
        const end = new Date(bookingEndDate)

        // Normalize to Start of Day to avoid time issues
        start.setHours(0, 0, 0, 0)
        end.setHours(0, 0, 0, 0)

        if (start > end) {
            return new NextResponse("Start date cannot be after end date", { status: 400 })
        }

        // 1. Validate that these inventory items belong to the lead
        const validItems = await db.leadCampaignItem.findMany({
            where: {
                leadId,
                inventoryHoardingId: { in: inventoryIds }
            }
        })

        if (validItems.length !== inventoryIds.length) {
            return new NextResponse("Invalid inventory items for this lead", { status: 400 })
        }

        // 2. Conflict Check
        // Check if any OTHER lead has a booking on these inventory items that overlaps
        // Overlap: (OtherStart <= MyEnd) && (OtherEnd >= MyStart)
        const conflicts = await db.leadCampaignItem.findFirst({
            where: {
                inventoryHoardingId: { in: inventoryIds },
                leadId: { not: leadId }, // Exclude current lead
                bookingStartDate: { not: null },
                bookingEndDate: { not: null },
                AND: [
                    { bookingStartDate: { lte: end } },
                    { bookingEndDate: { gte: start } }
                ]
            },
            include: {
                inventoryHoarding: true
            }
        })

        if (conflicts) {
            return new NextResponse(
                `Inventory '${conflicts.inventoryHoarding.outletName}' is already booked for these dates (Lead #${conflicts.leadId})`,
                { status: 409 } // Conflict
            )
        }

        // 3. Update Records
        await db.leadCampaignItem.updateMany({
            where: {
                leadId,
                inventoryHoardingId: { in: inventoryIds }
            },
            data: {
                bookingStartDate: start,
                bookingEndDate: end,
                bookingUpdatedAt: new Date()
            }
        })

        return NextResponse.json({ success: true })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse("Invalid Request Data", { status: 400 })
        }
        console.error("TIMELINE_PUT_ERROR", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
