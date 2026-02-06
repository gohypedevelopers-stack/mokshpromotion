import { db } from "@/lib/db"
import CartFooter from "@/components/CartFooter"
import Image from "next/image"
import InventoryList from "@/components/InventoryList"

export default async function PetrolPumpMediaPage() {
    const caseStudies = [
        {
            title: "PUNJAB NATIONAL BANK",
            image: "/images/case-studies/pnb.jpg"
        },
        {
            title: "FIAT CAR",
            image: "/images/case-studies/fiat.jpg"
        },
        {
            title: "BAJAJ ALLIANZ GENERAL INSURANCE",
            image: "/images/case-studies/bajaj.jpg"
        },
        {
            title: "CANARA BANK",
            image: "/images/case-studies/canara.jpg"
        },
        {
            title: "TATA FOUR WHEELER",
            image: "/images/case-studies/tata-four.jpg"
        },
        {
            title: "OKAYA BATTARIES",
            image: "/images/case-studies/okaya.jpg"
        },
        {
            title: "TATA EV",
            image: "/images/case-studies/tata-ev.jpg"
        },
        {
            title: "UTTARAKHAND GRAMIN BANK",
            image: "/images/case-studies/uttarakhand.jpg"
        },
        {
            title: "COVID-19 AWARENESS",
            image: "/images/case-studies/covid.jpg"
        }
    ]


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

                {/* Campaigns / Case Studies Section */}
                <h2 className="text-3xl font-bold text-[#002147] mb-8 text-center uppercase tracking-wide">
                    Our Campaigns
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mb-20 max-w-6xl mx-auto">
                    {caseStudies.map((study, index) => (
                        <div key={index} className="flex flex-col items-center group">
                            <h3 className="text-sm font-bold text-[#002147] mb-4 text-center tracking-wide uppercase">
                                {study.title}
                            </h3>
                            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                                <Image
                                    src={study.image}
                                    alt={study.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                        </div>
                    ))}
                </div>

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
