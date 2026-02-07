import CartFooter from "@/components/CartFooter"
import Image from "next/image"

export default function FuelStationMediaPage() {
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

    return (
        <main className="min-h-screen bg-white py-20 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">

                {/* Page Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-[#002147] mb-4 text-center uppercase tracking-wide">
                    Fuel Station Media
                </h1>
                <p className="text-gray-700 text-center mb-12 max-w-3xl mx-auto text-lg">
                    Maximize your brand's presence with OOH media at fuel stations. Capture attention in high-traffic zones and connect with target audiences through strategically placed, high-visibility branding.
                </p>

                {/* Our Campaigns Section */}
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

            </div>
            <CartFooter />
        </main>
    )
}
