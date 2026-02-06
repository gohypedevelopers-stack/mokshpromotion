
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const password = 'admin123'
    const users = await prisma.user.findMany({
        select: { email: true, password: true, role: true }
    })

    console.log('--- Auth Verification ---')
    for (const user of users) {
        const isMatch = await bcrypt.compare(password, user.password)
        console.log(`${user.email} (${user.role}): ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`)
    }
}

main().catch(console.error).finally(() => prisma.$disconnect())
