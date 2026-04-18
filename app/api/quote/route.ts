import { Prisma } from "@prisma/client"
import { db } from "@/lib/db"
import { sendEmail } from "@/lib/email"
import { NextResponse } from "next/server"

type QuoteItemInput = {
    id?: unknown
    name?: unknown
    location?: unknown
    city?: unknown
    rate?: unknown
    printingCharge?: unknown
    netTotal?: unknown
}

type NormalizedQuoteItem = {
    id: number
    name: string
    location: string
    city: string
    rate: number
    printingCharge: number
    netTotal: number
}

const toText = (value: unknown) => (typeof value === "string" ? value.trim() : "")

const toPositiveInt = (value: unknown): number | null => {
    const num = Number(value)
    if (!Number.isInteger(num) || num <= 0) return null
    return num
}

const toMoney = (value: unknown): number => {
    const num = Number(value)
    if (!Number.isFinite(num) || num < 0) return 0
    return num
}

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
const isPhone = (value: string) => /^[0-9+\-() ]{7,20}$/.test(value)

const getEmailWarningMessage = (
    target: "admin" | "client",
    result: { code?: string; reason?: "AUTH_FAILED" | "SEND_FAILED" }
) => {
    if (result.reason === "AUTH_FAILED" || result.code === "EAUTH") {
        // Do not expose SMTP auth configuration issues to end users.
        return null
    }
    return target === "admin"
        ? "Admin notification email failed."
        : "Client confirmation email failed."
}

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as Record<string, unknown>

        const name = toText(body.name)
        const email = toText(body.email).toLowerCase()
        const phone = toText(body.phone)
        const city = toText(body.city)
        const serviceInterest = toText(body.serviceInterest) || null

        if (!name || !email || !phone || !city) {
            return NextResponse.json(
                { success: false, error: "Please fill all required fields." },
                { status: 400 }
            )
        }

        if (!isEmail(email)) {
            return NextResponse.json(
                { success: false, error: "Please enter a valid email address." },
                { status: 400 }
            )
        }

        if (!isPhone(phone)) {
            return NextResponse.json(
                { success: false, error: "Please enter a valid phone number." },
                { status: 400 }
            )
        }

        const rawItems = Array.isArray(body.items) ? (body.items as QuoteItemInput[]) : []
        const normalizedItems = rawItems
            .map((item) => {
                const id = toPositiveInt(item?.id)
                if (!id) return null

                return {
                    id,
                    name: toText(item?.name) || "Hoarding",
                    location: toText(item?.location) || "N/A",
                    city: toText(item?.city) || city,
                    rate: toMoney(item?.rate),
                    printingCharge: toMoney(item?.printingCharge),
                    netTotal: toMoney(item?.netTotal),
                } satisfies NormalizedQuoteItem
            })
            .filter((item): item is NormalizedQuoteItem => item !== null)

        if (!serviceInterest && normalizedItems.length === 0) {
            return NextResponse.json(
                { success: false, error: "No valid locations found in cart. Please reselect your inventory." },
                { status: 400 }
            )
        }

        let validItems: NormalizedQuoteItem[] = []
        let skippedItems = 0

        if (normalizedItems.length > 0) {
            const existingInventory = await db.inventoryHoarding.findMany({
                where: { id: { in: normalizedItems.map((item) => item.id) } },
                select: { id: true },
            })

            const validIdSet = new Set(existingInventory.map((row) => row.id))
            validItems = normalizedItems.filter((item) => validIdSet.has(item.id))
            skippedItems = normalizedItems.length - validItems.length
        }

        if (!serviceInterest && validItems.length === 0) {
            return NextResponse.json(
                { success: false, error: "Selected locations are no longer available. Please refresh and try again." },
                { status: 400 }
            )
        }

        const baseTotal = validItems.reduce((sum, item) => sum + item.netTotal, 0)
        const itemCount = validItems.length

        let noteText = serviceInterest
            ? `Interested in Service: ${serviceInterest}. City: ${city}.`
            : `City: ${city}. Interested in ${itemCount} locations.`

        if (skippedItems > 0) {
            noteText += ` Skipped ${skippedItems} invalid/removed item(s).`
        }

        const lead = await db.lead.create({
            data: {
                customerName: name,
                email,
                phone,
                source: serviceInterest ? "WEBSITE_SERVICE_INQUIRY" : "WEBSITE_CART_QUOTE",
                status: "NEW",
                notes: noteText,
                baseTotal,
                finalTotal: baseTotal,
                campaignItems:
                    validItems.length > 0
                        ? {
                              create: validItems.map((item) => ({
                                  inventoryHoardingId: item.id,
                                  rate: item.rate,
                                  printingCharge: item.printingCharge,
                                  total: item.netTotal,
                              })),
                          }
                        : undefined,
            },
        })

        const itemsHtml =
            validItems.length > 0
                ? `<h3>Locations Requested (${validItems.length}):</h3>
                   <ul>
                       ${validItems
                           .map(
                               (item) =>
                                   `<li>${item.name} - ${item.location} (${item.city}) - INR ${item.netTotal.toLocaleString("en-IN")}</li>`
                           )
                           .join("")}
                   </ul>`
                : `<p><strong>Service Interest:</strong> ${serviceInterest}</p>`

        const adminHtml = `
            <h2>New Quote Request</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>City:</strong> ${city}</p>
            ${baseTotal > 0 ? `<p><strong>Estimated value:</strong> INR ${baseTotal.toLocaleString("en-IN")}</p>` : ""}
            ${itemsHtml}
        `

        const emailWarnings: string[] = []

        const adminEmailResult = await sendEmail({
            to: process.env.SMTP_USER || "admin@example.com",
            subject: `New Quote Request from ${name}`,
            html: adminHtml,
        })
        if (!adminEmailResult.success) {
            const warning = getEmailWarningMessage("admin", adminEmailResult)
            if (warning) emailWarnings.push(warning)
        }

        const clientMessage = serviceInterest
            ? `<p>We have received your inquiry for <strong>${serviceInterest}</strong> services.</p>`
            : `<p>We have received your request for <strong>${validItems.length} locations</strong>.</p>`

        const clientEmailResult = await sendEmail({
            to: email,
            subject: "We received your quote request",
            html: `
                <h2>Thank you for your interest!</h2>
                <p>Hi ${name},</p>
                ${clientMessage}
                <p>Our sales team will review your requirements and get back to you shortly with a formal quote.</p>
                <br/>
                <p>Best Regards,<br/>Moksh Promotion Team</p>
            `,
        })
        if (!clientEmailResult.success) {
            const warning = getEmailWarningMessage("client", clientEmailResult)
            if (warning) emailWarnings.push(warning)
        }

        const uniqueWarnings = Array.from(new Set(emailWarnings))

        return NextResponse.json({
            success: true,
            leadId: lead.id,
            skippedItems,
            warning: uniqueWarnings.length > 0 ? uniqueWarnings.join(" ") : undefined,
        })
    } catch (error) {
        console.error("QUOTE_API_ERROR", error)

        if (error instanceof Prisma.PrismaClientInitializationError) {
            return NextResponse.json(
                { success: false, error: "Database is temporarily unavailable. Please try again in a few minutes." },
                { status: 503 }
            )
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2003") {
                return NextResponse.json(
                    { success: false, error: "One or more selected locations are invalid. Please refresh and retry." },
                    { status: 400 }
                )
            }
        }

        return NextResponse.json(
            { success: false, error: "Failed to process quote request. Please try again." },
            { status: 500 }
        )
    }
}
