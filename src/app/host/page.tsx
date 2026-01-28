import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/shared/navbar";
import { CheckCircle2, DollarSign, Shield, Calendar } from "lucide-react";

export default function HostLandingPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
                <img
                    src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2940&auto=format&fit=crop"
                    alt="Luxury car background"
                    className="absolute inset-0 -z-10 h-full w-full object-cover opacity-20"
                />
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                            Turn your car into earnings
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-300">
                            Join thousands of hosts earning extra income by sharing their cars on the world's largest car sharing marketplace.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link href="/host/create">
                                <Button size="lg" className="text-lg px-8 py-6">
                                    Get Started
                                </Button>
                            </Link>
                            <a href="#benefits" className="text-sm font-semibold leading-6 text-white">
                                Learn more <span aria-hidden="true">→</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div id="benefits" className="py-24 sm:py-32 bg-gray-50">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-base font-semibold leading-7 text-primary">Why Host?</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Earn money on your terms
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                            <div className="flex flex-col">
                                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                                    <DollarSign className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                                    Earn Extra Income
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                    <p className="flex-auto">
                                        Offset the cost of car ownership. Our hosts earn an average of $700/month sharing their cars.
                                    </p>
                                </dd>
                            </div>
                            <div className="flex flex-col">
                                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                                    <Shield className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                                    You're Covered
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                    <p className="flex-auto">
                                        Rest easy with our $1M liability insurance policy and physical damage protection for every trip.
                                    </p>
                                </dd>
                            </div>
                            <div className="flex flex-col">
                                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                                    <Calendar className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                                    Your Schedule
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                    <p className="flex-auto">
                                        You're in control. Set your own availability, prices, and rules for your car.
                                    </p>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            {/* How it works */}
            <div className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-base font-semibold leading-7 text-primary">Simple Process</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            How it works
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-3 lg:gap-x-8">
                            <div className="relative pl-16">
                                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                    <span className="font-bold text-primary">1</span>
                                </div>
                                <h3 className="text-base font-semibold leading-7 text-gray-900">List your car</h3>
                                <p className="mt-2 text-base leading-7 text-gray-600">
                                    Create a free listing with photos and description. Set your daily price and availability.
                                </p>
                            </div>
                            <div className="relative pl-16">
                                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                    <span className="font-bold text-primary">2</span>
                                </div>
                                <h3 className="text-base font-semibold leading-7 text-gray-900">Welcome guests</h3>
                                <p className="mt-2 text-base leading-7 text-gray-600">
                                    When a guest books your car, you'll confirm the time and location for pickup.
                                </p>
                            </div>
                            <div className="relative pl-16">
                                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                    <span className="font-bold text-primary">3</span>
                                </div>
                                <h3 className="text-base font-semibold leading-7 text-gray-900">Sit back and earn</h3>
                                <p className="mt-2 text-base leading-7 text-gray-600">
                                    Get paid directly to your bank account within 3 days after each trip.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-primary/5 py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Ready to start earning?
                        </h2>
                        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
                            Join the host community today and turn your depreciating asset into an income engine.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link href="/host/create">
                                <Button size="lg" className="text-lg px-8 py-6">
                                    List Your Car
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
