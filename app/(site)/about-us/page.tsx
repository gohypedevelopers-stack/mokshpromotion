import CartFooter from "@/components/CartFooter"
import Image from "next/image"

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#002147] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-32">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">

                    {/* Left Column: Image/Illustration */}
                    <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 group">
                        <Image
                            src="/images/petrol-pump-demo.png"
                            alt="Moksh Team Collaboration"
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Overlay to mimic the blue tone of the illustration if needed */}
                        <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay"></div>
                    </div>

                    {/* Right Column: Text Content */}
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-8 uppercase tracking-wide">
                            ABOUT US
                        </h1>
                        <div className="space-y-6 text-gray-200 text-lg leading-relaxed text-justify">
                            <p>
                                <strong className="text-white">Moksh Promotion Limited</strong> is a leading Media Brand Solution company with a strong presence in Delhi, Mumbai, and Bangalore. We specialize in understanding the core needs of our clients and delivering tailor-made solutions that not only meet but often exceed expectations. At <strong className="text-white">Moksh Promotion</strong>, we believe in creating impactful brand experiences through strategic media planning, execution, and innovation.
                            </p>
                            <p>
                                With a proven track record, we maintain strong working relationships with top corporates, multinational companies (MNCs), and especially with the Petroleum Sector across India. Our deep industry connections and customer-first approach have positioned <strong className="text-white">Moksh Promotion Limited</strong> as a reliable name in the media and brand communication space.
                            </p>
                        </div>
                    </div>

                </div>

            </div>
            <CartFooter />
        </main>
    )
}
