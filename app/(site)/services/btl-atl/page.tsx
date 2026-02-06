import CartFooter from "@/components/CartFooter"
import Image from "next/image"
import ServiceQuoteCTA from "@/components/ServiceQuoteCTA"

export default function BtlAtlPage() {
    return (
        <main className="min-h-screen bg-white text-gray-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24">

                {/* Hero Image */}
                <div className="w-full relative aspect-[16/9] mb-8 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <Image
                        src="/images/services/btl-atl/hero.jpg"
                        alt="Fuel Station Advertising"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Main Heading */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#002147] mb-4 uppercase tracking-wide">
                        ATL & BTL Advertising
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-base leading-relaxed">
                        Product sampling frequently targets the ideal audience mix, pivotal for brands aiming to establish a strong market presence by allowing diverse vehicle owners to experience their products or services firsthand.
                    </p>
                </div>

                {/* Two Column Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="flex flex-col items-center group">
                        <h3 className="text-sm font-bold uppercase tracking-wide mb-3 text-[#002147]">ACTIVATION STANDEE</h3>
                        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                            <Image
                                src="/images/services/btl-atl/standee-1.jpg"
                                alt="Activation Standee"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col items-center group">
                        <h3 className="text-sm font-bold uppercase tracking-wide mb-3 text-[#002147]">ACTIVATION STANDEE</h3>
                        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                            <Image
                                src="/images/services/btl-atl/standee-2.jpg"
                                alt="Activation Standee"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom Large Image */}
                <div className="flex flex-col items-center mb-16 relative group w-full">
                    <h3 className="text-sm font-bold uppercase tracking-wide mb-3 text-[#002147]">INNOVATIVE BRANDING AT HPCL</h3>
                    <div className="relative w-full max-w-2xl aspect-[16/9] rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-1">
                        <Image
                            src="/images/services/btl-atl/innovative.jpg"
                            alt="Innovative Branding at HPCL"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>



                <ServiceQuoteCTA
                    serviceName="BTL / ATL Activations"
                    title="Ready to Activate Your Brand?"
                    subtitle="Get a customized plan for your BTL/ATL campaigns today."
                />

            </div>
            <CartFooter />
        </main>
    )
}
