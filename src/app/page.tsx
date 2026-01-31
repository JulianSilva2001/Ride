import { Button } from "@/components/ui/button"
import SearchBar from "@/components/search/search-bar"
import Link from "next/link"
import { Car, ShieldCheck, Headphones, Zap, TrendingUp, Bus, Bike, Gem, Star, MapPin } from "lucide-react"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function Home() {
  const categories = [
    { name: "Sedan", image: "/categories/sedan.png" },
    { name: "SUV", image: "/categories/suv.png" },
    { name: "Van", image: "/categories/van.png" },
    { name: "Bike", image: "/categories/bike.png" },
    { name: "Luxury", image: "/categories/luxury.png" },
  ]

  const features = [
    {
      title: "Verified Identity",
      desc: "Our rigorous verification process ensures you only deal with trusted hosts and renters.",
      icon: ShieldCheck
    },
    {
      title: "Instant Booking",
      desc: "Skip the waiting game. Book cars with the 'Instant' badge and get moving immediately.",
      icon: Zap
    },
    {
      title: "24/7 Roadside Support",
      desc: "Help is just a tap away. We have partnered with top providers to keep you safe.",
      icon: Headphones
    }
  ]

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Hero Section */}
      <section
        className="relative h-[700px] flex items-center justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/main.jpeg')",
          }}
        />
        {/* Elegant Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30 z-0" />

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium mb-4">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>#1 Car Sharing Marketplace in Sri Lanka</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-lg leading-tight">
              Find your drive
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto drop-shadow-md font-light leading-relaxed">
              Skip the rental counter. Book unique cars from local hosts for your next adventure.
            </p>
          </div>

          {/* Search Bar Widget */}
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Browse by Type</h2>
              <p className="text-gray-500 mt-2">Find the perfect vehicle for any occasion.</p>
            </div>
            <Link href="/search" className="text-primary font-semibold hover:underline">View all categories &rarr;</Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((cat) => (
              <Link href={`/search?category=${cat.name}`} key={cat.name} className="group">
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary/20 flex flex-col items-center text-center group-hover:-translate-y-2 h-full overflow-hidden">
                  <div className="relative w-full aspect-[16/10] bg-gray-100 overflow-hidden">
                    <div
                      className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
                      style={{
                        backgroundImage: `url('${cat.image}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                  </div>
                  <div className="p-5 w-full">
                    <span className="font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors block">{cat.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* "What is Ride" Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 space-y-8">
              <div className="space-y-4">
                <span className="text-primary font-bold tracking-wider uppercase text-sm">The new way to rent</span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                  Better than car rental. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">This is car sharing.</span>
                </h2>
              </div>

              <p className="text-xl text-gray-600 leading-relaxed font-light">
                Ride is Sri Lanka&apos;s first peer-to-peer car sharing marketplace. We connect you directly with local car owners, giving you access to unique cars at better prices.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-green-100 text-green-700 mt-1">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Fully Insured</h4>
                    <p className="text-sm text-gray-500">Every trip is covered by our comprehensive insurance policy.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-700 mt-1">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Local Pickup</h4>
                    <p className="text-sm text-gray-500">Pick up cars nearby or have them delivered to you.</p>
                  </div>
                </div>
              </div>

              <Link href="/search">
                <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/20">
                  Explore Cars
                </Button>
              </Link>
            </div>

            <div className="flex-1 relative w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-8 border-white ring-1 ring-gray-100 rotate-1 hover:rotate-0 transition-all duration-500">
              <div
                className="absolute inset-0 bg-gray-100"
                style={{
                  backgroundImage: "url('/ride-illustration.png')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why thousands choose Ride</h2>
            <p className="text-xl text-gray-500 font-light">
              Join a community that values trust, convenience, and freedom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={feature.title} className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary/10">
                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <feature.icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-28 bg-gray-900 overflow-hidden">
        {/* Background decorative blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600 blur-[150px]" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
            Ready to hit the road?
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto font-light">
            Download the app or start booking on the web. Your next journey is just a click away.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link href="/search">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-white text-gray-900 hover:bg-gray-100 font-bold shadow-xl shadow-white/10">
                Book a Car
              </Button>
            </Link>
            <Link href="/host">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-2 border-gray-700 text-white hover:bg-gray-800 hover:text-white hover:border-gray-600 bg-transparent font-bold">
                Become a Host
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
