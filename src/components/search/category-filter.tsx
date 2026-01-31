"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Car, TrendingUp, Bus, Bike, Gem, AlertCircle } from "lucide-react"

export default function CategoryFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentCategory = searchParams.get("category") || "All"

    const categories = [
        { name: "All", icon: null },
        { name: "Sedan", icon: Car },
        { name: "SUV", icon: TrendingUp },
        { name: "Van", icon: Bus },
        { name: "Bike", icon: Bike },
        { name: "Hatchback", icon: Car },
        { name: "Luxury", icon: Gem },
    ]

    const handleSelect = (category: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (category === "All") {
            params.delete("category")
        } else {
            params.set("category", category)
        }
        router.push(`/search?${params.toString()}`)
    }

    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-2 -mx-4 px-4 scrollbar-hide">
            {categories.map((cat) => (
                <button
                    key={cat.name}
                    onClick={() => handleSelect(cat.name)}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border",
                        (currentCategory === cat.name || (currentCategory === "All" && cat.name === "All"))
                            ? "bg-primary text-white border-primary shadow-sm"
                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    )}
                >
                    {cat.icon && <cat.icon size={16} />}
                    {cat.name}
                </button>
            ))}
        </div>
    )
}
