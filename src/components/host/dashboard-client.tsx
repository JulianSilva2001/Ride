"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Car, Calendar, DollarSign, TrendingUp } from "lucide-react"
import Link from "next/link"

interface DashboardClientProps {
    user: any
    cars: any[]
    bookings: any[]
    totalEarnings: number
}

export default function DashboardClient({ user, cars, bookings, totalEarnings }: DashboardClientProps) {
    const activeListingsLink = "/host/create"

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Host Dashboard</h1>
                    <Link href={activeListingsLink}>
                        <Button className="gap-2">
                            <Plus size={18} />
                            List a new car
                        </Button>
                    </Link>
                </div>

                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="mb-8">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="listings">My Listings ({cars.length})</TabsTrigger>
                        <TabsTrigger value="bookings">Bookings ({bookings.length})</TabsTrigger>
                        <TabsTrigger value="earnings">Earnings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
                                    <Car className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{cars.length}</div>
                                    <p className="text-xs text-muted-foreground">+0% from last month</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{bookings.length}</div>
                                    <p className="text-xs text-muted-foreground">Updated just now</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">${totalEarnings.toLocaleString()}</div>
                                    <p className="text-xs text-muted-foreground">+0% from last month</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Activity Placeholder */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>Your latest hosting activity.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-500">No recent activity to show.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="listings">
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
                    </TabsContent>

                    <TabsContent value="bookings">
                        <Card>
                            <CardHeader>
                                <CardTitle>Bookings</CardTitle>
                                <CardDescription>Manage your upcoming and past bookings here.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {bookings.length === 0 ? (
                                    <p className="text-sm text-gray-500">No bookings found.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {bookings.map((booking) => (
                                            <div key={booking.id} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                                                <div>
                                                    <p className="font-semibold">{booking.car.make} {booking.car.model}</p>
                                                    <p className="text-sm text-gray-500">Guest: {booking.user?.name || "Unknown"}</p>
                                                    <p className="text-xs text-gray-400">
                                                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold">${booking.totalCost}</p>
                                                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{booking.status}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="earnings">
                        <Card>
                            <CardHeader>
                                <CardTitle>Earnings Summary</CardTitle>
                                <CardDescription>Your total earnings from hosted trips.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center py-10">
                                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                                <h2 className="text-4xl font-bold mb-2">${totalEarnings.toLocaleString()}</h2>
                                <p className="text-gray-500">Total Lifetime Earnings</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
