"use client"

import { Button } from "@/components/ui/button"
import { createBooking } from "@/app/actions/booking"
import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import PriceDisplay from "@/components/shared/price-display"
// We would usually use a proper Popover DatePicker here, but for speed/robustness in this environment
// let's use standard native date inputs styled nicely, or a simple text input for today.
// Actually, native date input is reliable.

interface BookingWidgetProps {
    carId: string
    pricePerDay: number
}

export default function BookingWidget({ carId, pricePerDay }: BookingWidgetProps) {
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")

    const calculateTotal = () => {
        if (!startDate || !endDate) return 0
        const start = new Date(startDate)
        const end = new Date(endDate)
        const diffTime = Math.abs(end.getTime() - start.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
        return diffDays > 0 ? diffDays * pricePerDay : 0
    }

    const total = calculateTotal()

    return (
        <form action={createBooking} className="space-y-4">
            <input type="hidden" name="carId" value={carId} />

            <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Trip Start</label>
                        <input
                            name="startDate"
                            type="date"
                            className="w-full bg-white border rounded p-2 text-sm outline-none focus:border-black"
                            required
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Trip End</label>
                        <input
                            name="endDate"
                            type="date"
                            className="w-full bg-white border rounded p-2 text-sm outline-none focus:border-black"
                            required
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {total > 0 && (
                <div className="flex justify-between items-center py-2 font-semibold">
                    <span>Total</span>
                    <span><PriceDisplay amount={total} /></span>
                </div>
            )}

            <Button type="submit" size="lg" className="w-full font-bold text-lg h-12">
                Book this car
            </Button>

            <div className="mt-4 text-center text-sm text-gray-500">
                You won't be charged yet
            </div>
        </form>
    )
}
