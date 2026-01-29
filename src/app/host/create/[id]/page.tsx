import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { adminDb } from "@/lib/firebase"
import Navbar from "@/components/shared/navbar"
import ListingWizard from "@/components/host/listing-wizard/listing-wizard"

export default async function ListingDraftPage({ params }: { params: { id: string } }) {
    const session = await auth()
    if (!session?.user) redirect("/api/auth/signin")

    const docRef = adminDb.collection("cars").doc(params.id)
    const doc = await docRef.get()

    if (!doc.exists) {
        return <div>Listing not found</div>
    }

    const data = doc.data()

    if (data?.hostId !== session.user.id) {
        return <div>Unauthorized</div>
    }

    // Data handling: convert Firestore usage to plain JS objects for client components
    const initialData = {
        id: doc.id,
        ...data,
        imageUrl: data?.imageUrl || "",
        createdAt: data?.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null,
        updatedAt: data?.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : null,
        insuranceExpiry: data?.insuranceExpiry?.toDate ? data.insuranceExpiry.toDate().toISOString() : data?.insuranceExpiry || null,
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
