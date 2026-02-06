
import CartFooter from "@/components/CartFooter"
import Image from "next/image"
import ServiceQuoteCTA from "@/components/ServiceQuoteCTA"

export default function PillarBrandingPage() {
    return (
        <main className="min-h-screen bg-white text-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24">

                {/* Hero Section */}
                <div className="relative w-full aspect-[21/9] md:aspect-[16/6] mb-12 rounded-3xl overflow-hidden shadow-2xl group">
                    <Image
                        src="/images/services/pillar-branding.jpg"
                        alt="Urban Pillar Branding"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#002147]/90 via-transparent to-transparent opacity-90"></div>
                    <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 max-w-2xl text-white">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 uppercase tracking-wider drop-shadow-md">
                            Pillar Branding
                        </h1>
                        <p className="text-lg md:text-xl font-light text-gray-200 drop-shadow-sm">
                            Dominate the urban landscape with high-impact visibility on strategic metro and flyover pillars.
                        </p>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20 items-center">

                    {/* Left: Text Content */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold text-[#002147] mb-4 uppercase tracking-wide relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-blue-600 after:rounded-full">
                                Strategic Urban Visibility
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed mt-6 text-justify">
                                In the hustle of city life, <strong>Pillar Branding</strong> offers a unique opportunity to capture the attention of commuters where they spend a significant amount of time—on the roads. By transforming metro and flyover pillars into vibrant advertising canvases, your brand gains <strong>unmissable visibility</strong> in high-traffic corridors.
                            </p>
                            <p className="text-gray-600 text-lg leading-relaxed mt-4 text-justify">
                                Whether it's the daily office commute or a weekend outing, your message stays front and center, ensuring high recall and brand dominance. It is one of the most cost-effective ways to achieve <strong>mass reach</strong> and localized targeting simultaneously.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { title: "High Traffic Exposure", desc: "Reach thousands of daily commuters effortlessly." },
                                { title: "Strategic Locations", desc: "Prime spots on metro lines and key flyovers." },
                                { title: "24/7 Visibility", desc: "Non-stop brand presence, day and night." },
                                { title: "Cost-Effective", desc: "Maximum ROI for mass audience targeting." },
                            ].map((feature, idx) => (
                                <div key={idx} className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow duration-300 hover:border-blue-100">
                                    <h3 className="text-[#002147] font-bold text-lg mb-2">{feature.title}</h3>
                                    <p className="text-gray-500 text-sm">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Visual/Image */}
                    <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                        <Image
                            src="/images/services/pillar-branding.jpg"
                            alt="Pillar Branding Impact"
                            fill
                            className="object-cover"
                        />
                        {/* Optional Overlay Card */}
                        <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-xl max-w-xs hidden md:block animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <p className="text-[#002147] font-bold text-xl mb-1">10M+ Views</p>
                            <p className="text-gray-500 text-sm">Estimated monthly impressions across key city corridors.</p>
                        </div>
                    </div>
                </div>

                <ServiceQuoteCTA
                    serviceName="Pillar Branding"
                    title="Ready to Dominate the Streets?"
                    subtitle="Get a customized plan for your brand's pillar advertising campaign today."
                />

            </div>
            <CartFooter />
        </main>
    )
}
