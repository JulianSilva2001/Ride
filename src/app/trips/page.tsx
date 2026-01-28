import { auth } from "@/auth"
import { db } from "@/lib/db"
import Navbar from "@/components/shared/navbar"
import { redirect } from "next/navigation"
import { format } from "date-fns"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ReviewModal from "@/components/reviews/review-modal"
import PriceDisplay from "@/components/shared/price-display"

export default async function TripsPage() {
    const session = await auth()

    if (!session || !session.user) {
        redirect("/api/auth/signin")
    }

    const bookings = await db.booking.findMany({
        where: { userId: session.user.id },
        include: { car: { include: { images: true } } },
        orderBy: { startDate: 'desc' }
    })

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">My Trips</h1>

                {bookings.length === 0 ? (
                    <div className="text-center py-20 border rounded-xl bg-gray-50">
                        <h3 className="text-xl font-semibold mb-2">No trips booked... yet!</h3>
                        <p className="text-gray-500 mb-6">Time to dust off your bags and start planning your next adventure.</p>
                        <Link href="/">
                            <Button size="lg">Start searching</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="border rounded-xl p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition">
                                <div className="w-full md:w-64 aspect-video bg-gray-200 rounded-lg overflow-hidden relative">
                                    {booking.car.images[0] ? (
                                        <img src={booking.car.images[0].url} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold mb-1">{booking.car.make} {booking.car.model}</h3>
                                            <p className="text-gray-500">{booking.car.year}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-xs font-bold text-gray-500 uppercase">Start</div>
                                            <div className="font-medium">{format(booking.startDate, 'MMM d, yyyy')}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-gray-500 uppercase">End</div>
                                            <div className="font-medium">{format(booking.endDate, 'MMM d, yyyy')}</div>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                                        <div className="text-sm font-medium text-gray-500">Total cost: <span className="text-black font-bold text-lg"><PriceDisplay amount={booking.totalCost} /></span></div>
                                        <ReviewModal carId={booking.car.id} carMake={booking.car.make} carModel={booking.car.model} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
