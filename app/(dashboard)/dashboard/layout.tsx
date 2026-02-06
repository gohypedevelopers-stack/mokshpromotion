import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import DashboardClientLayout from "./DashboardClientLayout"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions)

    return (
        <DashboardClientLayout session={session}>
            {children}
        </DashboardClientLayout>
    )
}
