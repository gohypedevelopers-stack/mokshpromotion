
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="w-full h-full p-6 space-y-6">
            <div className="flex justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 w-64" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-8 space-y-6">
                    <Skeleton className="h-48 w-full rounded-xl" />
                    <Skeleton className="h-48 w-full rounded-xl" />
                </div>
                <div className="col-span-4">
                    <Skeleton className="h-96 w-full rounded-xl" />
                </div>
            </div>
        </div>
    )
}
