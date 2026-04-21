
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { z } from "zod"

const assignSchema = z.object({
    assigneeId: z.coerce.number().int().positive()
})

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // Only admins should assign/reassign users.
        if (!["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
            return new NextResponse("Forbidden", { status: 403 })
        }

        const leadId = Number(params.id)
        if (isNaN(leadId)) {
            return new NextResponse("Invalid lead ID", { status: 400 })
        }

        const body = await req.json()
        const parsed = assignSchema.safeParse(body)
        if (!parsed.success) {
            return new NextResponse("Assignee ID required", { status: 400 })
        }
        const assigneeId = parsed.data.assigneeId

        const actorId = Number(session.user.id)
        if (!Number.isInteger(actorId) || actorId <= 0) {
            return new NextResponse("Invalid session user", { status: 401 })
        }

        // Verify lead exists
        const existingLead = await db.lead.findUnique({
            where: { id: leadId },
            select: { id: true, status: true }
        })
        if (!existingLead) {
            return new NextResponse("Lead not found", { status: 404 })
        }

        // Verify assignee exists
        const assignee = await db.user.findUnique({
            where: { id: assigneeId }
        })

        if (!assignee) {
            return new NextResponse("User not found", { status: 404 })
        }

        // Update lead
        // Logic: Always update assigneeId
        // If the new assignee is SALES role, or if salesUserId is currently null, we set salesUserId as well to keep track of the sales rep.

        const updateData: any = {
            assigneeId
        }

        if (assignee.role === "SALES" || assignee.role === "ADMIN" || assignee.role === "SUPER_ADMIN") {
            // We can optimistically set this as the sales user if they are from sales team
            // OR we can fetch the lead first to check if salesUserId is null, but a simpler approach is:
            // If we are assigning to a sales rep, they become the salesUser.
            updateData.salesUserId = assigneeId
        }

        // When a fresh lead is assigned, move it to follow-up.
        if (existingLead.status === "NEW") {
            updateData.status = "FOLLOW_UP"
        }

        const lead = await db.lead.update({
            where: { id: leadId },
            data: updateData,
            include: {
                assignee: { select: { name: true } },
                salesUser: { select: { name: true } },
                financeUser: { select: { name: true } },
                opsUser: { select: { name: true } },
            }
        })

        // Log the assignment
        await db.leadLog.create({
            data: {
                leadId: leadId,
                userId: actorId,
                action: "ASSIGNMENT",
                details: `Assigned lead to ${assignee.name}`
            }
        })

        return NextResponse.json(lead)

    } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return new NextResponse("Lead not found", { status: 404 })
            }
        }
        console.error("LEAD_ASSIGN_PUT", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
