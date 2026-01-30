import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import Navbar from "@/components/shared/navbar"
import ListingWizard from "@/components/host/listing-wizard/listing-wizard"

export default async function ListingDraftPage({ params }: { params: { id: string } }) {
    const session = await auth()
    if (!session?.user?.id) redirect("/api/auth/signin")

    const car = await db.car.findUnique({
        where: { id: params.id },
        include: { images: true }
    })

    if (!car) {
        return <div>Listing not found</div>
    }

    if (car.hostId !== session.user.id) {
        return <div>Unauthorized</div>
    }

    // Serialize dates for client component
    const initialData = {
        ...car,
        createdAt: car.createdAt.toISOString(),
        updatedAt: car.updatedAt.toISOString(),
        insuranceExpiry: car.insuranceExpiry ? car.insuranceExpiry.toISOString() : null,
        images: car.images || [],
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="container mx-auto px-4 py-8">
                <ListingWizard carId={params.id} initialData={initialData} />
            </div>
        </div>
    )
}
