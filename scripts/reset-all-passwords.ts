
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const password = 'admin123'
    const hashedPassword = await bcrypt.hash(password, 10)

    const emails = [
        'admin@example.com',
        'sales@example.com',
        'finance@example.com',
        'ops@example.com'
    ]

    for (const email of emails) {
        await prisma.user.updateMany({
            where: { email },
            data: { password: hashedPassword }
        })
        console.log(`Updated password for ${email}`)
    }
}

main().catch(console.error).finally(() => prisma.$disconnect())
