import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Resetting InventoryHoarding sequence...')
  try {
    // This SQL works for PostgreSQL
    const result = await prisma.$executeRawUnsafe(
      `SELECT setval(pg_get_serial_sequence('"InventoryHoarding"', 'id'), coalesce(max(id), 0) + 1, false) FROM "InventoryHoarding";`
    )
    console.log('Sequence reset result:', result)
    console.log('Success! Your inventory primary key sequence is now synced.')
  } catch (error) {
    console.error('Error resetting sequence:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
