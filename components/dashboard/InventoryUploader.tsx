"use client"

import { useState } from "react"
import Papa from "papaparse"
import readXlsxFile from 'read-excel-file'
import { useRouter } from "next/navigation"
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, Download, Edit } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { bulkUpdatePrices } from "@/app/actions/inventory"
import { toast } from "sonner" // or standard toast

export default function InventoryUploader() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    // Bulk Update State
    const [bulkModalOpen, setBulkModalOpen] = useState(false)
    const [bulkCsv, setBulkCsv] = useState("")

    const postData = async (data: any[]) => {
        try {
            const response = await fetch("/api/inventory", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data }),
            })

            const resData = await response.json()

            if (!response.ok) {
                // If the API returns detailed errors
                if (resData.errors && resData.errors.length > 0) {
                    throw new Error(`Import Failed. Errors: ${resData.errors.slice(0, 3).join(", ")} ${(resData.errors.length > 3 ? "..." : "")}`)
                }
                throw new Error(resData.message || "Failed to import data")
            }

            setSuccess(`Success! Created: ${resData.created}, Updated: ${resData.updated}.`)
            if (resData.failed > 0) {
                setError(`Completed with ${resData.failed} failed rows. Check console/logs.`)
            }
            router.refresh()
        } catch (err: any) {
            setError(err.message || "Failed to upload inventory. Please check the file format.")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target
        const file = target.files?.[0]
        if (!file) return

        setLoading(true)
        setError("")
        setSuccess("")

        const fileExt = file.name.split('.').pop()?.toLowerCase()

        try {
            if (fileExt === 'xlsx' || fileExt === 'xls') {
                const sheets = await readXlsxFile(file, { getSheets: true } as any) as unknown as any[]
                let allData: any[] = []

                for (const sheet of sheets) {
                    const rows = await readXlsxFile(file, { sheet: sheet.name })
                    if (rows.length < 2) continue

                    // Smart Header Detection
                    let headerRowIndex = -1
                    let headers: string[] = []

                    for (let i = 0; i < Math.min(rows.length, 10); i++) {
                        const row = rows[i] as string[]
                        const rowNormalized = row.map(c => c?.toString().toLowerCase().trim())

                        // Look for Inventory Code OR State/District
                        if (rowNormalized.includes('inventory code') || rowNormalized.includes('code') || (rowNormalized.includes('state') && rowNormalized.includes('district'))) {
                            headerRowIndex = i
                            headers = row.map(h => h?.toString().trim())
                            break
                        }
                    }

                    if (headerRowIndex === -1) {
                        headerRowIndex = 0
                        headers = (rows[0] as string[]).map(h => h?.toString().trim())
                    }

                    // Slice from the row AFTER the header row
                    const sheetData = rows.slice(headerRowIndex + 1).map(row => {
                        const obj: any = {}
                        headers.forEach((header, index) => {
                            if (header) {
                                obj[header] = row[index]
                            }
                        })
                        return obj
                    })
                    allData = [...allData, ...sheetData]
                }

                if (allData.length === 0) throw new Error("No valid data found in any sheet")
                await postData(allData)
            } else {
                // CSV Fallback
                Papa.parse(file, {
                    header: true,
                    skipEmptyLines: true,
                    transformHeader: (h) => h.trim(),
                    complete: async (results) => {
                        await postData(results.data)
                    },
                    error: (err) => {
                        setError("Error parsing CSV file: " + err.message)
                        setLoading(false)
                    }
                })
            }
        } catch (err: any) {
            setError("Error parsing file: " + err.message)
            setLoading(false)
        }
        target.value = ""
    }

    const handleExportData = async () => {
        setLoading(true)
        try {
            const response = await fetch("/api/inventory?showAll=true") // Fetch all for export
            if (!response.ok) throw new Error("Failed to fetch data")
            const data = await response.json()
            const csv = Papa.unparse(data)
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'inventory_export.csv')
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            setSuccess("Inventory exported successfully.")
        } catch (err) {
            setError("Failed to export inventory.")
        } finally {
            setLoading(false)
        }
    }

    const handleBulkUpdate = async () => {
        if (!bulkCsv) return
        setLoading(true)
        try {
            const res = await bulkUpdatePrices(bulkCsv)
            if (res.success) {
                setSuccess(`Bulk update successful. Updated ${res.count} items.`)
                if (res.errors && res.errors.length > 0) {
                    setError(`Some updates failed:\n${res.errors.join("\n")}`)
                }
                setBulkModalOpen(false)
                setBulkCsv("")
                router.refresh()
            } else {
                setError(res.error || "Failed to update")
            }
        } catch (e) {
            setError("Error submitting bulk update")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-green-600" />
                Inventory Actions
            </h3>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Import Box */}
                <div className="flex-1 space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer relative bg-gray-50/50">
                        <input
                            type="file"
                            accept=".csv, .xlsx, .xls"
                            onChange={handleFileUpload}
                            disabled={loading}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <div className="flex flex-col items-center justify-center space-y-2">
                            {loading ? (
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            ) : (
                                <Upload className="w-8 h-8 text-gray-400" />
                            )}
                            <p className="text-sm font-medium text-gray-700">Import Excel / CSV</p>
                            <p className="text-xs text-gray-500">Upsert Mode: Updates existing by Code, Creates new.</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 justify-center min-w-[200px]">
                    <Button onClick={handleExportData} disabled={loading} variant="outline" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" /> Export All CSV
                    </Button>

                    <Dialog open={bulkModalOpen} onOpenChange={setBulkModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full justify-start">
                                <Edit className="w-4 h-4 mr-2" /> Bulk Price Update
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Bulk Update Prices</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <p className="text-sm text-gray-500">
                                    Paste CSV data below. Format: <span className="font-mono bg-gray-100 p-1">inventoryCode,discountedRate</span>
                                </p>
                                <Textarea
                                    placeholder={`CHD-001,360000\nCHD-002,210000`}
                                    rows={10}
                                    value={bulkCsv}
                                    onChange={(e) => setBulkCsv(e.target.value)}
                                    className="font-mono text-sm"
                                />
                            </div>
                            <DialogFooter>
                                <Button onClick={handleBulkUpdate} disabled={loading || !bulkCsv}>
                                    {loading ? "Updating..." : "Run Update"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {(error || success) && (
                <div className="mt-4 space-y-2">
                    {error && (
                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded whitespace-pre-wrap">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded">
                            <CheckCircle className="w-4 h-4 flex-shrink-0" />
                            {success}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
