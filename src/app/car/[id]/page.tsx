import { db } from "@/lib/db"
import Navbar from "@/components/shared/navbar"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"
import { User, Check, Star } from "lucide-react"
import BookingWidget from "@/components/booking/booking-widget"
import PriceDisplay from "@/components/shared/price-display"

interface CarDetailPageProps {
    params: {
        id: string
    }
}

export default async function CarDetailPage({ params }: CarDetailPageProps) {
    const car = await db.car.findUnique({
        where: { id: params.id },
        include: {
            images: true,
            host: true,
            reviews: {
                include: { user: true },
                orderBy: { createdAt: 'desc' }
            }
        }
    })

    if (!car) {
        notFound()
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">


            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Images and Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Main Image */}
                        <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden relative">
                            {car.images[0] ? (
                                <img
                                    src={car.images[0].url}
                                    alt={car.model}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                            )}
                        </div>

                        {/* Title and Specs */}
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{car.year} {car.make} {car.model}</h1>
                            <div className="flex items-center gap-4 text-gray-500 mb-6">
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-primary text-primary" />
                                    <span className="font-semibold text-black">5.0</span>
                                    <span>(New listing)</span>
                                </div>
                                <span>•</span>
                                <span>{car.location}</span>
                            </div>

                            <div className="border-t py-6">
                                <h3 className="text-lg font-bold mb-4">Description</h3>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {car.description}
                                </p>
                            </div>

                            <div className="border-t py-6">
                                <h3 className="text-lg font-bold mb-4">Features</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {car.features.split(',').map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2 text-gray-600">
                                            <Check className="h-4 w-4 text-green-600" />
                                            <span>{feature.trim()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t py-6">
                                <h3 className="text-lg font-bold mb-4">Reviews ({car.reviews.length})</h3>
                                {car.reviews.length === 0 ? (
                                    <p className="text-gray-500 italic">No reviews yet.</p>
                                ) : (
                                    <div className="space-y-6">
                                        {car.reviews.map((review) => (
                                            <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                                            {review.user.name?.[0] || "U"}
                                                        </div>
                                                        <span className="font-semibold text-sm">{review.user.name}</span>
                                                    </div>
                                                    <div className="flex text-yellow-400">
                                                        {[...Array(review.rating)].map((_, i) => (
                                                            <Star key={i} className="h-4 w-4 fill-current" />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-gray-700 text-sm">{review.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Booking Box */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 border rounded-xl p-6 shadow-sm bg-white">
                            <div className="flex justify-between items-baseline mb-6">
                                <span className="text-2xl font-bold"><PriceDisplay amount={car.pricePerDay} /></span>
                                <span className="text-gray-500">/ day</span>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
                                <BookingWidget carId={car.id} pricePerDay={car.pricePerDay} />
                            </div>

                            <div className="border-t my-6"></div>

                            {/* Host Info */}
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                                    {car.host.image ? (
                                        <img src={car.host.image} className="h-full w-full rounded-full object-cover" />
                                    ) : (
                                        <User className="text-gray-500" />
                                    )}
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase font-bold">Hosted by</div>
                                    <div className="font-semibold">{car.host.name || 'Host'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
