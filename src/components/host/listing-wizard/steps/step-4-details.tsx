"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

const COMMON_FEATURES = [
    "Bluetooth", "GPS", "Air Conditioning", "Leather seats",
    "Child seat", "USB charging", "Apple CarPlay", "Android Auto",
    "Parking sensors", "Sunroof", "Backup Camera", "Heated Seats"
]

export default function DetailsStep({ data, updateData, errors }: { data: any, updateData: (d: any) => void, errors: any }) {
    // Helper to toggle feature in comma-separated string
    const toggleFeature = (feature: string) => {
        const currentFeatures = data.features ? data.features.split(',').map((f: string) => f.trim()) : []
        let newFeatures
        if (currentFeatures.includes(feature)) {
            newFeatures = currentFeatures.filter((f: string) => f !== feature)
        } else {
            newFeatures = [...currentFeatures, feature]
        }
        updateData({ features: newFeatures.join(', ') })
    }

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <Label htmlFor="description">Description (Required) <span className="text-red-500">*</span></Label>
                <Textarea
                    id="description"
                    value={data.description || ""}
                    onChange={(e) => updateData({ description: e.target.value })}
                    placeholder="Tell renters about your car, condition, comfort, and ideal use..."
                    className={`min-h-[150px] text-base ${errors.description ? "border-red-500" : ""}`}
                />
                {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
            </div>

            <div className="space-y-4">
                <Label className="text-base">Features</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {COMMON_FEATURES.map((feature) => (
                        <div key={feature} className="flex items-center space-x-2">
                            <Checkbox
                                id={`feat-${feature}`}
                                checked={data.features?.includes(feature)}
                                onCheckedChange={() => toggleFeature(feature)}
                            />
                            <Label htmlFor={`feat-${feature}`} className="cursor-pointer font-normal">{feature}</Label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="rules">House Rules</Label>
                <Input
                    id="rules"
                    value={data.rules || ""}
                    onChange={(e) => updateData({ rules: e.target.value })}
                    placeholder="e.g. No smoking, No pets, No off-roading"
                />
            </div>
        </div>
    )
}
