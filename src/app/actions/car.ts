'use server'

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createCar(formData: FormData) {
    const session = await auth()

    if (!session?.user?.email) {
        throw new Error("You must be signed in to list a car")
    }

    // Get user from DB to attach car
    const user = await db.user.findUnique({
        where: { email: session.user.email }
    })

    if (!user) {
        throw new Error("User not found")
    }

    const make = formData.get("make") as string
    const model = formData.get("model") as string
    const year = parseInt(formData.get("year") as string)
    const price = parseFloat(formData.get("price") as string)
    const description = formData.get("description") as string
    const location = formData.get("location") as string
    const features = formData.get("features") as string // Comma separated
    const imageUrl = formData.get("imageUrl") as string

    if (!make || !model || !year || !price || !location) {
        throw new Error("Missing required fields")
    }

    // Create Car in DB
    // Note: For SQLite, we store features as comma separated string for now if schema didn't support string[]
    // But wait, schema defined features as String (comma separated)? No, I defined it as String in last schema update for SQLite.
    // And Image was a separate model. Let's simplify and create the image relation.

    const car = await db.car.create({
        data: {
            make,
            model,
            year,
            pricePerDay: price,
            description,
            location,
            features: features || "",
            hostId: user.id,
            images: {
                create: {
                    url: imageUrl || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop" // Default image if empty
                }
            }
        }
    })

    revalidatePath('/host')
    redirect('/host')
}
