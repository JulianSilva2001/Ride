'use server'

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createReview(formData: FormData) {
    const session = await auth()

    if (!session || !session.user || !session.user.id) {
        throw new Error("Unauthorized")
    }

    const carId = formData.get("carId") as string
    const rating = parseInt(formData.get("rating") as string)
    const comment = formData.get("comment") as string

    if (!carId || !rating || !comment) {
        throw new Error("Missing required fields")
    }

    await db.review.create({
        data: {
            rating,
            comment,
            userId: session.user.id,
            carId
        }
    })

    revalidatePath(`/car/${carId}`)
    revalidatePath('/trips')
}
