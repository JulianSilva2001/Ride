import { auth } from "@/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import CheckoutWizard from "@/components/booking/checkout-wizard"

export default async function BookingPage({ params, searchParams }: {
    params: { id: string },
    searchParams: { startDate: string, endDate: string }
}) {
    const session = await auth()

    // 1. Auth Check
    if (!session?.user) {
        const callbackUrl = encodeURIComponent(`/book/${params.id}?startDate=${searchParams.startDate}&endDate=${searchParams.endDate}`)
        redirect(`/api/auth/signin?callbackUrl=${callbackUrl}`)
    }

    // 2. KYC Check
    const user = await db.user.findUnique({
        where: { id: session.user.id },
        include: { kyc: true }
    })

    // Strict KYC Check: Record must exist and have NIC.
    // For MVP, if no KYC record OR no NIC -> Redirect to Verify
    if (!user?.kyc || !user.kyc.nic) {
        redirect("/verify-account")
    }

    // 3. Fetch Car
    const car = await db.car.findUnique({
        where: { id: params.id },
        include: { host: true, images: true }
    })

    if (!car) {
        return <div>Car not found</div>
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <CheckoutWizard
                    car={car}
                    user={user}
                    startDate={new Date(searchParams.startDate)}
                    endDate={new Date(searchParams.endDate)}
                />
            </div>
        </div>
    )
}
