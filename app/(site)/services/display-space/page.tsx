import CartFooter from "@/components/CartFooter"
import Image from "next/image"
import { ArrowUp, ArrowDown } from "lucide-react"
import ServiceQuoteCTA from "@/components/ServiceQuoteCTA"

export default function DisplaySpacePage() {
    const galleryImages = [
        "/images/services/display-space/gallery-1.jpg",
        "/images/services/display-space/gallery-2.jpg",
        "/images/services/display-space/gallery-3.jpg",
        "/images/services/display-space/gallery-1.jpg",
        "/images/services/display-space/gallery-2.jpg",
        "/images/services/display-space/gallery-3.jpg",
        "/images/services/display-space/gallery-1.jpg",
        "/images/services/display-space/gallery-2.jpg",
        "/images/services/display-space/gallery-3.jpg",
    ]

    return (
        <main className="min-h-screen bg-white text-gray-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24">

                {/* Hero Image */}
                <div className="w-full relative aspect-[4/3] md:aspect-[16/9] mb-12 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <Image
                        src="/images/services/display-space/hero.jpg"
                        alt="Product Display at Fuel Station"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Main Heading */}
                <div className="text-center mb-12 relative">
                    <h1 className="text-3xl md:text-5xl font-bold text-black mb-4 uppercase tracking-wide">
                        PRODUCT DISPLAY
                    </h1>
                    {/* Floating Icons */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 hidden lg:flex flex-col gap-40">
                        <div className="w-10 h-10 rounded-full border border-red-300 flex items-center justify-center text-red-500 bg-white shadow-sm">
                            <ArrowUp className="w-5 h-5" />
                        </div>
                        <div className="w-10 h-10 rounded-full border border-red-300 flex items-center justify-center text-red-500 bg-white shadow-sm">
                            <ArrowDown className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {galleryImages.map((src, index) => (
                        <div key={index} className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                            <Image
                                src={src}
                                alt={`Display Gallery ${index + 1}`}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                    ))}
                </div>



                <ServiceQuoteCTA
                    serviceName="Display Space"
                    title="Ready to Showcase Your Product?"
                    subtitle="Secure premium display spaces for maximum visibility today."
                />

            </div>
            <CartFooter />
        </main>
    )
}
