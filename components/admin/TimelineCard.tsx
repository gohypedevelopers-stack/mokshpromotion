"use client"

import { useState } from "react"
import { format, addMonths, addDays, isAfter, isBefore, startOfDay, parseISO } from "date-fns"
import { Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TimelineCardProps {
    leadId: number
    inventoryItems: any[]
    onUpdate?: () => void
}

export default function TimelineCard({ leadId, inventoryItems, onUpdate }: TimelineCardProps) {
    // State stores strings 'YYYY-MM-DD' for native input compatibility
    const [startDate, setStartDate] = useState<string>("")
    const [endDate, setEndDate] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    // Find existing booking
    const existingStart = inventoryItems.find(i => i.bookingStartDate)?.bookingStartDate
    const existingEnd = inventoryItems.find(i => i.bookingEndDate)?.bookingEndDate

    const handleQuickDuration = (months: number) => {
        if (!startDate) {
            toast({
                title: "Start Date Required",
                description: "Please select a start date first.",
                variant: "destructive"
            })
            return
        }

        try {
            const start = parseISO(startDate)
            const newEnd = addDays(addMonths(start, months), -1)
            setEndDate(format(newEnd, 'yyyy-MM-dd'))
        } catch (e) {
            console.error(e)
            toast({ title: "Invalid Date", description: "Could not calculate duration.", variant: "destructive" })
        }
    }

    const handleSave = async () => {
        if (!startDate || !endDate) {
            toast({ title: "Dates Required", description: "Select both start and end dates.", variant: "destructive" })
            return
        }

        if (startDate > endDate) {
            toast({ title: "Invalid Range", description: "End date cannot be before start date.", variant: "destructive" })
            return
        }

        setLoading(true)
        try {
            const payload = {
                inventoryIds: inventoryItems.map(i => i.inventoryHoardingId), // Must be inventoryHoardingId for API check
                bookingStartDate: startDate,
                bookingEndDate: endDate
            }

            const res = await fetch(`/api/admin/leads/${leadId}/timeline`, {
                method: 'PUT',
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json' }
            })

            if (!res.ok) {
                const msg = await res.text()
                throw new Error(msg)
            }

            toast({ title: "Success", description: "Timeline updated successfully." })
            if (onUpdate) onUpdate()

            // Optional: Refresh page to see new status
            window.location.reload()
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    // Derived Status for Display
    const getStatus = () => {
        if (!existingStart || !existingEnd) return { label: "NO BOOKING", color: "bg-gray-400" }

        const start = new Date(existingStart)
        const end = new Date(existingEnd)
        const today = startOfDay(new Date())

        if (isBefore(end, today)) return { label: "EXPIRED", color: "bg-red-500", info: "Visible on website" }
        if (isAfter(start, today)) return { label: "UPCOMING", color: "bg-blue-500", info: "Hidden (Reappears only after End Date)" }
        return { label: "ACTIVE", color: "bg-green-500", info: "Hidden (Live booking)" }
    }

    const status = getStatus()

    return (
        <Card className="mt-6 border-blue-100 shadow-sm">
            <CardHeader className="pb-3 border-b border-gray-100 bg-slate-50/50">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-medium text-slate-800">Booking Timeline</CardTitle>
                    <div className="flex gap-2 items-center">
                        <Badge className={cn("text-xs", status.color)}>{status.label}</Badge>
                    </div>
                </div>
                {status.info && <p className="text-xs text-muted-foreground">{status.info}</p>}
                {existingEnd && <p className="text-xs text-gray-500 mt-1">
                    Current: {format(new Date(existingStart), 'PP')} - {format(new Date(existingEnd), 'PP')}
                </p>}
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Start Date */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Booking Start Date</label>
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    {/* End Date */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Booking End Date</label>
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-4 flex flex-wrap gap-2">
                    {[1, 2, 3, 6, 12].map(m => (
                        <Button
                            key={m}
                            variant="secondary"
                            size="sm"
                            onClick={() => handleQuickDuration(m)}
                            className="text-xs"
                        >
                            {m} Month{m > 1 ? 's' : ''}
                        </Button>
                    ))}
                </div>

                {/* Save Button */}
                <div className="mt-6 flex justify-end">
                    <Button onClick={handleSave} disabled={loading} className="w-full md:w-auto bg-blue-900 hover:bg-blue-800">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        Save Timeline
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
