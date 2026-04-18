import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-48" />
            </div>

            {/* Upload & Actions Section Skeleton */}
            <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>

            {/* Table Skeleton */}
            <div className="bg-white rounded-lg border shadow-sm">
                <div className="p-4 border-b space-y-3">
                    <div className="flex justify-between gap-4">
                        <Skeleton className="h-10 flex-1 max-w-sm" />
                        <div className="flex gap-2">
                            <Skeleton className="h-10 w-32" />
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </div>
                </div>
                <div className="p-4 space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex gap-4 p-2 border-b last:border-0 items-center">
                            <Skeleton className="h-4 w-16" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
