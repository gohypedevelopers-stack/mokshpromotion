import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getAllUsers() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true,
            },
            orderBy: {
                id: 'asc',
            },
        })

        console.log('\n==============================================')
        console.log('📋 ALL USERS IN DATABASE')
        console.log('==============================================\n')

        if (users.length === 0) {
            console.log('❌ No users found in database.\n')
            console.log('💡 Run this to create a Super Admin:')
            console.log('   npx tsx scripts/create-super-admin.ts\n')
            return
        }

        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.name}`)
            console.log(`   Email: ${user.email}`)
            console.log(`   Role: ${user.role}`)
            console.log(`   Phone: ${user.phone || 'N/A'}`)
            console.log(`   ID: ${user.id}`)
            console.log(`   Created: ${user.createdAt.toLocaleDateString('en-IN')}`)
            console.log('')
        })

        console.log('==============================================')
        console.log(`Total Users: ${users.length}`)
        console.log('==============================================\n')

        console.log('⚠️  IMPORTANT: Passwords are hashed and cannot be retrieved.')
        console.log('📝 Known passwords from seed scripts:\n')
        console.log('   Super Admin (SUPER_ADMIN_EMAIL): SUPER_ADMIN_PASSWORD')
        console.log('   Other users: Check individual seed scripts or reset password\n')

    } catch (error) {
        console.error('❌ Error fetching users:', error)
    } finally {
        await prisma.$disconnect()
    }
}

getAllUsers()
