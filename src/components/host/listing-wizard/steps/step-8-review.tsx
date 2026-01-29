"use client"

import { Check, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"

// Helper to format currency
const currency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0)
}

export default function ReviewStep({ data, updateData }: { data: any, updateData: (d: any) => void }) {
    return (
        <div className="space-y-8">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold">Ready to publish?</h3>
                <p className="text-gray-500">Review your listing details one last time.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    {/* Preview Card */}
                    <div className="border rounded-xl overflow-hidden shadow-sm">
                        <div className="aspect-video bg-gray-200 relative">
                            {data.imageUrl ? (
                                <img src={data.imageUrl} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                            )}
                        </div>
                        <div className="p-4">
                            <h4 className="font-bold text-lg">{data.year} {data.make} {data.model}</h4>
                            <p className="text-sm text-gray-500 mb-2">{data.location}</p>
                            <div className="flex justify-between items-end">
                                <span className="font-bold text-lg">{currency(data.pricePerDay)}<span className="text-sm font-normal text-gray-500">/day</span></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 text-sm">
                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <h5 className="font-semibold mb-2 flex items-center justify-between">
                            Settings
                            <Check className="h-4 w-4 text-green-600" />
                        </h5>
                        <ul className="space-y-1 text-gray-600">
                            <li>Availability: <span className="font-medium text-black">{data.availabilityType}</span></li>
                            <li>Fuel Policy: <span className="font-medium text-black">{data.fuelPolicy}</span></li>
                            <li>Included KM: <span className="font-medium text-black">{data.includedKm} km/day</span></li>
                            <li>Protection: <span className="font-medium text-black">{data.protectionTier}</span></li>
                        </ul>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <h5 className="font-semibold mb-2 flex items-center justify-between">
                            Details
                            <Check className="h-4 w-4 text-green-600" />
                        </h5>
                        <p className="text-gray-600 line-clamp-3 italic">"{data.description}"</p>
                    </div>

                    {!data.ownershipConfirmed && (
                        <div className="bg-red-50 p-3 rounded text-red-600 text-xs border border-red-100">
                            ⚠️ You must confirm ownership in the previous step to publish.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
