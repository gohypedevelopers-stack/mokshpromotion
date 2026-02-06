"use client"

import { useState } from "react"
import { User, Mail, Phone, MessageSquare, Send, Loader2, MapPin, CheckCircle2, Sparkles } from "lucide-react"

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        description: ""
    })

    const isFormValid = Object.values(formData).every(value => value.trim() !== "")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isFormValid) return

        setIsSubmitting(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        console.log("Form submitted:", formData)
        alert("Message sent! We'll get back to you shortly.")
        setIsSubmitting(false)
        setFormData({ firstName: "", lastName: "", email: "", phone: "", description: "" })
    }

    return (
        <div className="flex-grow bg-[#020a1a] font-sans selection:bg-red-600/30 relative">

            {/* Background Branding - Subtle Depth */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Radial Gradient for 'Spotlight' effect */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f2e5c] via-[#020a1a] to-[#000000]" />
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
            </div>

            <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">

                {/* 1. HERO SECTION */}
                <div className="pt-28 pb-12 md:pt-36 md:pb-16 text-center max-w-4xl mx-auto space-y-6">

                    {/* Brand Pill */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-md">
                        <span className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_8px_rgba(227,30,36,0.6)]" />
                        <span className="text-xs font-bold text-gray-200 tracking-widest uppercase">Moksh Promotion Limited</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-lg">
                        Let’s <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">Collaborate</span> on <br className="hidden md:block" />
                        Your Next Success.
                    </h1>

                    {/* Subtext */}
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto font-medium">
                        Fill out the form below for premium branding, outdoor media, and strategic campaign planning.
                    </p>
                </div>

                {/* 2. LAYOUT SECTION */}
                <div className="max-w-6xl mx-auto pb-0 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

                    {/* Left Column: Info & Trust */}
                    <div className="hidden lg:block lg:col-span-5 space-y-8 pt-4">
                        <div className="space-y-6">
                            <h3 className="text-white text-xl font-bold border-l-4 border-red-600 pl-4 py-1">
                                Why Industry Leaders Choose Us
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className="bg-red-600/20 p-2 rounded-lg">
                                        <CheckCircle2 className="w-5 h-5 text-red-500" />
                                    </div>
                                    <span className="text-gray-200 font-medium">Pan-India Network Access</span>
                                </li>
                                <li className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className="bg-red-600/20 p-2 rounded-lg">
                                        <CheckCircle2 className="w-5 h-5 text-red-500" />
                                    </div>
                                    <span className="text-gray-200 font-medium">Premium Inventory Quality</span>
                                </li>
                                <li className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className="bg-red-600/20 p-2 rounded-lg">
                                        <CheckCircle2 className="w-5 h-5 text-red-500" />
                                    </div>
                                    <span className="text-gray-200 font-medium">24/7 Campaign Support</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Column: The HIGH CONTRAST Form */}
                    <div className="lg:col-span-7 w-full">
                        <div className="bg-[#002147] border border-blue-400/10 rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden group">

                            {/* Subtle Top Red Line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-red-600 shadow-[0_0_15px_rgba(227,30,36,0.3)]" />

                            <div className="mb-8 text-center md:text-left">
                                <h3 className="text-2xl font-bold text-white">Send a Message</h3>
                                <p className="text-blue-100/70 text-sm mt-1">We typically reply within 24 hours.</p>
                            </div>

                            <form className="space-y-5" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* First Name */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="firstName" className="text-sm font-semibold text-gray-200 ml-1">First Name <span className="text-red-500">*</span></label>
                                        <div className="relative group">
                                            <div className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-red-600 transition-colors z-10 pointer-events-none">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="text"
                                                id="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required
                                                placeholder="John"
                                                className="w-full bg-white text-slate-900 border-2 border-transparent rounded-xl pl-10 pr-4 py-3 font-medium placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-0 transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Last Name */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="lastName" className="text-sm font-semibold text-gray-200 ml-1">Last Name <span className="text-red-500">*</span></label>
                                        <div className="relative group">
                                            <div className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-red-600 transition-colors z-10 pointer-events-none">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="text"
                                                id="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                required
                                                placeholder="Doe"
                                                className="w-full bg-white text-slate-900 border-2 border-transparent rounded-xl pl-10 pr-4 py-3 font-medium placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-0 transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Email */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="email" className="text-sm font-semibold text-gray-200 ml-1">Work Email <span className="text-red-500">*</span></label>
                                        <div className="relative group">
                                            <div className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-red-600 transition-colors z-10 pointer-events-none">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="email"
                                                id="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="john@company.com"
                                                className="w-full bg-white text-slate-900 border-2 border-transparent rounded-xl pl-10 pr-4 py-3 font-medium placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-0 transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="phone" className="text-sm font-semibold text-gray-200 ml-1">Phone Number <span className="text-red-500">*</span></label>
                                        <div className="relative group">
                                            <div className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-red-600 transition-colors z-10 pointer-events-none">
                                                <Phone className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="tel"
                                                id="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                placeholder="+91 98765 00000"
                                                className="w-full bg-white text-slate-900 border-2 border-transparent rounded-xl pl-10 pr-4 py-3 font-medium placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-0 transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-1.5">
                                    <label htmlFor="description" className="text-sm font-semibold text-gray-200 ml-1">How can we help? <span className="text-red-500">*</span></label>
                                    <div className="relative group">
                                        <div className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-red-600 transition-colors z-10 pointer-events-none">
                                            <MessageSquare className="w-5 h-5" />
                                        </div>
                                        <textarea
                                            id="description"
                                            rows={4}
                                            value={formData.description}
                                            onChange={handleChange}
                                            required
                                            placeholder="Tell us about your campaign details, locations, or budget..."
                                            className="w-full bg-white text-slate-900 border-2 border-transparent rounded-xl pl-10 pr-4 py-3 font-medium placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-0 transition-all resize-none shadow-sm"
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={!isFormValid || isSubmitting}
                                        className={`w-full relative overflow-hidden rounded-xl font-bold text-lg py-4 transition-all duration-300 transform shadow-lg
                                            ${isFormValid && !isSubmitting
                                                ? "bg-[#E31E24] hover:bg-[#c9181d] text-white hover:-translate-y-1 hover:shadow-red-600/30 active:translate-y-0"
                                                : "bg-red-400/50 text-white/50 cursor-not-allowed border border-white/5"
                                            }`}
                                    >
                                        <span className="relative flex items-center justify-center gap-2">
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    SUBMIT REQUEST
                                                    <Send className="w-5 h-5" />
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

