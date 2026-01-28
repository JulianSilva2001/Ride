import Navbar from "@/components/shared/navbar"
import SignupWizard from "@/components/auth/signup-wizard"

export default function SignupPage({ searchParams }: { searchParams: { callbackUrl?: string } }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <SignupWizard callbackUrl={searchParams.callbackUrl} />
        </div>
    )
}
