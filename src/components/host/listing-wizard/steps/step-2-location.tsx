"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function LocationStep({ data, updateData, errors }: { data: any, updateData: (d: any) => void, errors: any }) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="location">Pickup Location (Address / Area) <span className="text-red-500">*</span></Label>
                <Input
                    id="location"
                    value={data.location || ""}
                    onChange={(e) => updateData({ location: e.target.value })}
                    placeholder="e.g. Colombo 03, Sri Lanka"
                    className={errors.location ? "border-red-500" : ""}
                />
                {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="availabilityType">Availability Type <span className="text-red-500">*</span></Label>
                <Select
                    value={data.availabilityType}
                    onValueChange={(val) => updateData({ availabilityType: val })}
                >
                    <SelectTrigger className={errors.availabilityType ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select Availability" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Always">Always available</SelectItem>
                        <SelectItem value="Custom">Custom availability</SelectItem>
                    </SelectContent>
                </Select>
                {errors.availabilityType && <p className="text-xs text-red-500">{errors.availabilityType}</p>}
            </div>

            <div className="flex items-center space-x-2 border p-4 rounded-lg">
                <Checkbox
                    id="deliveryOption"
                    checked={data.deliveryOption}
                    onCheckedChange={(checked) => updateData({ deliveryOption: !!checked })}
                />
                <div className="flex-1">
                    <Label htmlFor="deliveryOption" className="font-semibold">Offer Vehicle Delivery?</Label>
                    <p className="text-sm text-gray-500">Deliver the car to the guest's location.</p>
                </div>
            </div>

            {data.deliveryOption && (
                <div className="space-y-2 pl-6 border-l-2">
                    <Label htmlFor="deliveryFee">Delivery Fee ($)</Label>
                    <Input
                        id="deliveryFee"
                        type="number"
                        min="0"
                        value={data.deliveryFee || ""}
                        onChange={(e) => updateData({ deliveryFee: parseFloat(e.target.value) })}
                        placeholder="e.g. 10.00"
                    />
                </div>
            )}
        </div>
    )
}
