import CartFooter from "@/components/CartFooter"
import Image from "next/image"

export default function GalleryPage() {
    // Aggregating best images from various sections to form the gallery
    const galleryImages = [
        "/images/case-studies/okaya.jpg",
        "/images/services/btl-atl/standee-2.jpg",
        "/images/case-studies/uttarakhand.jpg",
        "/images/services/brandings/gallery-4.jpg",
        "/images/services/brandings/gallery-3.jpg",
        "/images/case-studies/pnb.jpg",
        "/images/services/display-space/hero.jpg",
        "/images/services/btl-atl/hero.jpg",
        "/images/case-studies/fiat.jpg"
    ]

    return (
        <main className="min-h-screen bg-[#032D52] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24">

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {galleryImages.map((src, index) => (
                        <div key={index} className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-lg border border-white/10 group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                            <Image
                                src={src}
                                alt={`Gallery Image ${index + 1}`}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                    ))}
                </div>

            </div>
            <CartFooter />
        </main>
    )
}
