
import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const maxDuration = 300; // 5 minutes for large upserts
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const q = searchParams.get("search") || searchParams.get("q") || ""
    const state = searchParams.get("state")
    const city = searchParams.get("city")
    const district = searchParams.get("district")
    const districts = searchParams.get("districts")

    // Admin filtering
    const showAll = searchParams.get("showAll") === "true"

    // Optimize: strict select limit
    const LIMIT = 50

    try {
        const whereClause: any = {}

        // Public vs Admin visibility
        if (!showAll) {
            whereClause.isActive = true
            whereClause.availabilityStatus = 'AVAILABLE'
        }

        const selectFields = {
            id: true,
            inventoryCode: true, // Include new field
            outletName: true,
            locationName: true,
            state: true,
            district: true,
            city: true,
            areaType: true,
            widthFt: true,
            heightFt: true,
            areaSqft: true,
            ratePerSqft: true,
            discountedRate: true, // Include editable fields
            installationCharge: true,
            printingCharge: true,
            netTotal: true,
            isActive: true, // Include status
            availabilityStatus: true,
            // Legacy
            location: true,
            name: true,
            totalArea: true,
            rate: true
        }

        if (state) whereClause.state = state

        if (districts) {
            whereClause.district = { in: districts.split(",") }
        } else if (district) {
            whereClause.district = district
        }

        if (city && !district) {
            whereClause.OR = [
                { city: { contains: city } },
                { district: { contains: city } }
            ]
        }

        // Search Logic (Optimized for SQLite/Postgres)
        if (q) {
            // If specific modifiers are NOT present, use global search
            if (!state && !district && !city) {
                whereClause.OR = [
                    { inventoryCode: { contains: q } },
                    { locationName: { contains: q } },
                    { outletName: { contains: q } },
                    { district: { contains: q } },
                    { city: { contains: q } },
                    { state: { contains: q } },
                    { location: { contains: q } }
                ]
            }
        }

        const items = await db.inventoryHoarding.findMany({
            where: whereClause,
            take: LIMIT,
            orderBy: { createdAt: 'desc' },
            select: selectFields
        })

        const mappedItems = items.map((item: any) => ({
            id: item.id,
            inventoryCode: item.inventoryCode,
            sourceSrNo: item.sourceSrNo,
            outletName: item.outletName || item.name || '',
            locationName: item.locationName || item.location || '',
            district: item.district || item.city || '',
            state: item.state,
            city: item.city || item.district || '',
            areaType: item.areaType,
            widthFt: item.widthFt || item.width,
            heightFt: item.heightFt || item.height,
            areaSqft: item.areaSqft || item.totalArea,
            ratePerSqft: item.ratePerSqft || item.rate,
            discountedRate: Number(item.discountedRate || 0),
            printingCharge: item.printingCharge,
            netTotal: Number(item.netTotal || 0),
            isActive: item.isActive,
            availabilityStatus: item.availabilityStatus,
            location: item.outletName || item.locationName || item.name || item.location || '',
        }))

        return NextResponse.json(mappedItems)
    } catch (error) {
        console.error("Inventory Search Error:", error)
        return new NextResponse("Error fetching inventory", { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { data } = body

        if (!data || !Array.isArray(data) || data.length === 0) {
            return new NextResponse("Invalid data format", { status: 400 })
        }

        // Processing Logic - similar to import utils parse
        // We assume the frontend (InventoryUploader) or parser sent valid JSON matching ParsedInventoryItem structure
        // OR raw data? The Uploader component currently sends "Parsed/CSV" data which might need re-mapping.
        // Let's look at the implementation of Uploader. It sends `results.data` from PapaParse.
        // We need to map it to `inventoryCode`, etc.
        // Better: Utilize the `parseImportUtils` logic HERE or ensure frontend sends clean data.
        // The current `InventoryUploader` sends raw array of objects.
        // We will MAP it here using our strict logic.

        let successCount = 0;
        let updateCount = 0;
        let errorCount = 0;
        const errors: any[] = [];

        // We'll process sequentially for safety or use Promise.all with concurrency limit
        // SQLite doesn't like big Promise.all write. Sequential is safer.

        for (const rawItem of data) {
            // 1. Extract Inventory Code (Strict)
            // Fuzzy match keys
            const getVal = (keys: string[]) => {
                for (const k of keys) {
                    const val = Object.entries(rawItem).find(([key, v]) => key.toLowerCase().replace(/[^a-z0-9]/g, '') === k)?.[1];
                    if (val) return val;
                }
                return null;
            }

            const codeVal = getVal(["inventorycode", "code", "uniqueid", "id"]);
            const inventoryCode = codeVal ? String(codeVal).trim() : null;

            if (!inventoryCode) {
                errorCount++;
                errors.push(`Row missed Inventory Code: ${JSON.stringify(rawItem).slice(0, 50)}...`);
                continue;
            }

            // 2. Map other fields
            const outletName = getVal(["nameoftheoutlet", "outletname", "name", "location"]) || "Unknown Outlet";
            const locationName = getVal(["address", "location", "locationname"]) || "";
            const state = getVal(["state"]) || "";
            const district = getVal(["district"]) || "";

            // ... parsing numerics (simplified here, assuming data is relatively clean or we use helpers)
            // Re-using the logic from current file's mapping
            const width = parseFloat(String(getVal(["widthinft", "widthft", "width"]) || "0").replace(/[^\d.-]/g, '')) || null;
            const height = parseFloat(String(getVal(["heightinft", "heightft", "height"]) || "0").replace(/[^\d.-]/g, '')) || null;
            const rate = parseFloat(String(getVal(["rates", "ratepersqft", "rate"]) || "0").replace(/[^\d.-]/g, '')) || null;
            const discountedRate = parseFloat(String(getVal(["discountedrates", "discountedrate"]) || "0").replace(/[^\d.-]/g, '')) || null;
            const netTotal = parseFloat(String(getVal(["nettotal", "total"]) || "0").replace(/[^\d.-]/g, '')) || null;

            // 3. UPSERT
            // Check if exists
            const existing = await db.inventoryHoarding.findFirst({
                where: { inventoryCode }
            });

            const payLoad = {
                inventoryCode,
                outletName: String(outletName),
                locationName: String(locationName),
                state: String(state),
                district: String(district),
                widthFt: width,
                heightFt: height,
                ratePerSqft: rate,
                discountedRate: discountedRate,
                netTotal: netTotal,
                isActive: true, // Reactivate if it was archived? Yes, import usually implies active.
                // Preserve existing status if updating? 
                // If updating, we keep availabilityStatus. 
                // But isActive, if imported, should probably be true.
            };

            if (existing) {
                await db.inventoryHoarding.update({
                    where: { id: existing.id }, // Use ID for safer update
                    data: {
                        ...payLoad,
                        // Don't overwrite booked status or history
                    }
                });
                updateCount++;
            } else {
                await db.inventoryHoarding.create({
                    data: {
                        ...payLoad,
                        availabilityStatus: "AVAILABLE"
                    }
                });
                successCount++;
            }
        }

        return NextResponse.json({
            success: true,
            count: successCount + updateCount,
            created: successCount,
            updated: updateCount,
            failed: errorCount,
            errors,
            message: `Processed. Created: ${successCount}, Updated: ${updateCount}, Failed: ${errorCount}`
        })
    } catch (error) {
        console.error("INVENTORY_UPLOAD_ERROR", error)
        return new NextResponse("Failed to upload inventory", { status: 500 })
    }
}

export async function DELETE(req: Request) {
    // Soft Delete / Archive All? or specific?
    // User wants "Secure", no delete-all wipe.
    // The previous DELETE was "Delete All Data".
    // We should probably DISABLE this or change it to "Archive All" if needed.
    // For now, removing the "Delete All" capability or making it require Super Admin + Confirmation
    // Better: Return 405 Method Not Allowed to strictly prevent wipe.

    return new NextResponse("Bulk delete is disabled. Please use Archive.", { status: 405 })
}
