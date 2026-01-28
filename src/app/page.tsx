import Navbar from "@/components/shared/navbar"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import CarCard from "@/components/shared/car-card"

// Force dynamic rendering to ensure DB updates are shown
export const dynamic = 'force-dynamic'

export default async function Home() {
  const [featuredCars, sedans, suvs, vans, bikes, hatchbacks] = await Promise.all([
    db.car.findMany({ take: 8, orderBy: { createdAt: 'desc' }, include: { images: true } }),
    db.car.findMany({ where: { category: 'Sedan' }, take: 4, include: { images: true } }),
    db.car.findMany({ where: { category: 'SUV' }, take: 4, include: { images: true } }),
    db.car.findMany({ where: { category: 'Van' }, take: 4, include: { images: true } }),
    db.car.findMany({ where: { category: 'Bike' }, take: 4, include: { images: true } }),
    db.car.findMany({ where: { category: 'Hatchback' }, take: 4, include: { images: true } }),
  ])

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative h-[600px] flex items-center justify-center bg-gray-900 overflow-hidden"
        style={{
          backgroundImage: "url('/main.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-white drop-shadow-md">
            Find your drive
          </h1>
          <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-2xl mx-auto drop-shadow-md">
            Explore the world&apos;s largest car sharing marketplace. Book the perfect car for your trip in Sri Lanka.
          </p>

          {/* Search Bar Widget */}
          <form action="/search" className="bg-white p-4 rounded-full shadow-lg max-w-3xl mx-auto flex items-center gap-2 border">
            <div className="flex-1 px-4 border-r">
              <label className="block text-xs font-bold text-gray-500 uppercase">Where</label>
              <input
                name="location"
                type="text"
                placeholder="Colombo, Kandy..."
                className="w-full outline-none text-gray-700 font-medium"
              />
            </div>
            <div className="flex-1 px-4 border-r">
              <label className="block text-xs font-bold text-gray-500 uppercase">From</label>
              <input type="text" placeholder="Add dates" className="w-full outline-none text-gray-700 font-medium" />
            </div>
            <div className="flex-1 px-4">
              <label className="block text-xs font-bold text-gray-500 uppercase">Until</label>
              <input type="text" placeholder="Add dates" className="w-full outline-none text-gray-700 font-medium" />
            </div>
            <Button type="submit" size="icon" className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90">
              <Search className="h-5 w-5 text-white" />
            </Button>
          </form>
        </div>
      </section>

      <div className="pb-20">
        {featuredCars.length === 0 ? (
          <div className="py-20 text-center text-gray-500">No cars listed yet. Be the first to list yours!</div>
        ) : (
          [
            { title: "Fresh Arrivals", data: featuredCars },
            { title: "Sedans", data: sedans },
            { title: "SUVs", data: suvs },
            { title: "City Hatchbacks", data: hatchbacks },
            { title: "Vans", data: vans },
            { title: "Motorbikes", data: bikes },
          ].map((section) => (
            section.data.length > 0 && (
              <section key={section.title} className="pt-12 container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                  <Link href={`/search?category=${section.title === 'Fresh Arrivals' ? '' : section.title}`} className="text-primary hover:underline font-medium text-sm">
                    View all &rarr;
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {section.data.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
              </section>
            )
          ))
        )}
      </div>

      {/* Become a Host Section */}
      <section className="bg-primary/5 py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Do you have a car?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Earn extra income by sharing your car on Ride. It's free to list, and you're covered by our $1M liability insurance policy.
          </p>
          <Link href="/host">
            <Button size="lg" className="text-lg px-8 py-6">
              Become a Host
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
