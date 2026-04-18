import { db } from "@/lib/db"
import { serializeDecimal } from "@/lib/utils"

export const dynamic = 'force-dynamic'
import InventoryUploader from "@/components/dashboard/InventoryUploader"
import InventoryTable from "@/components/dashboard/InventoryTable"

export default async function InventoryPage() {
    const inventory = await db.inventoryHoarding.findMany({
        select: {
            id: true,
            inventoryCode: true,
            outletName: true,
            locationName: true,
            state: true,
            district: true,
            isActive: true,
            discountedRate: true,
            netTotal: true,
            availabilityStatus: true,
            createdAt: true,
        },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Inventory Management</h1>
            </div>

            {/* Upload & Actions Section */}
            <InventoryUploader />

            {/* Interactive Inventory Table */}
            <InventoryTable initialData={serializeDecimal(inventory) as any} />
        </div>
    )
}
