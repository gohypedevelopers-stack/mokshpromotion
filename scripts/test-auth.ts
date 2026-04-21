
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = process.env.SUPER_ADMIN_EMAIL || process.env.ADMIN_EMAIL || 'admin@mokshpromotion.com'
    const password = process.env.SUPER_ADMIN_PASSWORD || 'admin123'

    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) {
        console.log('User not found')
        return
    }

    const isMatch = await bcrypt.compare(password, user.password)
    console.log(`Password match for ${email}: ${isMatch}`)
    console.log(`Hash in DB: ${user.password}`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
