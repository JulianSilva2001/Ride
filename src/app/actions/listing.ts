"use server"

import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createDraft() {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error("Unauthorized")
    }

    const { db } = await import("@/lib/db")

    // Create a new record in 'Car' table
    const car = await db.car.create({
        data: {
            hostId: session.user.id,
            status: "DRAFT",
            // Initialize optional fields if needed, or leave them null/default
            year: new Date().getFullYear(),
        }
    })

    return { id: car.id }
}

export async function updateDraft(carId: string, data: any) {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error("Unauthorized")
    }

    const { db } = await import("@/lib/db")

    const car = await db.car.findUnique({
        where: { id: carId }
    })

    if (!car) {
        throw new Error("Not found")
    }

    if (car.hostId !== session.user.id) {
        throw new Error("Unauthorized")
    }

    // Prisma update
    // We need to ensure 'data' matches the schema fields. 
    // The wizard passes relaxed objects, but mostly they map 1:1.
    // However, we should be careful with dates or non-scalar types if any.
    // For now, we assume simple scalars matches.

    // Filter out fields that shouldn't be updated directly or don't exist on Car
    const {
        id, createdAt, updatedAt, hostId,
        images, imageUrl, // Exclude these specific UI/Relation fields from direct spread
        ...updateData
    } = data

    // If 'imageUrl' is passed (from Step 5), we might want to save it to Images table
    // But Step 5 logic might need to be verified. 
    // For now, let's just update the Car scalars.

    // If we want to handle images update here:
    // This simple logic assumes adding a single image if imageUrl is present and images is empty?
    // Or we just ignore it for now to fix the crash, assuming images are handled separately or we add logic later.
    // Let's safe-guard the update first.

    if (imageUrl) {
        // Create an Image record linked to the car
        await db.image.create({
            data: {
                carId: carId,
                url: imageUrl
            }
        })
    }

    await db.car.update({
        where: { id: carId },
        data: updateData
    })

    revalidatePath(`/host/create`)
    return { success: true }
}

export async function publishListing(carId: string) {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error("Unauthorized")
    }

    const { db } = await import("@/lib/db")

    const car = await db.car.findUnique({
        where: { id: carId }
    })

    if (!car) {
        throw new Error("Not found")
    }

    if (car.hostId !== session.user.id) {
        throw new Error("Unauthorized")
    }

    // Basic validation
    if (!car.make || !car.model || !car.pricePerDay || !car.location) {
        throw new Error("Missing required fields")
    }

    await db.car.update({
        where: { id: carId },
        data: {
            status: "PUBLISHED"
        }
    })

    redirect("/host/dashboard?tab=listings")
}

export async function deleteListing(carId: string) {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error("Unauthorized")
    }

    const { db } = await import("@/lib/db")

    const car = await db.car.findUnique({
        where: { id: carId }
    })

    if (!car) {
        throw new Error("Not found")
    }

    if (car.hostId !== session.user.id) {
        throw new Error("Unauthorized")
    }

    await db.car.delete({
        where: { id: carId }
    })

    revalidatePath("/host")
    return { success: true }
}
