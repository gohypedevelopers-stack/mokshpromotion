import CartFooter from "@/components/CartFooter"
import Image from "next/image"
import { ArrowUp } from "lucide-react"

export default function BrandingsPage() {
    return (
        <main className="min-h-screen bg-white text-gray-900">
            {/* White Section: Hero & Text */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24">

                {/* Hero Image */}
                <div className="w-full relative aspect-[21/9] mb-10 rounded-sm overflow-hidden shadow-sm">
                    <Image
                        src="/images/services/brandings/hero.jpg"
                        alt="Petrol Pump Branding"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Main Heading & Text */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-black mb-6 uppercase tracking-wide">
                        BRANDING
                    </h1>
                    <p className="text-gray-700 max-w-4xl mx-auto text-lg leading-relaxed">
                        Standee displays maximize product visibility, while pillar branding and small stickers are highly effective at fuel stations, making them a powerful part of our Branding & Advertising Campaigns.
                    </p>
                </div>
            </div>

            {/* Blue Background Gallery Section */}
            <div className="w-full bg-[#113a6b] py-16 pb-24 relative">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Top Row: 2 Large Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white p-2 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
                                <Image
                                    src="/images/services/brandings/gallery-1.jpg"
                                    alt="Branding Display 1"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                        <div className="bg-white p-2 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
                                <Image
                                    src="/images/services/brandings/gallery-2.jpg"
                                    alt="Branding Display 2"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: 2 Smaller Cards (Centered logic or just grid) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full md:w-4/5 mx-auto">
                        <div className="bg-white p-2 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
                                <Image
                                    src="/images/services/brandings/gallery-3.jpg"
                                    alt="Branding Display 3"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                        <div className="bg-white p-2 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
                                <Image
                                    src="/images/services/brandings/gallery-4.jpg"
                                    alt="Branding Display 4"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Floating Icon (Decorative) */}
                    <div className="absolute right-8 bottom-8">
                        <div className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center text-white bg-white/10 backdrop-blur-sm shadow-md">
                            <ArrowUp className="w-6 h-6" />
                        </div>
                    </div>

                </div>
            </div>

            <CartFooter />
        </main>
    )
}
