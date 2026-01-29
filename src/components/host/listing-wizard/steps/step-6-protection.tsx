"use client"

import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function ProtectionStep({ data, updateData, errors }: { data: any, updateData: (d: any) => void, errors: any }) {

    const tiers = [
        {
            id: 'Basic',
            name: 'Basic',
            fee: '12%',
            earnings: '$44.00',
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
            earnings: '$42.50',
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
            earnings: '$40.00',
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
            </div>
        </div>
    )
}
