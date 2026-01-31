
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log("Starting Verification...")

    // 1. Setup: Create a Host and a Car
    const host = await prisma.user.create({
        data: {
            name: "Test Host",
            email: `host-${Date.now()}@example.com`,
            role: "HOST"
        }
    })

    const car = await prisma.car.create({
        data: {
            make: "TestMake",
            model: "TestModel",
            year: 2024,
            pricePerDay: 100,
            hostId: host.id,
            status: "PUBLISHED",
            location: "Colombo"
        }
    })

    console.log(`Created Car: ${car.id}`)

    // 2. Create a Booking (Jan 10 - Jan 15)
    // Dates need to be ISO strings or Date objects
    // Note: JS months are 0-indexed
    const startDate = new Date("2024-01-10T10:00:00Z")
    const endDate = new Date("2024-01-15T10:00:00Z")

    const booking1 = await prisma.booking.create({
        data: {
            carId: car.id,
            userId: host.id, // User booking their own car for simplicity
            startDate: startDate,
            endDate: endDate,
            totalCost: 500,
            status: "CONFIRMED"
        }
    })
    console.log(`Created Initial Booking: ${startDate.toISOString()} to ${endDate.toISOString()}`)

    // 3. Test Booking Overlap Logic (Simulation, not calling the action directly)
    // Try to book Jan 12 - Jan 18
    const testStart = new Date("2024-01-12")
    const testEnd = new Date("2024-01-18")

    const overlap = await prisma.booking.findFirst({
        where: {
            carId: car.id,
            status: "CONFIRMED",
            AND: [
                { startDate: { lte: testEnd } },
                { endDate: { gte: testStart } }
            ]
        }
    })

    if (overlap) {
        console.log("✅ SUCCESS: Overlap detected correctly.")
    } else {
        console.error("❌ FAILURE: Overlap NOT detected.")
    }

    // 4. Test Search Query Logic
    // Search for Jan 12 - Jan 18. Should NOT find the car.
    const searchResultLocked = await prisma.car.findMany({
        where: {
            id: car.id,
            status: 'PUBLISHED',
            NOT: {
                bookings: {
                    some: {
                        status: "CONFIRMED",
                        AND: [
                            { startDate: { lte: testEnd } },
                            { endDate: { gte: testStart } }
                        ]
                    }
                }
            }
        }
    })

    if (searchResultLocked.length === 0) {
        console.log("✅ SUCCESS: Search correctly excluded booked car.")
    } else {
        console.error("❌ FAILURE: Search found the car despite it being booked.")
    }

    // 5. Test Search Query Logic (Clean dates)
    // Search for Jan 20 - Jan 25. Should find the car.
    const cleanStart = new Date("2024-01-20")
    const cleanEnd = new Date("2024-01-25")

    const searchResultClean = await prisma.car.findMany({
        where: {
            id: car.id,
            status: 'PUBLISHED',
            NOT: {
                bookings: {
                    some: {
                        status: "CONFIRMED",
                        AND: [
                            { startDate: { lte: cleanEnd } },
                            { endDate: { gte: cleanStart } }
                        ]
                    }
                }
            }
        }
    })

    if (searchResultClean.length === 1) {
        console.log("✅ SUCCESS: Search correctly found available car.")
    } else {
        console.error("❌ FAILURE: Search did NOT find available car.")
    }

    // Cleanup
    await prisma.car.delete({ where: { id: car.id } })
    await prisma.user.delete({ where: { id: host.id } })
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
