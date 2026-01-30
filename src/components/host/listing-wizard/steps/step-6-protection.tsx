"use client"

import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import FileUpload from "@/components/shared/file-upload"

export default function ProtectionStep({ data, updateData, errors }: { data: any, updateData: (d: any) => void, errors: any }) {

    const currencyCode = data.currency || "LKR"

    const formatCurrency = (val: number) => {
        if (currencyCode === 'LKR') {
            return 'Rs. ' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val || 0)
        }
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(val || 0)
    }

    const price = data.pricePerDay || 0

    const tiers = [
        {
            id: 'Basic',
            name: 'Basic',
            fee: '12%',
            earnings: formatCurrency(price * 0.88),
            features: [
                'Standard Support',
                'Min. Insurance',
                'GPS Optional'
            ],
            recommended: false
        },
        {
            id: 'Secure',
            name: 'Secure',
            fee: '15%',
            earnings: formatCurrency(price * 0.85),
            features: [
                'Priority Support',
                'Medium Insurance',
                'GPS Required'
            ],
            recommended: true
        },
        {
            id: 'Pro',
            name: 'Pro',
            fee: '20%',
            earnings: formatCurrency(price * 0.80),
            features: [
                '24/7 Support',
                'Max Insurance',
                'GPS Required'
            ],
            recommended: false
        }
    ]

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <Label className="text-lg font-semibold">Select Protection Plan</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {tiers.map((tier) => (
                        <div
                            key={tier.id}
                            className={`
                                relative border-2 p-4 rounded-xl cursor-pointer transition-all
                                ${data.protectionTier === tier.id
                                    ? 'border-primary bg-primary/5'
                                    : 'border-gray-200 hover:border-gray-300'
                                }
                            `}
                            onClick={() => updateData({ protectionTier: tier.id })}
                        >
                            {tier.recommended && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                                    Recommended
                                </div>
                            )}
                            <div className="text-center mb-4">
                                <h3 className="font-bold text-lg">{tier.name}</h3>
                                <p className="text-2xl font-bold text-gray-700">{tier.fee}</p>
                                <p className="text-xs text-gray-500">Platform Fee</p>
                            </div>
                            <ul className="space-y-2 text-sm text-gray-600 mb-4">
                                {tier.features.map((feature, i) => (
                                    <li key={i} className="flex items-center">
                                        <span className="mr-2 text-primary">✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4 border-t pt-6">
                <Label className="text-lg font-semibold">Vehicle Security</Label>

                <div className="flex items-center space-x-2 border p-4 rounded-lg">
                    <Checkbox
                        id="gpsInstalled"
                        checked={data.gpsInstalled}
                        onCheckedChange={(checked) => updateData({ gpsInstalled: !!checked })}
                        className={errors.gpsInstalled ? "border-red-500" : ""}
                    />
                    <div className="flex-1">
                        <Label htmlFor="gpsInstalled" className="font-semibold">GPS Tracker Installed?</Label>
                        <p className="text-sm text-gray-500">Required for Secure and Pro tiers.</p>
                        {errors.gpsInstalled && <p className="text-xs text-red-500 mt-1">{errors.gpsInstalled}</p>}
                    </div>
                </div>

                {data.gpsInstalled && (
                    <div className="pl-4 border-l-2 border-gray-100 ml-4">
                        <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                            <p className="text-sm text-yellow-800">
                                Please upload a photo of the installed GPS device or the app dashboard showing the vehicle's location.
                            </p>
                        </div>
                        <FileUpload
                            label="GPS Device / App Screenshot *"
                            value={(data.images || []).find((img: any) => img.label === "GPS")?.url || ""}
                            onChange={(url: string) => {
                                const newImages = [...(data.images || [])].filter((img: any) => img.label !== "GPS")
                                if (url) newImages.push({ label: "GPS", url })
                                updateData({ images: newImages })
                            }}
                            maxSizeMB={5}
                        />
                        {errors.gpsImage && <p className="text-xs text-red-500 mt-1">{errors.gpsImage}</p>}
                    </div>
                )}
            </div>
        </div>
    )
}
