"use client"

import Link from "next/link"
import { ArrowLeft, ShieldCheck, ScrollText } from "lucide-react"

export default function TermsPage() {
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
                        <div className="p-3 rounded-lg bg-blue-600/20 border border-blue-500/30">
                            <ScrollText className="w-8 h-8 text-blue-400" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                            Terms & Conditions
                        </h1>
                    </div>
                    <p className="text-lg text-gray-400 max-w-2xl">
                        Please read these terms and conditions carefully before using our services.
                    </p>
                    <div className="h-1 w-20 bg-red-600 mt-8 rounded-full shadow-[0_0_10px_rgba(227,30,36,0.5)]" />
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto space-y-12">

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <span className="text-red-500">01.</span> Introduction
                        </h2>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm hover:bg-white/[0.07] transition-colors">
                            <p className="leading-relaxed">
                                Welcome to Moksh Promotion Limited. These Terms and Conditions govern your use of our website and services.
                                By accessing or using our services, you agree to be bound by these terms. If you disagree with any part of the terms,
                                you may not access our services.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <span className="text-red-500">02.</span> Intellectual Property
                        </h2>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm hover:bg-white/[0.07] transition-colors">
                            <p className="leading-relaxed mb-4">
                                The Service and its original content, features, and functionality are and will remain the exclusive property of
                                Moksh Promotion Limited and its licensors. The Service is protected by copyright, trademark, and other laws of both
                                India and foreign countries.
                            </p>
                            <p className="leading-relaxed">
                                Our trademarks and trade dress may not be used in connection with any product or service without the prior
                                written consent of Moksh Promotion Limited.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <span className="text-red-500">03.</span> User Responsibilities
                        </h2>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm hover:bg-white/[0.07] transition-colors">
                            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-2">
                                <li>You agree not to use the Service for any unlawful purpose.</li>
                                <li>You must not attempt to reverse engineer any aspect of the Service.</li>
                                <li>You represent and warrant that all information you provide is accurate and complete.</li>
                                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <span className="text-red-500">04.</span> Limitation of Liability
                        </h2>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm hover:bg-white/[0.07] transition-colors">
                            <p className="leading-relaxed">
                                In no event shall Moksh Promotion Limited, nor its directors, employees, partners, agents, suppliers, or affiliates,
                                be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation,
                                loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability
                                to access or use the Service.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <span className="text-red-500">05.</span> Changes to Terms
                        </h2>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm hover:bg-white/[0.07] transition-colors">
                            <p className="leading-relaxed">
                                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material
                                we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change
                                will be determined at our sole discretion.
                            </p>
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
