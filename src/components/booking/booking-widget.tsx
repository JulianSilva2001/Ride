"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, Car, ShieldCheck, Info } from "lucide-react"
import { format } from "date-fns"
import { createBooking } from "@/app/actions/booking"
import { cn } from "@/lib/utils"
import PriceDisplay from "@/components/shared/price-display"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BookingWidgetProps {
    car: any
    user: any
}

export default function BookingWidget({ car, user }: BookingWidgetProps) {
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [protectionPlan, setProtectionPlan] = useState("Standard")
    const [isDelivery, setIsDelivery] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const calculateTotal = () => {
        if (!startDate || !endDate) return 0
        const start = new Date(startDate)
        const end = new Date(endDate)
        const diffTime = Math.abs(end.getTime() - start.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
        return diffDays > 0 ? diffDays : 0
    }

    const days = calculateTotal()

    // Costs
    const rentalCost = days * car.pricePerDay

    const protectionPlans = {
        Basic: 0,
        Standard: 2500,
        Premium: 5000
    }
    const protectionCost = protectionPlans[protectionPlan as keyof typeof protectionPlans] * days
    const deliveryFee = (isDelivery && car.deliveryOption) ? (car.deliveryFee || 0) : 0
    const totalCost = rentalCost + protectionCost + deliveryFee

    const handleBooking = async () => {
        if (!user) {
            router.push(`/api/auth/signin?callbackUrl=/car/${car.id}`)
            return
        }

        // Basic Client-side Validation for KYC
        if (!user.kyc || !user.kyc.nic) {
            router.push("/verify-account")
            return
        }

        if (!startDate || !endDate) {
            alert("Please select dates")
            return
        }

        setLoading(true)
        const formData = new FormData()
        formData.append("carId", car.id)
        formData.append("startDate", new Date(startDate).toISOString())
        formData.append("endDate", new Date(endDate).toISOString())
        formData.append("protectionPlan", protectionPlan)
        formData.append("deliverySelected", isDelivery ? "true" : "false")
        formData.append("totalCost", totalCost.toString())

        try {
            await createBooking(formData)
        } catch (error) {
            console.error(error)
            alert("Booking failed. Please check availability and try again.")
            setLoading(false)
        }
    }

    return (
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6 sticky top-24">
            <div className="flex justify-between items-baseline">
                <span className="text-2xl font-bold"><PriceDisplay amount={car.pricePerDay} /></span>
                <span className="text-gray-500">/ day</span>
            </div>

            {/* Date Inputs */}
            <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Trip Start</label>
                        <input
                            type="date"
                            className="w-full bg-gray-50 border rounded p-2 text-sm outline-none focus:border-black"
                            required
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Trip End</label>
                        <input
                            type="date"
                            className="w-full bg-gray-50 border rounded p-2 text-sm outline-none focus:border-black"
                            required
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {days > 0 && (
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                    <hr />

                    {/* Protection Plan */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-primary" />
                            Protection Plan
                        </label>
                        <Select value={protectionPlan} onValueChange={setProtectionPlan}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Basic">Basic (Included)</SelectItem>
                                <SelectItem value="Standard">Standard (+<PriceDisplay amount={2500} />/day)</SelectItem>
                                <SelectItem value="Premium">Premium (+<PriceDisplay amount={5000} />/day)</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">
                            {protectionPlan === "Basic" && "Minimum coverage."}
                            {protectionPlan === "Standard" && "Collision risk reduced."}
                            {protectionPlan === "Premium" && "Zero excess liability."}
                        </p>
                    </div>

                    {/* Delivery Option */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold flex items-center gap-2">
                            <Car className="w-4 h-4 text-primary" />
                            Pickup / Delivery
                        </label>
                        <div className="flex gap-2">
                            <div
                                onClick={() => setIsDelivery(false)}
                                className={cn(
                                    "flex-1 p-2 rounded border text-center text-sm cursor-pointer transition-colors",
                                    !isDelivery ? "border-black bg-gray-900 text-white" : "border-gray-200 hover:border-gray-300"
                                )}
                            >
                                Self Pickup
                            </div>
                            <div
                                onClick={() => { if (car.deliveryOption) setIsDelivery(true) }}
                                className={cn(
                                    "flex-1 p-2 rounded border text-center text-sm transition-colors flex flex-col justify-center",
                                    isDelivery ? "border-black bg-gray-900 text-white" : "border-gray-200",
                                    !car.deliveryOption ? "opacity-50 cursor-not-allowed bg-gray-50" : "cursor-pointer hover:border-gray-300"
                                )}
                            >
                                <span>Delivery</span>
                                {car.deliveryOption ? (
                                    <span className="text-[10px] opacity-80">+<PriceDisplay amount={car.deliveryFee} /></span>
                                ) : (
                                    <span className="text-[10px] opacity-50">Unavailable</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <hr />

                    {/* Price Breakdown */}
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="underline decoration-dotted text-gray-600">Rental ({days} days)</span>
                            <span><PriceDisplay amount={rentalCost} /></span>
                        </div>
                        {protectionCost > 0 && (
                            <div className="flex justify-between">
                                <span className="underline decoration-dotted text-gray-600">Protection fee</span>
                                <span><PriceDisplay amount={protectionCost} /></span>
                            </div>
                        )}
                        {deliveryFee > 0 && (
                            <div className="flex justify-between">
                                <span className="underline decoration-dotted text-gray-600">Delivery fee</span>
                                <span><PriceDisplay amount={deliveryFee} /></span>
                            </div>
                        )}
                        <div className="flex justify-between pt-2 font-bold text-lg border-t">
                            <span>Total</span>
                            <span><PriceDisplay amount={totalCost} /></span>
                        </div>
                    </div>
                </div>
            )}

            <Button onClick={handleBooking} disabled={loading} size="lg" className="w-full font-bold text-lg h-12">
                {loading ? "Processing..." : "Book this car"}
            </Button>

            <div className="mt-4 text-center text-xs text-gray-400">
                You won't be charged yet
            </div>
        </div>
    )
}
