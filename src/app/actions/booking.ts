'use server'

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export async function createBooking(formData: FormData) {
    const session = await auth()

    if (!session || !session.user || !session.user.id) {
        redirect("/api/auth/signin?callbackUrl=/search")
    }

    const carId = formData.get("carId") as string
    const startDateRaw = formData.get("startDate") as string
    const endDateRaw = formData.get("endDate") as string
    const protectionPlan = formData.get("protectionPlan") as string || "Basic"

    if (!carId || !startDateRaw || !endDateRaw) {
        throw new Error("Missing required fields")
    }

    const startDate = new Date(startDateRaw)
    const endDate = new Date(endDateRaw)

    // Calculate days
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    const days = diffDays > 0 ? diffDays : 1

    // Fetch car for price
    const car = await db.car.findUnique({
        where: { id: carId }
    })

    if (!car) {
        throw new Error("Car not found")
    }

    // Check for overlapping bookings
    const overlap = await db.booking.findFirst({
        where: {
            carId: car.id,
            status: "CONFIRMED",
            AND: [
                { startDate: { lte: endDate } },
                { endDate: { gte: startDate } }
            ]
        }
    })

    if (overlap) {
        throw new Error("Car is already booked for these dates")
    }

    if (!car.pricePerDay) {
        console.error("Car price missing for car:", car.id)
        throw new Error("Car price is not set. Please contact support.")
    }

    // Recalculate cost on server to prevent tampering
    let protectionCost = 0
    if (protectionPlan === "Standard") protectionCost = 2500 * days
    if (protectionPlan === "Premium") protectionCost = 5000 * days

    // Delivery Logic
    const deliverySelected = formData.get("deliverySelected") === "true"
    let deliveryFee = 0

    if (deliverySelected) {
        if (!car.deliveryOption) {
            throw new Error("This car does not support delivery")
        }
        deliveryFee = car.deliveryFee || 0
    }

    const rentalCost = car.pricePerDay * days
    const totalCost = rentalCost + protectionCost + deliveryFee

    await db.booking.create({
        data: {
            startDate,
            endDate,
            totalCost,
            status: "CONFIRMED",
            userId: session.user.id,
            carId: car.id,
        }
    })

    redirect("/trips")
}
