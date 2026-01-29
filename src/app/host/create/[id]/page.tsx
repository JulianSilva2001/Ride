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
        // The wizard might expect imageUrl as a string for MVP, or we adapt.
        // In schema we added images Relation, but for wizard state we might used 'imageUrl' string in Step 5.
        // Let's pass 'imageUrl' if present in images array or fallback.
        // However, Prisma Car model doesn't have 'imageUrl' field anymore (Wait, checking schema)
        // Schema has `images Image[]`.
        // The wizard state expects `imageUrl`.
        // I should map the first image url to `imageUrl` property for compatibility with the client state.
        imageUrl: car.images?.[0]?.url || "",
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <ListingWizard carId={params.id} initialData={initialData} />
            </div>
        </div>
    )
}
