import { db } from "@/lib/db"
import { sendEmail } from "@/lib/email"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {

        const body = await req.json()
        const { name, email: rawEmail, phone, city, items, serviceInterest } = body
        const email = rawEmail?.toLowerCase()

        // Calculate Totals
        let baseTotal = 0
        const campaignItemsCreate = (items || []).map((item: any) => {
            const netTotal = Number(item.netTotal) || 0 // Assuming netTotal is sent from frontend cart item
            baseTotal += netTotal

            return {
                inventoryHoardingId: Number(item.id),
                rate: Number(item.rate) || 0, // Fallbacks if not present
                printingCharge: Number(item.printingCharge) || 0,
                total: netTotal
            }
        })

        // 1. Create Lead in CRM with Campaign Items
        const noteText = serviceInterest
            ? `Interested in Service: ${serviceInterest}. City: ${city}.`
            : `City: ${city}. Interested in ${items?.length || 0} locations.`

        const lead = await db.lead.create({
            data: {
                customerName: name,
                email,
                phone,
                source: serviceInterest ? "WEBSITE_SERVICE_INQUIRY" : "WEBSITE_CART_QUOTE",
                status: "NEW",
                notes: noteText,

                // Pricing Info
                baseTotal: baseTotal,
                finalTotal: baseTotal, // No discount yet

                // Create related campaign items only if there are items
                campaignItems: campaignItemsCreate.length > 0 ? {
                    create: campaignItemsCreate
                } : undefined
            }
        })

        // 2. Send Email to Admin
        const itemsHtml = items && items.length > 0
            ? `<h3>Locations Requested (${items.length}):</h3>
               <ul>
                   ${items.map((i: any) => `<li>${i.name || 'Hoarding'} - ${i.location} (${i.city}) - ₹${i.netTotal}</li>`).join('')}
               </ul>`
            : `<p><strong>Service Interest:</strong> ${serviceInterest}</p>`

        const adminHtml = `
            <h2>New Quote Request</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>City:</strong> ${city}</p>
            ${baseTotal > 0 ? `<p><strong>Estimated value:</strong> ₹${baseTotal.toLocaleString('en-IN')}</p>` : ''}
            ${itemsHtml}
        `
        // Send to a default admin email or the SMTP_USER
        await sendEmail({
            to: process.env.SMTP_USER || "admin@example.com",
            subject: `New Quote Request from ${name}`,
            html: adminHtml
        })

        // 3. Send Confirmation to Client
        const clientMessage = serviceInterest
            ? `<p>We have received your inquiry for <strong>${serviceInterest}</strong> services.</p>`
            : `<p>We have received your request for <strong>${items?.length} locations</strong>.</p>`

        await sendEmail({
            to: email,
            subject: "We received your quote request",
            html: `
                <h2>Thank you for your interest!</h2>
                <p>Hi ${name},</p>
                ${clientMessage}
                <p>Our sales team will review your requirements and get back to you shortly with a formal quote.</p>
                <br/>
                <p>Best Regards,<br/>Moksh Promotion Team</p>
            `
        })

        return NextResponse.json({ success: true, leadId: lead.id })
    } catch (error) {
        console.error("QUOTE_API_ERROR", error)
        return NextResponse.json({ success: false, error: "Failed to process quote" }, { status: 500 })
    }
}
