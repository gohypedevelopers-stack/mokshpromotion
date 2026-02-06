import CartFooter from "@/components/CartFooter"

export default function ServicesPage() {
    const services = [
        {
            title: "Fuel Stations Media",
            description: "Maximize your brand's presence with OOH media at fuel stations. Capture attention in high-traffic zones and connect with target audiences through strategically placed, high-visibility branding that drives lasting recall.",
        },
        {
            title: "BTL / ATL",
            description: "Implement product sampling campaigns designed to engage the right audience. Allowing vehicle owners to experience your service firsthand helps establish your brand in a memorable and impactful way.",
        },
        {
            title: "Display Space",
            description: "Boost your product's visibility with our premium showroom-like setups at HPCL petrol pumps. Engage customers with live product displays and interactive sampling/activation opportunities.",
        },
        {
            title: "Standee / Pillar Branding",
            description: "Enhance brand visibility with standee displays and pillar branding. Utilize strategic placement and small stickers at fuel stations to capture attention and promote your product effectively.",
        }
    ]

    return (
        <main className="min-h-screen bg-[#032D52] py-20 pb-24 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-16 text-center">
                    WHAT SERVICES WE OFFER
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {services.map((service) => (
                        <div
                            key={service.title}
                            className="bg-transparent p-8 rounded-lg border-2 border-white/80 hover:border-white hover:bg-white/5 transition-all"
                        >
                            <h2 className="text-xl font-bold mb-6 text-center">
                                {service.title}
                            </h2>
                            <p className="text-white/90 text-center leading-relaxed">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <CartFooter />
        </main>
    )
}
