
"use client"

import { useState } from "react"
import QuoteModal from "@/components/QuoteModal"

interface ServiceQuoteCTAProps {
    serviceName: string
    title: string
    subtitle: string
    buttonText?: string
}

export default function ServiceQuoteCTA({
    serviceName,
    title,
    subtitle,
    buttonText = "Request a Quote"
}: ServiceQuoteCTAProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <>
            <div className="bg-[#002147] rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden mt-16">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2"></div>

                <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                    <h2 className="text-3xl md:text-5xl font-bold">{title}</h2>
                    <p className="text-blue-100 text-lg md:text-xl font-light">
                        {subtitle}
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-white text-[#002147] px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all hover:scale-105 shadow-xl"
                    >
                        {buttonText}
                    </button>
                </div>
            </div>

            <QuoteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                serviceInterest={serviceName}
            />
        </>
    )
}
