import { db } from "@/lib/db"
import CartFooter from "@/components/CartFooter"
import InventoryList from "@/components/InventoryList"

export default async function PetrolPumpMediaPage() {
    // Fetch Inventory Data - Filtered to AVAILABLE only
    // Update: Hide if bookingEndDate >= Today (Active or Upcoming booking exists)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    const inventory = await (db.inventoryHoarding.findMany as any)({
        where: {
            isActive: true, // Only show active items
            // Logic: Not Exists a LeadItem where bookingEndDate >= Today
            leadItems: {
                none: {
                    bookingEndDate: {
                        not: null, // Ensure not null
                        gte: today // Current or Future booking (covers Active and Upcoming)
                    }
                }
            }
        },
        select: {
            id: true,
            outletName: true,
            locationName: true,
            state: true,
            district: true,
            widthFt: true,
            heightFt: true,
            width: true,
            height: true,
            ratePerSqft: true,
            discountedRate: true,
            rate: true,
            areaType: true,
            totalArea: true,
            areaSqft: true,
            printingCharge: true,
            installationCharge: true,
            netTotal: true,
            availabilityStatus: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // Transform Prisma Decimals to numbers for client component and strip extra fields
    const serializedInventory = inventory.map((item: any) => ({
        id: item.id,
        outletName: item.outletName,
        locationName: item.locationName,
        state: item.state,
        district: item.district,
        widthFt: item.widthFt ? Number(item.widthFt) : null,
        heightFt: item.heightFt ? Number(item.heightFt) : null,
        width: item.width ? Number(item.width) : null,
        height: item.height ? Number(item.height) : null,
        ratePerSqft: item.ratePerSqft ? Number(item.ratePerSqft) : null,
        discountedRate: item.discountedRate ? Number(item.discountedRate) : null,
        rate: item.rate ? Number(item.rate) : null,
        areaType: item.areaType,
        totalArea: item.totalArea ? Number(item.totalArea) : null,
        areaSqft: item.areaSqft ? Number(item.areaSqft) : null,
        printingCharge: item.printingCharge ? Number(item.printingCharge) : null,
        installationCharge: item.installationCharge ? Number(item.installationCharge) : null,
        netTotal: item.netTotal ? Number(item.netTotal) : null
    }));

    return (
        <main className="min-h-screen bg-white py-20 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">

                {/* Inventory List Section */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-[#002147] mb-8 text-center uppercase tracking-wide">
                        Available Inventory
                    </h2>

                    <InventoryList inventory={serializedInventory} />
                </div>

            </div>
            <CartFooter />
        </main>
    )
}
