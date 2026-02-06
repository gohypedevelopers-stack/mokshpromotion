import CartFooter from "@/components/CartFooter"
import Image from "next/image"
import { ArrowUp } from "lucide-react"

export default function CaseStudyPage() {
    // Reusing existing car-related assets for the gallery
    const galleryImages = [
        "/images/case-studies/fiat.jpg",
        "/images/case-studies/tata-ev.jpg",
        "/images/case-studies/tata-four.jpg",
        "/images/case-studies/fiat.jpg"
    ]

    return (
        <main className="min-h-screen bg-[#032D52] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24">

                {/* Main Heading */}
                <h1 className="text-4xl md:text-5xl font-bold text-center mb-16 uppercase tracking-wide">
                    CASE STUDY
                </h1>

                {/* Top Section: Benefits & Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

                    {/* Left Column: Logo & Benefits */}
                    <div>
                        {/* CSS-only CARS24 Logo Representation */}
                        <div className="bg-white p-4 rounded-lg inline-block mb-8">
                            <div className="flex items-center gap-1">
                                <span className="text-5xl font-bold text-[#003d79] tracking-tighter">CARS</span>
                                <span className="bg-[#f5a623] text-white text-3xl font-bold px-2 py-1 rounded-sm transform -skew-x-12">24</span>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold mb-6">Benefits to Cars24</h2>
                        <ul className="space-y-4 text-gray-300 text-base leading-relaxed">
                            <li>• Petrol pumps hoardings gets 24/7 exposure to passengers, pedestrians and motorists and reach out to almost 1 Million people per day.</li>
                            <li>• Cost effective medium.</li>
                            <li>• Uncluttered atmosphere and media spaces.</li>
                            <li>• Elongated exposure to media spaces due to waiting lines.</li>
                            <li>• Product display of Cars24 at petrol pumps so that right target group either experience or book it from the same line to generate more revenue for them.</li>
                            <li>• Segregated clients of SEC A - B individuals.</li>
                        </ul>
                    </div>

                    {/* Right Column: Why Choose & Background */}
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Why Choose Moksh for Outdoor Ads?</h2>
                            <p className="text-gray-300 text-base leading-relaxed text-justify">
                                We craft compelling hoardings that engage and drive action. As outdoor advertising in India rapidly evolves, Moksh Promotions Ltd. leads the way—leveraging Petrol Pump Advertising and innovative formats to reach people on the move. With billboards and new media opportunities expanding across urban and rural India, we help brands stay visible everywhere. Want similar results? <span className="text-[#f5a623] cursor-pointer hover:underline">Contact our team</span> today for your next outdoor campaign.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Background of CARS24</h2>
                            <p className="text-gray-300 text-base leading-relaxed text-justify">
                                Founded in 2015, CARS24 is a tech-enabled disruptor in the used car market. Today, it is India’s largest platform for buying and selling used cars, with a strong presence in more than 75 major cities across the country. Unlike conventional methods such as classifieds, CARS24 uses a unique business model that delivers the best price in the fastest possible time—supported by expert assistance from start to finish.
                                <br /><br />
                                From a single office to over 207 branches nationwide, CARS24’s growth is a testament to its people—the real owners of the business, who are passionately solving a real and widespread consumer challenge.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Offering Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-6">What We Offered to CARS24</h2>
                    <p className="text-gray-300 text-base leading-relaxed max-w-5xl mx-auto text-center mb-8">
                        Moksh Promotions Ltd. identified Petrol Pump Advertising as a powerful and emerging branding opportunity in the media space. Every day, thousands of vehicles stop at fuel stations, making them high-footfall zones. This makes Petrol Pump Advertising an ideal channel for brands like CARS24 to reach their target audience with precision and frequency.
                    </p>
                    <p className="text-gray-300 text-base leading-relaxed max-w-5xl mx-auto text-center">
                        Such advertising is especially valuable in suburban or semi-urban areas, where traditional outdoor advertising like billboards is limited or absent. Petrol pump displays offer uninterrupted visibility and constant engagement with consumers during fuel stops.
                    </p>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
                    {galleryImages.map((src, index) => (
                        <div key={index} className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-lg border border-white/10 group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                            <Image
                                src={src}
                                alt={`Cars24 Campaign ${index + 1}`}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                    ))}
                </div>
                {/* Bottom Large Image (Reuse one) */}
                <div className="relative w-full max-w-3xl mx-auto aspect-[16/9] rounded-2xl overflow-hidden shadow-lg border border-white/10 group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 mb-16">
                    <Image
                        src="/images/case-studies/pnb.jpg"
                        alt="Cars24 Outdoor Campaign"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

            </div>
            <CartFooter />
        </main>
    )
}
