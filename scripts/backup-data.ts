
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const db = new PrismaClient()

async function backup() {
    const models = [
        'user',
        'plan',
        'lead',
        'leadLog',
        'customer',
        'project',
        'invoice',
        'leadPayment',
        'paymentTransaction',
        'paymentFollowupNote',
        'paymentReminderLog',
        'reminder',
        'opsTask',
        'inventoryHoarding',
        'verificationToken',
        'leadCampaignItem',
        'discountRequest',
        // 'discountCode', // Handle carefully due to relation
        'auditLog',
        'discountInquiry',
        'adminOtp'
    ]

    const data: any = {}

    console.log('Starting backup...')

    for (const model of models) {
        try {
            // @ts-ignore
            if (db[model]) {
                console.log(`Backing up ${model}...`)
                // @ts-ignore
                const records = await db[model].findMany()
                data[model] = records
                console.log(`  -> ${records.length} records`)
            }
        } catch (e) {
            console.error(`Error backing up ${model}:`, e)
        }
    }

    // Handle DiscountCode separately if needed, or just included above if standard
    try {
        if (db.discountCode) {
            console.log(`Backing up discountCode...`)
            const records = await db.discountCode.findMany()
            data['discountCode'] = records
            console.log(`  -> ${records.length} records`)
        }
    } catch (e) { console.error("Error discountCode:", e) }

    fs.writeFileSync(path.join(process.cwd(), 'backup_data.json'), JSON.stringify(data, null, 2))
    console.log('Backup complete: backup_data.json')
}

backup()
    .catch(e => console.error(e))
    .finally(async () => {
        await db.$disconnect()
    })
