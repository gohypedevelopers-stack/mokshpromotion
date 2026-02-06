
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const db = new PrismaClient()

// Helper to convert ISO strings to Date objects deeply
function deserialize(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(deserialize)
    } else if (obj !== null && typeof obj === 'object') {
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                // Simple regex for ISO date
                if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj[key])) {
                    obj[key] = new Date(obj[key])
                }
            } else if (typeof obj[key] === 'object') {
                obj[key] = deserialize(obj[key])
            }
        }
    }
    return obj
}

async function restore() {
    const filePath = path.join(process.cwd(), 'backup_data.json')
    if (!fs.existsSync(filePath)) {
        console.error('Backup file not found:', filePath)
        return
    }

    const rawData = fs.readFileSync(filePath, 'utf-8')
    const data = deserialize(JSON.parse(rawData))

    console.log('Restoring data...')

    // Order matters!
    // 1. Independent / Root entities
    await restoreModel('user', data.user)
    await restoreModel('customer', data.customer)

    // 2. Level 1 Dependencies
    await restoreModel('lead', data.lead) // Needs User
    await restoreModel('project', data.project) // Needs Customer, User (salesUserId)
    await restoreModel('plan', data.plan) // Needs User

    // 3. Level 2 Dependencies
    await restoreModel('inventoryHoarding', data.inventoryHoarding) // Needs Lead (currentLeadId)
    await restoreModel('leadLog', data.leadLog) // Needs Lead
    await restoreModel('invoice', data.invoice) // Needs Project
    await restoreModel('reminder', data.reminder) // Needs Project
    await restoreModel('opsTask', data.opsTask) // Needs Project
    await restoreModel('leadPayment', data.leadPayment) // Needs Lead (leadId)

    // 4. Level 3 Dependencies
    await restoreModel('leadCampaignItem', data.leadCampaignItem) // Needs Lead, Inventory
    await restoreModel('paymentTransaction', data.paymentTransaction) // Needs LeadPayment
    await restoreModel('paymentFollowupNote', data.paymentFollowupNote) // Needs LeadPayment
    await restoreModel('paymentReminderLog', data.paymentReminderLog) // Needs LeadPayment

    // 5. Discounts and Others
    await restoreModel('discountRequest', data.discountRequest) // Needs Lead
    // DiscountCode?
    if (data.discountCode) {
        await restoreModel('discountCode', data.discountCode)
    }

    await restoreModel('discountInquiry', data.discountInquiry) // Needs User
    await restoreModel('adminOtp', data.adminOtp) // Needs Inquiry
    await restoreModel('auditLog', data.auditLog)
    await restoreModel('verificationToken', data.verificationToken)

    console.log('Restore complete!')
}

async function restoreModel(modelName: string, records: any[]) {
    if (!records || records.length === 0) return

    console.log(`Restoring ${modelName} (${records.length} records)...`)
    // @ts-ignore
    if (!db[modelName]) {
        console.error(`Model ${modelName} not found on Prisma Client`)
        return
    }

    let success = 0
    let failed = 0

    // We use createMany for speed if possible, but createMany doesn't support all databases fully with specific IDs sometimes? 
    // Postage supports createMany.
    // BUT: If there are foreign key violations due to bad ordering or self-relations, row-by-row is safer for debugging.
    // Also createMany skips duplicates? No.
    // Let's use loop with create (upsert-like behavior manual?) or just createMany.
    // Using createMany ensures one query per batch.

    try {
        // @ts-ignore
        await db[modelName].createMany({
            data: records,
            skipDuplicates: true
        })
        success = records.length
    } catch (e: any) {
        console.warn(`Batch insert for ${modelName} failed or partial (` + e.message + `). Trying row-by-row...`)
        // Fallback
        for (const record of records) {
            try {
                // @ts-ignore
                await db[modelName].create({
                    data: record
                })
                success++
            } catch (err: any) {
                if (err.code !== 'P2002') { // Unique constraint
                    console.error(`Failed to insert ${modelName} ID ${record.id}:`, err.message)
                }
                failed++
            }
        }
    }

    console.log(`  -> ${success} inserted, ${failed} skipped/failed`)
}

restore()
    .catch(e => console.error(e))
    .finally(async () => {
        await db.$disconnect()
    })
