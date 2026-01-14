"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createReview } from "@/app/actions/review"
import { Star } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface ReviewModalProps {
    carId: string
    carMake: string
    carModel: string
}

export default function ReviewModal({ carId, carMake, carModel }: ReviewModalProps) {
    const [rating, setRating] = useState(5)
    const [open, setOpen] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        await createReview(formData)
        setOpen(false)
        router.refresh()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">Leave a Review</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form action={handleSubmit}>
                    <input type="hidden" name="carId" value={carId} />
                    <input type="hidden" name="rating" value={rating} />

                    <DialogHeader>
                        <DialogTitle>Review {carMake} {carModel}</DialogTitle>
                        <DialogDescription>
                            Share your experience with this car.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`h-8 w-8 cursor-pointer transition ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                    onClick={() => setRating(star)}
                                />
                            ))}
                        </div>

                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="comment">Comment</Label>
                            <Textarea name="comment" id="comment" placeholder="The car was great..." required />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit">Submit Review</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
