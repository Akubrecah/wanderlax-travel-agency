
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- FETCHING COLUMNS FOR BOOKING TABLE ---')
  try {
    const columns = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Booking'
    `
    console.log(JSON.stringify(columns, null, 2))
    

    console.log('--- TESTING MINIMAL BOOKING CREATE ---')
    const testUser = await prisma.user.findFirst()
    if (testUser) {
      try {
        const testBook = await prisma.booking.create({
          data: {
            bookingRef: `TEST-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
            userId: testUser.id,
            serviceType: "CUSTOM",
            status: "PENDING",
            totalAmount: 100,
            finalAmount: 100,
          }
        })
        console.log('Test booking created successfully:', testBook.id)
        // Clean up
        await prisma.booking.delete({ where: { id: testBook.id } })
      } catch (err: any) {
        console.error('Minimal create failed with error:', err.message)
      }
    } else {
      console.log('No test user found, skipping create test.')
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
