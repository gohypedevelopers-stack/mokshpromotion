import CartFooter from "@/components/CartFooter"
import Image from "next/image"
import Link from "next/link"
import { User } from "lucide-react"
import { blogPosts } from "./blog-data"

export default function BlogPage() {
    return (
        <main className="min-h-screen bg-white text-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {blogPosts.map((post, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col overflow-hidden group">

                            {/* Image Container */}
                            <div className="relative w-full aspect-[4/3] overflow-hidden">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                {/* Green Badge */}
                                <span className="absolute top-4 right-4 bg-[#4cd964] text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wide">
                                    BLOG
                                </span>
                            </div>

                            {/* Content Section */}
                            <div className="px-6 pb-6 relative flex flex-col flex-grow">

                                {/* User Icon (Overlapping) */}
                                <div className="absolute -top-6 left-6">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center text-gray-500 shadow-sm">
                                        <User className="w-6 h-6" />
                                    </div>
                                </div>

                                <div className="mt-8 mb-4">
                                    <div className="group-hover:text-[#002147] transition-colors cursor-pointer">
                                        <Link href={`/blog/${post.slug}`}>
                                            <h3 className="text-lg font-bold text-gray-800 leading-tight mb-3">
                                                {post.title}
                                            </h3>
                                        </Link>
                                    </div>
                                    <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <Link href={`/blog/${post.slug}`} className="text-[11px] font-bold text-[#4cd964] hover:text-green-600 uppercase tracking-wide inline-flex items-center">
                                        READ MORE »
                                    </Link>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-100 my-auto"></div>

                                {/* Footer */}
                                <div className="pt-4 flex items-center justify-between text-[11px] text-gray-400 font-medium mt-auto">
                                    <span>{post.date}</span>
                                    <div className="flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                        <span>{post.comments}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
            <CartFooter />
        </main>
    )
}

