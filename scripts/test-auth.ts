
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'gohypedevelopers@gmail.com'
    const password = 'SuperAdmin123!'

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
