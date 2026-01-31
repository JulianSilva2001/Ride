
import CarCard from "@/components/shared/car-card"
import Navbar from "@/components/shared/navbar"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import SearchBar from "@/components/search/search-bar"


import CategoryFilter from "@/components/search/category-filter"

interface SearchPageProps {
    searchParams: {
        location?: string
        from?: string
        until?: string
        category?: string
    }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const location = searchParams.location || ""
    const category = searchParams.category || ""

    const from = searchParams.from ? new Date(searchParams.from) : null
    const until = searchParams.until ? new Date(searchParams.until) : null

    // Prisma Filter
    const where: any = {
        status: "PUBLISHED" // Only show published cars
    }

    if (location) {
        where.OR = [
            { location: { contains: location, mode: 'insensitive' } },
            { make: { contains: location, mode: 'insensitive' } },
            { model: { contains: location, mode: 'insensitive' } }
        ]
    }

    if (category && category !== "All") {
        where.category = { equals: category, mode: 'insensitive' }
    }

    // Availability Filter
    if (from && until) {
        where.NOT = {
            bookings: {
                some: {
                    status: "CONFIRMED",
                    AND: [
                        { startDate: { lte: until } },
                        { endDate: { gte: from } }
                    ]
                }
            }
        }
    }

    const cars = await db.car.findMany({
        where,
        include: { images: true }
    })

    const serializedCars = cars.map(car => ({
        ...car,
        createdAt: car.createdAt.toISOString(),
        updatedAt: car.updatedAt.toISOString(),
        images: car.images
    }))

    return (
        <div className="min-h-screen flex flex-col">

            {/* Search Header */}
            <div className="bg-white border-b sticky top-16 z-40 shadow-sm">
                <div className="container mx-auto px-4 py-4 space-y-4">
                    <div className="max-w-4xl">
                        <SearchBar />
                    </div>
                    {/* Category Filter */}
                    <div className="max-w-5xl">
                        <CategoryFilter />
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="flex-1 container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">
                    {category && category !== "All" ? `${category}s` : "All cars"}
                    {location && <span> in &quot;{location}&quot;</span>}
                    <span className="text-gray-500 font-normal text-lg ml-2">({cars.length} results)</span>
                </h1>

                {cars.length === 0 ? (
                    <div className="text-center py-20">
                        <h3 className="text-xl font-semibold mb-2">No cars found</h3>
                        <p className="text-gray-500">Try changing your search criteria or location.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {serializedCars.map((car: any) => (
                            <CarCard key={car.id} car={car} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
