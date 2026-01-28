import { register } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"
import Navbar from "@/components/shared/navbar"

export default function SignupPage({ searchParams }: { searchParams: { callbackUrl?: string } }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-xl shadow-lg border">
                    <div className="text-center">
                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                            Create an account
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Sign up to start your journey
                        </p>
                    </div>

                    <form action={register} className="mt-8 space-y-6">
                        <input type="hidden" name="callbackUrl" value={searchParams.callbackUrl || "/"} />

                        <div className="space-y-4 rounded-md shadow-sm">
                            <div>
                                <Label htmlFor="email-address" className="sr-only">
                                    Email address
                                </Label>
                                <Input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    placeholder="Email address"
                                    className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div>
                                <Label htmlFor="password" className="sr-only">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    placeholder="Password"
                                    className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                />
                            </div>

                            <div className="pt-2">
                                <Label className="text-sm font-medium text-gray-700">I want to:</Label>
                                <RadioGroup defaultValue="USER" name="role" className="mt-2 space-y-2">
                                    <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <RadioGroupItem value="USER" id="r1" />
                                        <Label htmlFor="r1" className="flex-1 cursor-pointer">Rent a car (Guest)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <RadioGroupItem value="HOST" id="r2" />
                                        <Label htmlFor="r2" className="flex-1 cursor-pointer">List my car (Host)</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                className="group relative flex w-full justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                Sign up
                            </Button>
                        </div>
                    </form>

                    <div className="text-center text-sm">
                        <p className="text-gray-600">
                            Already have an account?{" "}
                            <Link href="/api/auth/signin" className="font-semibold text-primary hover:text-primary/90">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
