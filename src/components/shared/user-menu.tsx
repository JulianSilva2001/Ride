"use client"

import Link from "next/link"
import { Menu, User, LogOut, Ticket, Heart, Car } from "lucide-react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UserMenuProps {
    user: any // Type this more strictly if we had the User type handy
}

export default function UserMenu({ user }: UserMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 border rounded-full p-2 py-1 hover:shadow-md transition cursor-pointer">
                    <Menu className="h-5 w-5" />
                    <div className="bg-gray-500 rounded-full p-1">
                        {user?.image ? (
                            <img src={user.image} alt={user.name} className="h-4 w-4 rounded-full" />
                        ) : (
                            <User className="h-4 w-4 text-white" />
                        )}
                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
                {user ? (
                    <>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {user.role === "HOST" ? (
                            <DropdownMenuItem className="cursor-pointer" asChild>
                                <Link href="/host/dashboard">
                                    <Car className="mr-2 h-4 w-4" />
                                    <span>Host Dashboard</span>
                                </Link>
                            </DropdownMenuItem>
                        ) : (
                            <>
                                <DropdownMenuItem className="cursor-pointer" asChild>
                                    <Link href="/trips">
                                        <Ticket className="mr-2 h-4 w-4" />
                                        <span>Trips</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" asChild>
                                    <Link href="/wishlist">
                                        <Heart className="mr-2 h-4 w-4" />
                                        <span>Wishlist</span>
                                    </Link>
                                </DropdownMenuItem>
                            </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-600 cursor-pointer focus:text-red-600"
                            onClick={() => signOut({ callbackUrl: "/" })}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </>
                ) : (
                    <>
                        <DropdownMenuItem className="font-semibold cursor-pointer" asChild>
                            <Link href="/login">
                                Log in
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" asChild>
                            <Link href="/signup">
                                Sign up
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer" asChild>
                            <Link href="/host">
                                Host your car
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                            Help center
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu >
    )
}
