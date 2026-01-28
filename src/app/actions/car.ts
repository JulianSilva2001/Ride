'use server'


import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createCar(formData: FormData) {
    const session = await auth()

    if (!session?.user?.email) {
        throw new Error("You must be signed in to list a car")
    }

    // Use Firestore
    const { adminDb } = await import("@/lib/firebase");
    const usersRef = adminDb.collection('users');
    const userSnapshot = await usersRef.where('email', '==', session.user.email).limit(1).get();

    if (userSnapshot.empty) {
        throw new Error("User not found")
    }
    const user = userSnapshot.docs[0];

    const make = formData.get("make") as string
    const model = formData.get("model") as string
    const year = parseInt(formData.get("year") as string)
    const price = parseFloat(formData.get("price") as string)
    const description = formData.get("description") as string
    const location = formData.get("location") as string
    const features = formData.get("features") as string // Comma separated
    const imageUrl = formData.get("imageUrl") as string || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop"

    if (!make || !model || !year || !price || !location) {
        throw new Error("Missing required fields")
    }

    try {
        const carRef = adminDb.collection("cars").doc();
        await carRef.set({
            id: carRef.id,
            make,
            model,
            year,
            pricePerDay: price,
            description,
            location,
            features: features || "",
            hostId: user.id,
            imageUrl: imageUrl,
            images: [{ url: imageUrl }], // redundancy for UI compatibility if needed
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        console.log("Created car in Firestore:", carRef.id);
    } catch (error) {
        console.error("Error creating car in Firestore:", error);
        throw new Error("Failed to create listing")
    }

    revalidatePath('/host/dashboard') // Updated path
    redirect('/host/dashboard') // Updated redirect path
}
