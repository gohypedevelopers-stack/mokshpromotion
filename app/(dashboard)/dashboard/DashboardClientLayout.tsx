"use client"

import { useState } from "react"
import { SessionProvider } from "next-auth/react"
import { Sidebar, Topbar } from "@/components/dashboard/Sidebar"
import type { Session } from "next-auth"

interface DashboardClientLayoutProps {
    children: React.ReactNode
    session: Session | null
}

function DashboardShell({ children, role }: { children: React.ReactNode; role: string | undefined }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <Sidebar role={role} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-[1600px] mx-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default function DashboardClientLayout({ children, session }: DashboardClientLayoutProps) {
    return (
        <SessionProvider session={session}>
            <DashboardShell role={session?.user?.role}>
                {children}
            </DashboardShell>
        </SessionProvider>
    )
}
