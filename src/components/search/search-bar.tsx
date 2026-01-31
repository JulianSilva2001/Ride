"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Search, Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SearchBar() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Parse existing params to split date/time if present
    const parseDateTime = (param: string | null) => {
        if (!param) return { date: "", time: "10:00" }
        const dateObj = new Date(param)
        if (isNaN(dateObj.getTime())) return { date: "", time: "10:00" }

        const date = dateObj.toISOString().split('T')[0]
        const time = dateObj.toTimeString().slice(0, 5)
        return { date, time }
    }

    const { date: initialFromDate, time: initialFromTime } = parseDateTime(searchParams.get("from"))
    const { date: initialUntilDate, time: initialUntilTime } = parseDateTime(searchParams.get("until"))

    const [location, setLocation] = useState(searchParams.get("location") || "")
    const [fromDate, setFromDate] = useState(initialFromDate)
    const [fromTime, setFromTime] = useState(initialFromTime)
    const [untilDate, setUntilDate] = useState(initialUntilDate)
    const [untilTime, setUntilTime] = useState(initialUntilTime)

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const params = new URLSearchParams()

        if (location) params.set("location", location)

        if (fromDate) {
            const finalFrom = fromTime ? `${fromDate}T${fromTime}` : fromDate
            params.set("from", finalFrom)
        }

        if (untilDate) {
            const finalUntil = untilTime ? `${untilDate}T${untilTime}` : untilDate
            params.set("until", finalUntil)
        }

        router.push(`/search?${params.toString()}`)
    }

    const today = new Date().toISOString().split("T")[0]

    // Generate time options (30m intervals)
    const timeOptions = []
    for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 60; j += 30) {
            const hour = i.toString().padStart(2, '0')
            const minute = j.toString().padStart(2, '0')
            timeOptions.push(`${hour}:${minute}`)
        }
    }

    return (
        <form onSubmit={handleSearch} className="bg-white p-2 rounded-full shadow-lg max-w-4xl mx-auto flex items-center border">
            {/* Location Input */}
            <div className="flex-[1.5] px-6 border-r">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Where</label>
                <input
                    type="text"
                    placeholder="City, airport, or hotel"
                    className="w-full outline-none text-gray-700 font-medium bg-transparent text-sm placeholder:font-normal"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
            </div>

            {/* From Section */}
            <div className="flex-[1.2] px-4 border-r flex flex-col">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">From</label>
                <div className="flex items-center gap-2">
                    <input
                        type="date"
                        className="outline-none text-gray-700 font-medium bg-transparent text-sm w-full"
                        value={fromDate}
                        min={today}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                    <div className="w-20 shrink-0">
                        <select
                            className="w-full bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer"
                            value={fromTime}
                            onChange={(e) => setFromTime(e.target.value)}
                        >
                            {timeOptions.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Until Section */}
            <div className="flex-[1.2] px-4 flex flex-col">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Until</label>
                <div className="flex items-center gap-2">
                    <input
                        type="date"
                        className="outline-none text-gray-700 font-medium bg-transparent text-sm w-full"
                        value={untilDate}
                        min={fromDate || today}
                        onChange={(e) => setUntilDate(e.target.value)}
                    />
                    <div className="w-20 shrink-0">
                        <select
                            className="w-full bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer"
                            value={untilTime}
                            onChange={(e) => setUntilTime(e.target.value)}
                        >
                            {timeOptions.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <Button type="submit" size="icon" className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90 shrink-0 ml-2">
                <Search className="h-5 w-5 text-white" />
            </Button>
        </form>
    )
}
