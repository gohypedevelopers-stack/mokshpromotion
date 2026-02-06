
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'admin@example.com'
    const password = 'admin123'

    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) {
        console.log('User admin@example.com not found')
        return
    }

    const isMatch = await bcrypt.compare(password, user.password)
    console.log(`Password match for ${email}: ${isMatch}`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
