import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/super-admin/discount-requests
 * Get all discount requests with filters (Super Admin only)
 */
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Only SUPER_ADMIN can access
        if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN") {
            return new NextResponse("Forbidden: Super Admin access required", {
                status: 403,
            });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const salesRepId = searchParams.get("salesRepId");
        const search = searchParams.get("search");
        const dateFrom = searchParams.get("dateFrom");
        const dateTo = searchParams.get("dateTo");

        // Build where clause
        const where: any = {};

        if (status) {
            where.status = status;
        }

        if (salesRepId) {
            where.requestedByUserId = parseInt(salesRepId);
        }

        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom) {
                where.createdAt.gte = new Date(dateFrom);
            }
            if (dateTo) {
                where.createdAt.lte = new Date(dateTo);
            }
        }

        if (search) {
            where.OR = [
                {
                    lead: {
                        customerName: {
                            contains: search,
                        },
                    },
                },
                {
                    lead: {
                        phone: {
                            contains: search,
                        },
                    },
                },
                {
                    id: {
                        contains: search,
                    },
                },
            ];
        }

        // Get discount requests
        const discountRequests = await db.discountRequest.findMany({
            where,
            include: {
                lead: {
                    include: {
                        campaignItems: {
                            include: {
                                inventoryHoarding: true,
                            },
                        },
                    },
                },
                requestedByUser: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // Format response
        const formattedRequests = discountRequests.map((discountItem) => ({
            id: discountItem.id,
            leadId: discountItem.leadId,
            leadName: discountItem.lead.customerName,
            leadPhone: discountItem.lead.phone,
            leadEmail: discountItem.lead.email,
            salesRep: {
                id: discountItem.requestedByUser.id,
                name: discountItem.requestedByUser.name,
                email: discountItem.requestedByUser.email,
            },
            requestedPercent: discountItem.requestedPercent,
            approvedPercent: discountItem.approvedPercent,
            baseTotal: Number(discountItem.lead.baseTotal),
            finalTotal: discountItem.approvedPercent
                ? Number(discountItem.lead.baseTotal) * (1 - discountItem.approvedPercent / 100)
                : Number(discountItem.lead.baseTotal) * (1 - discountItem.requestedPercent / 100),
            reason: discountItem.reason,
            rejectionReason: discountItem.rejectionReason,
            status: discountItem.status,
            campaignCount: discountItem.lead.campaignItems.length,
            requestedAt: discountItem.requestedAt,
            approvedAt: discountItem.approvedAt,
            createdAt: discountItem.createdAt,
            updatedAt: discountItem.updatedAt,
        }));

        return NextResponse.json({
            success: true,
            requests: formattedRequests,
            total: formattedRequests.length,
        });
    } catch (error) {
        console.error("GET_DISCOUNT_REQUESTS_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
