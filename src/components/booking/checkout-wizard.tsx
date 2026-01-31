"use client"

import { useState } from "react"
import { Car as CarType, User } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Calendar, CreditCard, ChevronRight, Check, AlertCircle, Car } from "lucide-react"
import PriceDisplay from "@/components/shared/price-display"
import { createBooking } from "@/app/actions/booking"

interface CheckoutWizardProps {
    car: any
    user: any
    startDate: Date
    endDate: Date
}

export default function CheckoutWizard({ car, user, startDate, endDate }: CheckoutWizardProps) {
    const [step, setStep] = useState(1) // 1: Protection, 2: Payment
    const [protectionPlan, setProtectionPlan] = useState("Standard")
    const [isDelivery, setIsDelivery] = useState(false)
    const [loading, setLoading] = useState(false)

    // Calculations
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    const rentalCost = car.pricePerDay * days

    const protectionPlans = {
        Basic: 0,
        Standard: 2500, // LKR
        Premium: 5000   // LKR
    }

    const protectionCost = protectionPlans[protectionPlan as keyof typeof protectionPlans] * days
    const deliveryFee = isDelivery && car.deliveryOption ? (car.deliveryFee || 0) : 0
    const totalCost = rentalCost + protectionCost + deliveryFee

    const handleConfirm = async () => {
        setLoading(true)
        const formData = new FormData()
        formData.append("carId", car.id)
        formData.append("startDate", startDate.toISOString())
        formData.append("endDate", endDate.toISOString())
        formData.append("protectionPlan", protectionPlan)
        formData.append("deliverySelected", isDelivery ? "true" : "false")
        formData.append("totalCost", totalCost.toString())

        try {
            await createBooking(formData)
        } catch (error) {
            console.error(error)
            alert("Booking failed. Please try again.")
            setLoading(false)
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
                {/* Steps Indicator */}
                <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
                    <span className={step >= 1 ? "text-primary flex items-center gap-2" : ""}>
                        <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs border border-primary">1</span>
                        Protection
                    </span>
                    <ChevronRight className="w-4 h-4" />
                    <span className={step >= 2 ? "text-primary flex items-center gap-2" : ""}>
                        <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs border">2</span>
                        Payment
                    </span>
                </div>

                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-2xl font-bold">Choose your protection plan</h2>
                        <div className="space-y-4">
                            {Object.entries(protectionPlans).map(([plan, price]) => (
                                <div
                                    key={plan}
                                    onClick={() => setProtectionPlan(plan)}
                                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${protectionPlan === plan ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200"}`}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-bold text-lg">{plan}</h3>
                                        <PriceDisplay amount={price} />
                                    </div>
                                    <p className="text-gray-500 text-sm">
                                        {plan === "Basic" && "Minimum coverage required by law."}
                                        {plan === "Standard" && "Collision damage waiver + theft protection."}
                                        {plan === "Premium" && "Zero excess liability + roadside assistance."}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <Button onClick={() => setStep(2)} size="lg" className="w-full">Continue to Payment</Button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-2xl font-bold">Confirm and Pay</h2>

                        {/* Delivery Option */}
                        <div className="bg-white p-6 rounded-xl border">
                            <h3 className="font-bold mb-4">How would you like to get the car?</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div
                                    onClick={() => setIsDelivery(false)}
                                    className={`p-4 rounded-lg border-2 cursor-pointer flex flex-col items-center gap-2 ${!isDelivery ? "border-primary bg-primary/5" : "border-gray-100"}`}
                                >
                                    <Car className="w-6 h-6" />
                                    <span className="font-medium">Self Pickup</span>
                                    <span className="text-xs text-green-600 font-bold">Free</span>
                                </div>
                                <div
                                    onClick={() => {
                                        if (car.deliveryOption) setIsDelivery(true)
                                    }}
                                    className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all
                                        ${!car.deliveryOption ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-100" : "cursor-pointer"}
                                        ${isDelivery && car.deliveryOption ? "border-primary bg-primary/5" : "border-gray-100"}
                                    `}
                                >
                                    <div className="flex items-center gap-2">
                                        <Car className="w-6 h-6" />
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium">Delivery</span>
                                    {car.deliveryOption ? (
                                        <span className="text-xs font-bold"><PriceDisplay amount={car.deliveryFee || 0} /></span>
                                    ) : (
                                        <span className="text-xs text-gray-500 font-medium">Not Available</span>
                                    )}
                                </div>
                            </div>
                            {isDelivery && car.deliveryOption && (
                                <p className="mt-4 text-sm text-gray-500">
                                    The car will be delivered to your registered address within 10km of {car.location || "City Center"}.
                                </p>
                            )}
                        </div>

                        <div className="bg-white p-6 rounded-xl border space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gray-100 rounded-lg">
                                    <CreditCard className="w-6 h-6 text-gray-700" />
                                </div>
                                <div>
                                    <h4 className="font-bold">Visa ending in 4242</h4>
                                    <p className="text-sm text-gray-500">Expires 12/28</p>
                                </div>
                                <Button variant="outline" size="sm" className="ml-auto">Change</Button>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-blue-800 text-sm">
                            <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                            <p>You will be charged <span className="font-bold"><PriceDisplay amount={totalCost} /></span> upon confirmation. A security deposit may be held on your card.</p>
                        </div>

                        <Button onClick={handleConfirm} disabled={loading} size="lg" className="w-full h-12 text-lg">
                            {loading ? "Processing..." : "Confirm Booking"}
                        </Button>
                    </div>
                )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="md:col-span-1">
                <div className="bg-white p-6 rounded-xl border shadow-sm sticky top-24">
                    <h3 className="font-bold text-lg mb-4">Trip Summary</h3>

                    <div className="flex gap-4 mb-6">
                        {car.images[0] && (
                            <img src={car.images[0].url} alt={car.model} className="w-20 h-20 object-cover rounded-lg" />
                        )}
                        <div>
                            <h4 className="font-bold">{car.make} {car.model}</h4>
                            <p className="text-sm text-gray-500">{car.year}</p>
                        </div>
                    </div>

                    <div className="space-y-3 text-sm border-t py-4">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Start Date</span>
                            <span className="font-medium">{startDate.toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">End Date</span>
                            <span className="font-medium">{endDate.toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Duration</span>
                            <span className="font-medium">{days} days</span>
                        </div>
                    </div>

                    <div className="space-y-3 text-sm border-t py-4">
                        <div className="flex justify-between">
                            <span className="text-gray-500">{car.pricePerDay} x {days} days</span>
                            <span className="font-medium"><PriceDisplay amount={rentalCost} /></span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Protection ({protectionPlan})</span>
                            <span className="font-medium"><PriceDisplay amount={protectionCost} /></span>
                        </div>

                        {isDelivery && (
                            <div className="flex justify-between">
                                <span className="text-gray-500">Delivery Fee</span>
                                <span className="font-medium"><PriceDisplay amount={deliveryFee} /></span>
                            </div>
                        )}

                        <div className="flex justify-between text-gray-500">
                            <span>Service Fee</span>
                            <span>Included</span>
                        </div>
                    </div>

                    <div className="border-t pt-4 mt-2 flex justify-between items-center font-bold text-lg">
                        <span>Total</span>
                        <span><PriceDisplay amount={totalCost} /></span>
                    </div>
                </div>
            </div>
        </div>
    )
}
