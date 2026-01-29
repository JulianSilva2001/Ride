"use server"

import { auth } from "@/auth"
import { adminDb } from "@/lib/firebase"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createDraft() {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error("Unauthorized")
    }

    // Create a new document in 'cars' collection
    const docRef = await adminDb.collection("cars").add({
        hostId: session.user.id,
        make: "",
        model: "",
        year: new Date().getFullYear(),
        pricePerDay: 0,
        description: "",
        location: "",
        features: "",
        status: "DRAFT",
        createdAt: new Date(),
        updatedAt: new Date(),
    })

    return { id: docRef.id }
}

export async function updateDraft(carId: string, data: any) {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error("Unauthorized")
    }

    const carRef = adminDb.collection("cars").doc(carId)
    const doc = await carRef.get()

    if (!doc.exists) {
        throw new Error("Not found")
    }

    const carData = doc.data()
    if (carData?.hostId !== session.user.id) {
        throw new Error("Unauthorized")
    }

    // Firestore update
    await carRef.update({
        ...data,
        updatedAt: new Date()
    })

    revalidatePath(`/host/create`)
    return { success: true }
}

export async function publishListing(carId: string) {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error("Unauthorized")
    }

    const carRef = adminDb.collection("cars").doc(carId)
    const doc = await carRef.get()

    if (!doc.exists) {
        throw new Error("Not found")
    }

    const carData = doc.data()
    if (carData?.hostId !== session.user.id) {
        throw new Error("Unauthorized")
    }

    // Basic validation could happen here
    if (!carData.make || !carData.model || !carData.pricePerDay || !carData.location) {
        throw new Error("Missing required fields")
    }

    await carRef.update({
        status: "PUBLISHED",
        updatedAt: new Date()
    })

    redirect("/host")
}
