import { createDraft } from "@/app/actions/listing"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/shared/navbar"
import { redirect } from "next/navigation"

export default function CreateListingStartPage() {

    async function startListing() {
        "use server"
        const result = await createDraft()
        redirect(`/host/create/${result.id}`)
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
                <h1 className="text-4xl font-bold mb-4">Earn money by sharing your car</h1>
                <p className="text-xl text-gray-500 mb-8">
                    Join thousands of hosts on Ride. It's safe, simple, and you're in control.
                </p>

                <form action={startListing}>
                    <Button size="lg" className="text-lg px-8 py-6 font-bold">
                        Let's Go
                    </Button>
                </form>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="font-bold text-lg mb-2">You set the price</h3>
                        <p className="text-gray-500 text-sm">You control your daily price and rules.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="font-bold text-lg mb-2">We've got your back</h3>
                        <p className="text-gray-500 text-sm">$1M liability insurance for every trip.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="font-bold text-lg mb-2">Get paid quickly</h3>
                        <p className="text-gray-500 text-sm">Earnings are deposited directly to your bank.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
