import { auth } from "@/auth"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import Navbar from "@/components/shared/navbar"

export default async function HostDashboard() {
    const session = await auth()

    if (!session?.user?.email) {
        redirect('/api/auth/signin')
    }

    const user = await db.user.findUnique({
        where: { email: session.user.email },
        include: { cars: { include: { images: true } } }
    })

    const cars = user?.cars || []

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">My Cars</h1>
                    <Link href="/host/create">
                        <Button className="gap-2">
                            <Plus size={18} />
                            List a new car
                        </Button>
                    </Link>
                </div>

                {cars.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-lg border shadow-sm">
                        <h3 className="text-xl font-semibold mb-2">You don't have any cars listed yet.</h3>
                        <p className="text-gray-500 mb-6">Start earning by sharing your car with others.</p>
                        <Link href="/host/create">
                            <Button variant="outline">Create your first listing</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cars.map((car) => (
                            <Card key={car.id}>
                                <div className="aspect-video bg-gray-200 relative overflow-hidden rounded-t-lg">
                                    {car.images[0] ? (
                                        <img src={car.images[0].url} alt={car.make} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                    )}
                                </div>
                                <CardHeader className="p-4 pb-2">
                                    <CardTitle className="text-lg">{car.year} {car.make} {car.model}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{car.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-lg">${car.pricePerDay}<span className="text-sm font-normal text-gray-500">/day</span></span>
                                        <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                                            Active
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
