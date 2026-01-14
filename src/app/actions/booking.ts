'use server'

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export async function createBooking(formData: FormData) {
    const session = await auth()

    if (!session || !session.user || !session.user.id) {
        // ideally return error, but for simple flow redirect to signin
        // or we handle this in the component state
        throw new Error("Unauthorized")
    }

    const carId = formData.get("carId") as string
    const startDateRaw = formData.get("startDate") as string
    const endDateRaw = formData.get("endDate") as string

    if (!carId || !startDateRaw || !endDateRaw) {
        throw new Error("Missing required fields")
    }

    const startDate = new Date(startDateRaw)
    const endDate = new Date(endDateRaw)

    // Calculate days
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // Inclusive of start/end? usually rentals are per 24h. 
    // Let's assume standard day calculation. Minimum 1 day.
    const days = diffDays > 0 ? diffDays : 1

    // Fetch car for price
    const car = await db.car.findUnique({
        where: { id: carId }
    })

    if (!car) {
        throw new Error("Car not found")
    }

    const totalCost = car.pricePerDay * days

    await db.booking.create({
        data: {
            startDate,
            endDate,
            totalCost,
            status: "CONFIRMED", // Auto confirm for now
            userId: session.user.id,
            carId: car.id,
        }
    })

    redirect("/trips")
}
