import Navbar from "@/components/shared/navbar"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-gray-100 overflow-hidden">
        {/* Placeholder for Hero Image */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-10" />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
            Find your drive
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore the world&apos;s largest car sharing marketplace. Book the perfect car for your trip in Sri Lanka.
          </p>

          {/* Search Bar Widget */}
          <div className="bg-white p-4 rounded-full shadow-lg max-w-3xl mx-auto flex items-center gap-2 border">
            <div className="flex-1 px-4 border-r">
              <label className="block text-xs font-bold text-gray-500 uppercase">Where</label>
              <input type="text" placeholder="Colombo, Kandy..." className="w-full outline-none text-gray-700 font-medium" />
            </div>
            <div className="flex-1 px-4 border-r">
              <label className="block text-xs font-bold text-gray-500 uppercase">From</label>
              <input type="text" placeholder="Add dates" className="w-full outline-none text-gray-700 font-medium" />
            </div>
            <div className="flex-1 px-4">
              <label className="block text-xs font-bold text-gray-500 uppercase">Until</label>
              <input type="text" placeholder="Add dates" className="w-full outline-none text-gray-700 font-medium" />
            </div>
            <Button size="icon" className="rounded-full w-12 h-12 bg-purple-600 hover:bg-purple-700">
              <Search className="h-5 w-5 text-white" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Browse by make</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {['Toyota', 'Honda', 'Nissan', 'Suzuki'].map((brand) => (
            <div key={brand} className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-500 hover:bg-gray-200 cursor-pointer transition">
              {brand}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
