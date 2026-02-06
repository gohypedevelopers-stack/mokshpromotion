import { db } from "@/lib/db"
import { NextResponse, type NextRequest } from "next/server"
import { unstable_cache } from 'next/cache'

// Dynamically mark as dynamic since it depends on query params
export const dynamic = 'force-dynamic'

// Cache districts query per state for 5 minutes
const getCachedDistricts = (state: string) => unstable_cache(
    async () => {
        // Get all districts in the state with count using GROUP BY
        const districts = await (db.inventoryHoarding.groupBy as any)({
            by: ['district'],
            where: {
                state: state,
                availabilityStatus: 'AVAILABLE',
                isActive: true
            },
            _count: {
                id: true
            }
        })

        return districts
            .map((d: any) => ({
                district: d.district!,
                count: d._count.id
            }))
            .sort((a: any, b: any) => a.district.localeCompare(b.district))
    },
    [`inventory-districts-${state}`],
    {
        revalidate: 300, // 5 minutes
        tags: ['inventory-districts', `inventory-districts-${state}`]
    }
)()

/**
 * GET /api/inventory/districts?state=XYZ
 * Returns list of districts with hoarding counts for a given state
 * Cached for 5 minutes for better performance
 */
export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams
        const state = searchParams.get("state")

        if (!state) {
            return new NextResponse("State parameter is required", { status: 400 })
        }

        const districtList = await getCachedDistricts(state)

        return NextResponse.json(districtList, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
            }
        })
    } catch (error) {
        console.error('Error fetching districts:', error)
        return new NextResponse("Failed to fetch districts", { status: 500 })
    }
}
