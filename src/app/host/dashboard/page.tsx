import { auth } from "@/auth"

import { redirect } from "next/navigation"
import DashboardClient from "@/components/host/dashboard-client"
import Navbar from "@/components/shared/navbar"


export default async function HostDashboard() {
    const session = await auth()

    if (!session?.user?.email) {
        redirect('/api/auth/signin')
    }

    // Import Firestore dynamically
    const { adminDb } = await import("@/lib/firebase")

    if (!session?.user?.email) {
        redirect('/api/auth/signin')
    }

    // Fetch user from Firestore
    const usersRef = adminDb.collection('users');
    const userSnapshot = await usersRef.where('email', '==', session.user.email).limit(1).get();

    if (userSnapshot.empty) {
        return <div className="p-20 text-center">User not found in database. Email: {session.user.email}</div>
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();
    const user = {
        id: userDoc.id,
        ...userData,
        createdAt: userData.createdAt?.toDate?.()?.toISOString() || userData.createdAt,
        updatedAt: userData.updatedAt?.toDate?.()?.toISOString() || userData.updatedAt
    };

    // Fetch cars from Firestore where hostId == user.id
    const carsSnapshot = await adminDb.collection('cars').where('hostId', '==', user.id).get();
    const cars = carsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            // Map simple imageUrl to expected images array structure for dashboard
            images: data.imageUrl ? [{ url: data.imageUrl }] : [],
            createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
        };
    });

    // Fetch bookings from Firestore
    const bookingsSnapshot = await adminDb.collection('bookings').where('hostId', '==', user.id).get();
    const bookings = bookingsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            startDate: data.startDate?.toDate?.()?.toISOString() || data.startDate,
            endDate: data.endDate?.toDate?.()?.toISOString() || data.endDate,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
            // Mock car/user objects if needed by UI
            car: data.car || { make: "Unknown", model: "Car" },
            user: data.user || { name: "Guest" }
        }
    });

    // Calculate total earnings
    const totalEarnings = bookings.reduce((sum: number, booking: any) => sum + (booking.totalCost || 0), 0)

    return (
        <DashboardClient
            user={user}
            cars={cars}
            bookings={bookings}
            totalEarnings={totalEarnings}
        />
    )
}
