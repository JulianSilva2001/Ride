import Link from "next/link"
import { Search, Menu, User, Car } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Car className="h-6 w-6" />
                    <span className="text-xl font-bold tracking-tight">Ride</span>
                </Link>

                {/* User Menu */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" className="hidden md:flex font-semibold">
                        Become a host
                    </Button>
                    <div className="flex items-center gap-2 border rounded-full p-2 py-1 hover:shadow-md transition cursor-pointer">
                        <Menu className="h-5 w-5" />
                        <div className="bg-gray-500 rounded-full p-1">
                            <User className="h-4 w-4 text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
