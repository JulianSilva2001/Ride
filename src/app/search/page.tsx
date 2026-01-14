import { db } from "@/lib/db"
import CarCard from "@/components/shared/car-card"
import Navbar from "@/components/shared/navbar"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface SearchPageProps {
    searchParams: {
        location?: string
        from?: string
        until?: string
    }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const location = searchParams.location || ""

    // Basic filtering by location (case-insensitive simulation for SQLite/Postgres)
    // Note: Prisma 'contains' is case-insensitive in Postgres but sensitive in SQLite usually.
    // For MVP with SQLite, we might need to be careful, but let's try 'contains'.
    const cars = await db.car.findMany({
        where: {
            location: {
                contains: location,
                // mode: 'insensitive' // Postgres only, fails on SQLite
            }
        },
        include: { images: true }
    })

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            {/* Search Header */}
            <div className="bg-white border-b sticky top-16 z-40 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <form className="flex gap-2 max-w-4xl">
                        <div className="flex-1 relative">
                            <label className="absolute -top-1.5 left-3 bg-white px-1 text-xs font-semibold text-gray-500">Location</label>
                            <input
                                name="location"
                                defaultValue={location}
                                placeholder="Where are you going?"
                                className="w-full h-12 border rounded-md px-3 pt-2 outline-none focus:border-black transition"
                            />
                        </div>
                        {/* Date inputs can be added here later */}
                        <Button type="submit" size="lg" className="h-12 px-8">
                            Search
                        </Button>
                    </form>
                </div>
            </div>

            {/* Results */}
            <div className="flex-1 container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">
                    {location ? `Cars in "${location}"` : "All cars"}
                    <span className="text-gray-500 font-normal text-lg ml-2">({cars.length} results)</span>
                </h1>

                {cars.length === 0 ? (
                    <div className="text-center py-20">
                        <h3 className="text-xl font-semibold mb-2">No cars found</h3>
                        <p className="text-gray-500">Try changing your search criteria or location.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {cars.map(car => (
                            <CarCard key={car.id} car={car} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
