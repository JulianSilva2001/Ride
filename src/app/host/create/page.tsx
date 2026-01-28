import { createCar } from "@/app/actions/car"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Navbar from "@/components/shared/navbar"

import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function CreateCarPage() {
    const session = await auth()
    if (!session?.user?.email) {
        redirect('/signup?callbackUrl=/host/create')
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <h1 className="text-3xl font-bold mb-8">List your car</h1>

                <form action={createCar} className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="make">Make</Label>
                            <Input id="make" name="make" placeholder="e.g. Toyota" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="model">Model</Label>
                            <Input id="model" name="model" placeholder="e.g. Camry" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="year">Year</Label>
                            <Input id="year" name="year" type="number" placeholder="2024" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Price per day ($)</Label>
                            <Input id="price" name="price" type="number" min="0" step="0.01" placeholder="45.00" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" name="location" placeholder="e.g. Colombo 03, Sri Lanka" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" placeholder="Tell guests about your car..." className="min-h-[100px]" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <Input id="imageUrl" name="imageUrl" placeholder="HTTPS link to car image" />
                        <p className="text-xs text-gray-500">For MVP, please provide a direct link to an image.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="features">Features (comma separated)</Label>
                        <Input id="features" name="features" placeholder="Bluetooth, GPS, Leather seats" />
                    </div>

                    <Button type="submit" className="w-full text-lg py-6">Publish Listing</Button>
                </form>
            </div>
        </div>
    )
}
