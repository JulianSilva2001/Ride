"use client"

import { CurrencyProvider } from "@/lib/currency-context"
import { SessionProvider } from "next-auth/react"

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <CurrencyProvider>
                {children}
            </CurrencyProvider>
        </SessionProvider>
    )
}
