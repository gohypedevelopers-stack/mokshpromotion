"use client"

import Link from "next/link"
import { ArrowLeft, Lock, Shield } from "lucide-react"

export default function PrivacyPage() {
    return (
        <div className="flex-grow bg-[#020a1a] font-sans selection:bg-red-600/30 text-gray-300 relative">

            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f2e5c] via-[#020a1a] to-[#000000]" />
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
            </div>

            <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-0">

                {/* Header */}
                <div className="max-w-4xl mx-auto mb-16">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-white transition-colors mb-8 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-lg bg-red-600/20 border border-red-500/30">
                            <Lock className="w-8 h-8 text-red-500" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                            Privacy Policy
                        </h1>
                    </div>
                    <p className="text-lg text-gray-400 max-w-2xl">
                        Your privacy is important to us. We are committed to protecting the personal information you share with us.
                    </p>
                    <div className="h-1 w-20 bg-red-600 mt-8 rounded-full shadow-[0_0_10px_rgba(227,30,36,0.5)]" />
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto space-y-12">

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <span className="text-red-500">01.</span> Information We Collect
                        </h2>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm hover:bg-white/[0.07] transition-colors">
                            <p className="leading-relaxed mb-4">
                                We collect information that you provide directly to us when you fill out forms, request quotes, or communicate with us.
                                This information may include:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-2">
                                <li>Name and contact details (email, phone number).</li>
                                <li>Company information and business needs.</li>
                                <li>Transaction history and service usage data.</li>
                                <li>Communications and correspondence.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <span className="text-red-500">02.</span> How We Use Your Information
                        </h2>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm hover:bg-white/[0.07] transition-colors">
                            <p className="leading-relaxed">
                                We use the information we collect for various purposes, including:
                            </p>
                            <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <li className="flex items-center gap-3">
                                    <Shield className="w-4 h-4 text-blue-400" />
                                    <span>Provide and improve our services</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Shield className="w-4 h-4 text-blue-400" />
                                    <span>Process transactions</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Shield className="w-4 h-4 text-blue-400" />
                                    <span>Send administrative information</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Shield className="w-4 h-4 text-blue-400" />
                                    <span>Respond to your inquiries</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <span className="text-red-500">03.</span> Data Security
                        </h2>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm hover:bg-white/[0.07] transition-colors">
                            <p className="leading-relaxed">
                                We implement appropriate technical and organizational measures to protect the security of your personal information.
                                However, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <span className="text-red-500">04.</span> Third-Party Disclosure
                        </h2>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm hover:bg-white/[0.07] transition-colors">
                            <p className="leading-relaxed">
                                We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties unless we provide
                                you with advance notice. This does not include website hosting partners and other parties who assist us in operating our
                                website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <span className="text-red-500">05.</span> Contact Us
                        </h2>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm hover:bg-white/[0.07] transition-colors">
                            <p className="leading-relaxed mb-4">
                                If you have any questions about this Privacy Policy, please contact us at:
                            </p>
                            <div className="flex flex-col md:flex-row gap-6">
                                <a href="mailto:privacy@mokshpromotion.com" className="text-blue-400 hover:text-white transition-colors">
                                    privacy@mokshpromotion.com
                                </a>
                                <span className="text-gray-500 hidden md:inline">|</span>
                                <a href="tel:+919643316767" className="text-blue-400 hover:text-white transition-colors">
                                    +91 9643316767
                                </a>
                            </div>
                        </div>
                    </section>

                    <div className="pt-8 border-t border-white/10 text-center">
                        <p className="text-sm text-gray-500">
                            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>

                </div>
            </main>
        </div>
    )
}
