"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type Currency = 'USD' | 'LKR'

interface CurrencyContextType {
    currency: Currency
    setCurrency: (currency: Currency) => void
    convertPrice: (priceInUsd: number) => number
    formatPrice: (priceInUsd: number) => string
    exchangeRate: number
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrency] = useState<Currency>('LKR')
    const EXCHANGE_RATE = 300 // 1 USD = 300 LKR

    useEffect(() => {
        const saved = localStorage.getItem("ride_currency") as Currency
        if (saved) {
            setCurrency(saved)
        }
    }, [])

    const handleSetCurrency = (c: Currency) => {
        setCurrency(c)
        localStorage.setItem("ride_currency", c)
    }

    const convertPrice = (priceInUsd: number) => {
        if (currency === 'USD') return priceInUsd
        return priceInUsd * EXCHANGE_RATE
    }

    const formatPrice = (priceInUsd: number) => {
        const value = convertPrice(priceInUsd)
        if (currency === 'USD') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(value)
        } else {
            // "en-LK" locale with "currency" style usually gives "LKR 1,000.00" or similar.
            // User requested "Rs.".
            const formattedNumber = new Intl.NumberFormat('en-LK', {
                style: 'decimal',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(value)
            return `Rs. ${formattedNumber}`
        }
    }

    return (
        <CurrencyContext.Provider value={{
            currency,
            setCurrency: handleSetCurrency,
            convertPrice,
            formatPrice,
            exchangeRate: EXCHANGE_RATE
        }}>
            {children}
        </CurrencyContext.Provider>
    )
}

export function useCurrency() {
    const context = useContext(CurrencyContext)
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider')
    }
    return context
}
