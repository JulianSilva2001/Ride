import { auth } from "@/auth"
import { redirect } from "next/navigation"
import DashboardClient from "@/components/host/dashboard-client"
import { db } from "@/lib/db"

export default async function HostDashboard({ searchParams }: { searchParams: { tab?: string } }) {
    const session = await auth()

    if (!session?.user?.email) {
        redirect('/api/auth/signin')
    }

    const user = await db.user.findUnique({
        where: { email: session.user.email },
        include: {
            cars: {
                include: { images: true }
            },
            bookings: {
                include: { car: true, user: true }
            }
        }
    })

    if (!user) {
        return <div className="p-20 text-center">User not found in database. Email: {session.user.email}</div>
    }

    // Transform for client component if needed
    // Prisma returns Date objects, client components might expect strings if they are not using superjson/similar.
    // DashboardClient usually expects Serializable props.

    const serializedUser = {
        ...user,
        role: user.role || "USER",
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        cars: undefined, // remove relations from user object if we pass them separately
        bookings: undefined
    }

    const serializedCars = user.cars.map(car => ({
        ...car,
        createdAt: car.createdAt.toISOString(),
        updatedAt: car.updatedAt.toISOString(),
        images: car.images // Keep as is
    }))

    const serializedBookings = user.bookings.map(booking => ({
        ...booking,
        startDate: booking.startDate.toISOString(),
        endDate: booking.endDate.toISOString(),
        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString(),
        // mock nested objects to match expected interface if they are missing
        car: booking.car || { make: "Unknown", model: "Car" },
        user: booking.user || { name: "Guest" }
    }))

    // Calculate total earnings
    const totalEarnings = serializedBookings.reduce((sum: number, booking: any) => sum + (booking.totalCost || 0), 0)

    const initialTab = searchParams.tab || "overview"

    return (
        <DashboardClient
            user={serializedUser}
            cars={serializedCars}
            bookings={serializedBookings}
            totalEarnings={totalEarnings}
            initialTab={initialTab}
        />
    )
}
