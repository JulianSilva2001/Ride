import Link from "next/link"
import { Search, Menu, User, Car } from "lucide-react"
import { Button } from "@/components/ui/button"

import { auth } from "@/auth"
import UserMenu from "./user-menu"
import CurrencySelector from "./currency-selector"

export default async function Navbar() {
    const session = await auth()

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
                    <CurrencySelector />
                    <Link href="/search">
                        <Button variant="ghost" className="hidden md:flex font-semibold">
                            Rent a Car
                        </Button>
                    </Link>
                    <Link href="/host">
                        <Button variant="ghost" className="hidden md:flex font-semibold">
                            Become a host
                        </Button>
                    </Link>
                    <UserMenu user={session?.user} />
                </div>
            </div>
        </nav>
    )
}
