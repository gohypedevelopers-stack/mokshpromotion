import { db } from "@/lib/db"
import { NextResponse, NextRequest } from "next/server"

export const dynamic = 'force-dynamic'

/**
 * GET /api/inventory/districts?state=UP
 * Returns list of districts in a state with count of locations
 */
export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams
        const state = searchParams.get("state")

        if (!state) {
            return new NextResponse("State parameter is required", { status: 400 })
        }

        // Get all districts in the state with count
        const districts = await (db.inventoryHoarding.groupBy as any)({
            by: ['district'],
            where: {
                state: state,
                availabilityStatus: 'AVAILABLE'
            },
            _count: {
                id: true
            }
        })

        const districtList = districts
            .map((d: any) => ({
                district: d.district!,
                count: d._count.id
            }))
            .sort((a: any, b: any) => a.district.localeCompare(b.district))

        return NextResponse.json(districtList)
    } catch (error) {
        console.error('Error fetching districts:', error)
        return new NextResponse("Failed to fetch districts", { status: 500 })
    }
}
