"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useCurrency } from "@/lib/currency-context"

export default function CurrencySelector() {
    const { currency, setCurrency } = useCurrency()

    return (
        <Select value={currency} onValueChange={(val: any) => setCurrency(val)}>
            <SelectTrigger className="w-[100px] h-9 border-none bg-transparent focus:ring-0 font-semibold text-sm">
                <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent align="end">
                <SelectItem value="LKR" className="font-semibold">
                    <span className="mr-2">🇱🇰</span> LKR
                </SelectItem>
                <SelectItem value="USD" className="font-semibold">
                    <span className="mr-2">🇺🇸</span> USD
                </SelectItem>
            </SelectContent>
        </Select>
    )
}
