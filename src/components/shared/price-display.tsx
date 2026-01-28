"use client"

import { useCurrency } from "@/lib/currency-context"

/**
 * Component to display prices formatted according to the selected currency.
 * Accepts price in USD.
 */
export default function PriceDisplay({ amount, className }: { amount: number, className?: string }) {
    const { formatPrice } = useCurrency()

    return (
        <span className={className}>
            {formatPrice(amount)}
        </span>
    )
}
