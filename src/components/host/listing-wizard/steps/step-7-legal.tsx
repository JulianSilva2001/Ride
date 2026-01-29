"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function LegalStep({ data, updateData, errors }: { data: any, updateData: (d: any) => void, errors: any }) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="regNumber">Vehicle Registration Number <span className="text-red-500">*</span></Label>
                <Input
                    id="regNumber"
                    value={data.regNumber || ""}
                    onChange={(e) => updateData({ regNumber: e.target.value })}
                    placeholder="e.g. ABC-1234"
                    className={`uppercase ${errors.regNumber ? "border-red-500" : ""}`}
                />
                {errors.regNumber && <p className="text-xs text-red-500">{errors.regNumber}</p>}
                <p className="text-xs text-gray-500">This will not be shown publicly until booking is confirmed.</p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="insuranceExpiry">Insurance Policy Expiry <span className="text-red-500">*</span></Label>
                <Input
                    id="insuranceExpiry"
                    type="date"
                    value={data.insuranceExpiry ? new Date(data.insuranceExpiry).toISOString().split('T')[0] : ""}
                    onChange={(e) => updateData({ insuranceExpiry: new Date(e.target.value) })}
                    className={errors.insuranceExpiry ? "border-red-500" : ""}
                />
                {errors.insuranceExpiry && <p className="text-xs text-red-500">{errors.insuranceExpiry}</p>}
            </div>

            <div className={`flex items-start space-x-3 border p-4 rounded-lg bg-yellow-50 ${errors.ownershipConfirmed ? "border-red-500 bg-red-50" : "border-yellow-100"}`}>
                <Checkbox
                    id="ownershipConfirmed"
                    checked={data.ownershipConfirmed}
                    onCheckedChange={(checked) => updateData({ ownershipConfirmed: !!checked })}
                />
                <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="ownershipConfirmed" className="font-semibold text-base cursor-pointer">
                        Confirm Ownership
                    </Label>
                    <p className="text-sm text-gray-600">
                        I confirm that I own this vehicle or have explicit authorization from the owner to rent it out on this platform. I understand that false representation may lead to account suspension.
                    </p>
                    {errors.ownershipConfirmed && <p className="text-xs text-red-500 mt-1">{errors.ownershipConfirmed}</p>}
                </div>
            </div>
        </div>
    )
}
