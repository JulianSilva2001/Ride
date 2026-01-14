const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding ...')

    // 1. Create Host
    const host = await prisma.user.upsert({
        where: { email: 'host@demo.com' },
        update: {},
        create: {
            email: 'host@demo.com',
            name: 'Silva Motors',
            role: 'HOST',
        },
    })

    // 2. Clear existing cars
    console.log('Clearing old cars...')
    await prisma.car.deleteMany({})

    // 3. Define 20 Cars with UNIQUE IMAGES
    const cars = [
        // Hatchbacks

        {
            make: 'Suzuki',
            model: 'Alto',
            year: 2018,
            pricePerDay: 3500,
            description: 'The most economical ride in town. Easy to park anywhere.',
            location: 'Nugegoda',
            category: 'Hatchback',
            features: 'AC, Radio',
            imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=2670&auto=format&fit=crop'
        },
        {
            make: 'Toyota',
            model: 'Vitz',
            year: 2018,
            pricePerDay: 5500,
            description: 'Compact yet spacious. Smooth drive for city and suburbs.',
            location: 'Colombo 05',
            category: 'Hatchback',
            features: 'Push Start, Multifunction Steering, AC',
            imageUrl: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=2670&auto=format&fit=crop'
        },

        {
            make: 'Kia',
            model: 'Picanto',
            year: 2019,
            pricePerDay: 4800,
            description: 'Sporty compact car. Fun to drive.',
            location: 'Mount Lavinia',
            category: 'Hatchback',
            features: 'Bluetooth, Sunroof, AC',
            imageUrl: 'https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?q=80&w=2640&auto=format&fit=crop'
        },

        // Sedans

        {
            make: 'Toyota',
            model: 'Axio',
            year: 2017,
            pricePerDay: 7500,
            description: 'Reliable hybrid sedan. Good balance of comfort and economy.',
            location: 'Kurunegala',
            category: 'Sedan',
            features: 'Hybrid, Reverse Camera, AC',
            imageUrl: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=2531&auto=format&fit=crop'
        },

        {
            make: 'Honda',
            model: 'Grace',
            year: 2016,
            pricePerDay: 7000,
            description: 'Hybrid sedan with plenty of legroom.',
            location: 'Gampaha',
            category: 'Sedan',
            features: 'Hybrid, Rear AC, Sport Mode',
            imageUrl: 'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=2670&auto=format&fit=crop'
        },

        // SUVs & Crossovers

        {
            make: 'Toyota',
            model: 'C-HR',
            year: 2018,
            pricePerDay: 11000,
            description: 'Futuristic design crossover. Very comfortable.',
            location: 'Colombo 02',
            category: 'SUV',
            features: 'Leather, Radar Cruise, Lane Assist',
            imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3968e39c?q=80&w=2670&auto=format&fit=crop'
        },
        {
            make: 'Mitsubishi',
            model: 'Montero',
            year: 2015,
            pricePerDay: 15000,
            description: 'Rugged SUV for off-road adventures and family trips.',
            location: 'Nuwara Eliya',
            category: 'SUV',
            features: '4WD, 7 Seater, Roof Rack',
            imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2670&auto=format&fit=crop'
        },

        {
            make: 'Kia',
            model: 'Sportage',
            year: 2017,
            pricePerDay: 12500,
            description: 'Modern SUV with all the bells and whistles.',
            location: 'Rajagiriya',
            category: 'SUV',
            features: 'Leather, Panoroamic Roof, Power Tailgate',
            imageUrl: 'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?q=80&w=2574&auto=format&fit=crop'
        },
        {
            make: 'Toyota',
            model: 'Raize',
            year: 2020,
            pricePerDay: 9500,
            description: 'Compact SUV, high seating position.',
            location: 'Battaramulla',
            category: 'SUV',
            features: 'Turbo, Safety Sense, Heated Seats',
            imageUrl: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=2670&auto=format&fit=crop'
        },

        // Vans (New)

        {
            make: 'Nissan',
            model: 'Caravan',
            year: 2015,
            pricePerDay: 13500,
            description: 'Spacious van for large families.',
            location: 'Kandy',
            category: 'Van',
            features: 'High Roof, Reclining Seats',
            imageUrl: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?q=80&w=2670&auto=format&fit=crop'
        },

        // Bikes (New)
        {
            make: 'Honda',
            model: 'Dio',
            year: 2019,
            pricePerDay: 1500,
            description: 'Easy scooter for quick city runs.',
            location: 'Colombo 06',
            category: 'Bike',
            features: 'Helmets Included, Electric Start',
            imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2670&auto=format&fit=crop'
        },


        // Others
        {
            make: 'Toyota',
            model: 'Aqua',
            year: 2017,
            pricePerDay: 6000,
            description: 'Super fuel economy hybrid. Great for island wide tours.',
            location: 'Negombo',
            category: 'Hatchback',
            features: 'Hybrid, Reverse Camera, Push Start',
            imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2670&auto=format&fit=crop'
        },



    ]

    for (const car of cars) {
        // Extract imageUrl to separate variable to keep object clean for creation
        const { imageUrl, ...carData } = car

        const carRecord = await prisma.car.create({
            data: {
                ...carData,
                hostId: host.id,
                images: {
                    create: { url: imageUrl }
                }
            },
        })
        console.log(`Created ${car.make} ${car.model}`)
    }

    console.log('Seeding finished. 20 Cars added.')
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
