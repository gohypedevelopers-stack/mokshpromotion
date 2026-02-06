import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { User, Calendar, ArrowLeft, Clock, Share2, Facebook, Twitter, Linkedin } from "lucide-react"
import CartFooter from "@/components/CartFooter"
import { blogPosts } from "../blog-data"

export default function BlogPost({ params }: { params: { slug: string } }) {
    const post = blogPosts.find((p) => p.slug === params.slug)
    const isPremium = params.slug === "eco-friendly-outdoor-advertising"

    if (!post) {
        notFound()
    }

    if (isPremium) {
        return (
            <main className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-[#4cd964] selection:text-white">

                {/* Immersive Hero Section */}
                <div className="relative w-full h-[60vh] min-h-[500px] flex items-end justify-center pb-16">
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

                    <div className="absolute top-24 left-4 sm:left-8">
                        <Link href="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/10 hover:bg-white/20">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Blog
                        </Link>
                    </div>

                    <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                        <div className="inline-flex items-center gap-2 bg-[#4cd964] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-lg shadow-green-500/20">
                            Blog Post
                        </div>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center gap-6 text-white/90 text-sm md:text-base font-medium">
                            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                                <div className="w-8 h-8 rounded-full bg-white text-[#002147] flex items-center justify-center">
                                    <User className="w-4 h-4" />
                                </div>
                                <span>By Admin</span>
                            </div>
                            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                                <Calendar className="w-4 h-4 text-[#4cd964]" />
                                <span>{post.date}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                                <Clock className="w-4 h-4 text-[#4cd964]" />
                                <span>5 min read</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">

                        {/* Main Content */}
                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-gray-200/50">
                            <article className="prose prose-lg md:prose-xl max-w-none 
                                prose-headings:text-[#002147] prose-headings:font-bold prose-headings:tracking-tight
                                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-gray-100
                                prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-6
                                prose-a:text-[#4cd964] prose-a:font-semibold prose-a:no-underline hover:prose-a:text-[#002147] prose-a:transition-colors
                                prose-strong:text-[#002147] prose-strong:font-bold
                                prose-ul:list-disc prose-ul:pl-6 prose-li:text-gray-600 prose-li:mb-2 prose-li:marker:text-[#4cd964]
                                prose-blockquote:border-l-4 prose-blockquote:border-[#4cd964] prose-blockquote:bg-green-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:italic prose-blockquote:text-gray-700
                                ">
                                {/* Intro Text */}
                                <p className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed mb-10 border-l-4 border-[#002147] pl-6 italic">
                                    {post.excerpt}
                                </p>

                                <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />
                            </article>

                            {/* Article Footer */}
                            <div className="mt-16 pt-8 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Share this</span>
                                    <div className="flex gap-2">
                                        <button className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                                            <Facebook className="w-5 h-5" />
                                        </button>
                                        <button className="w-10 h-10 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center hover:bg-sky-100 transition-colors">
                                            <Twitter className="w-5 h-5" />
                                        </button>
                                        <button className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center hover:bg-blue-100 transition-colors">
                                            <Linkedin className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:pt-20 space-y-8">
                            {/* About Author Widget */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100 sticky top-24">
                                <h3 className="text-lg font-bold text-[#002147] mb-6 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-[#4cd964] rounded-full"></span>
                                    About the Author
                                </h3>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border-2 border-white shadow-md">
                                        <User className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">Moksh Admin</div>
                                        <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Content Team</div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    Sharing insights on outdoor advertising strategies, brand growth, and marketing trends in India.
                                </p>
                            </div>

                            {/* Categories Widget */}
                            <div className="bg-[#002147] rounded-2xl p-6 text-white shadow-lg">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-[#4cd964] rounded-full"></span>
                                    Top Categories
                                </h3>
                                <ul className="space-y-3">
                                    {['Petrol Pump Ads', 'CNG Branding', 'Outdoor Media', 'Marketing Strategy', 'Case Studies'].map((cat, i) => (
                                        <li key={i}>
                                            <Link href="#" className="flex items-center justify-between group hover:text-[#4cd964] transition-colors">
                                                <span className="text-sm font-medium">{cat}</span>
                                                <ArrowLeft className="w-4 h-4 rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Final Thoughts / CTA Section (Below Content) */}
                    <div className="mt-16 mb-20">
                        <div className="bg-gradient-to-r from-[#002147] to-[#003366] rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#4cd964]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#4cd964]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                            <div className="relative z-10 max-w-3xl mx-auto">
                                <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Boost Your Brand Visibility?</h2>
                                <p className="text-lg text-white/80 mb-8 leading-relaxed">
                                    Don't let your brand get lost in the crowd. Partner with Moksh Promotion for high-impact outdoor advertising solutions that deliver real ROI.
                                </p>
                                <Link href="/contact" className="inline-flex items-center gap-2 bg-[#4cd964] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-green-600 transition-all shadow-lg hover:shadow-green-500/30 transform hover:-translate-y-1">
                                    Get a Free Consultation
                                    <ArrowLeft className="w-5 h-5 rotate-180" />
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
                <CartFooter />
            </main>
        )
    }

    // Default Design (Restored)
    return (
        <main className="min-h-screen bg-white text-gray-900 font-sans">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24">

                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-5xl font-bold text-[#002147] leading-tight mb-6">
                        {post.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8 border-b border-gray-100 pb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                <User className="w-4 h-4" />
                            </div>
                            <span className="font-medium">By Admin</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[#4cd964] font-bold uppercase tracking-wider">Blog</span>
                        </div>
                    </div>
                </div>

                {/* Featured Image */}
                <div className="relative w-full aspect-video mb-12 rounded-xl overflow-hidden shadow-lg">
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Content Section */}
                <article className="prose prose-lg max-w-none prose-headings:text-[#002147] prose-headings:font-bold prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-[#4cd964] prose-a:no-underline hover:prose-a:text-green-600 prose-img:rounded-xl">
                    <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />
                </article>

                {/* Back to Blog */}
                <div className="mt-16 pt-8 border-t border-gray-100">
                    <Link href="/blog" className="inline-flex items-center text-[#002147] font-bold hover:text-[#4cd964] transition-colors">
                        ← Back to Blog
                    </Link>
                </div>

            </div>
            <CartFooter />
        </main>
    )
}
