
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    // Clean up existing data (optional, but good for idempotent seed)
    // await prisma.car.deleteMany()
    // await prisma.user.deleteMany()

    // Create a Host User
    const host = await prisma.user.upsert({
        where: { email: 'host@example.com' },
        update: {},
        create: {
            email: 'host@example.com',
            name: 'John Host',
            role: 'HOST',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop',
        },
    })

    console.log({ host })

    const cars = [
        {
            make: 'Toyota',
            model: 'Corolla',
            year: 2023,
            pricePerDay: 45,
            category: 'Sedan',
            location: 'Colombo',
            image: 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?q=80&w=2000&auto=format&fit=crop',
        },
        {
            make: 'Honda',
            model: 'CR-V',
            year: 2022,
            pricePerDay: 60,
            category: 'SUV',
            location: 'Kandy',
            image: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=1974&auto=format&fit=crop',
        },
        {
            make: 'Toyota',
            model: 'Hiace',
            year: 2020,
            pricePerDay: 80,
            category: 'Van',
            location: 'Galle',
            image: 'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?q=80&w=2072&auto=format&fit=crop',
        },
        {
            make: 'Suzuki',
            model: 'Swift',
            year: 2021,
            pricePerDay: 35,
            category: 'Hatchback',
            location: 'Negombo',
            image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=2070&auto=format&fit=crop',
        },
        {
            make: 'Yamaha',
            model: 'NMAX',
            year: 2023,
            pricePerDay: 15,
            category: 'Bike',
            location: 'Ella',
            image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop',
        }
    ]

    for (const carData of cars) {
        const car = await prisma.car.create({
            data: {
                make: carData.make,
                model: carData.model,
                year: carData.year,
                pricePerDay: carData.pricePerDay,
                category: carData.category,
                location: carData.location,
                description: `Experience the comfort of this ${carData.make} ${carData.model}. perfect for your trip around Sri Lanka.`,
                status: 'PUBLISHED',
                hostId: host.id,
                features: 'Bluetooth, AC, GPS',
                images: {
                    create: {
                        url: carData.image
                    }
                }
            }
        })
        console.log(`Created car: ${car.make} ${car.model}`)
    }

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
