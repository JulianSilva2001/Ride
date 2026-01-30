"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PricingStep({ data, updateData, errors }: { data: any, updateData: (d: any) => void, errors: any }) {
    const currency = data.currency || "LKR"
    const isLKR = currency === "LKR"

    return (
        <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                <div>
                    <Label>Currency</Label>
                    <p className="text-xs text-gray-500">Choose your listing currency.</p>
                </div>
                <div className="w-32">
                    <Select value={currency} onValueChange={(val) => updateData({ currency: val })}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="LKR">LKR (Rs)</SelectItem>
                            <SelectItem value="USD">USD ($)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="pricePerDay">Price per day ({isLKR ? 'Rs' : '$'}) <span className="text-red-500">*</span></Label>
                    <Input
                        id="pricePerDay"
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.pricePerDay || ""}
                        onChange={(e) => updateData({ pricePerDay: parseFloat(e.target.value) })}
                        placeholder={isLKR ? "15000" : "45.00"}
                        className={errors.pricePerDay ? "border-red-500" : ""}
                    />
                    {errors.pricePerDay && <p className="text-xs text-red-500">{errors.pricePerDay}</p>}
                    <p className="text-xs text-gray-500">You earn 75% of this price.</p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="securityDeposit">Security Deposit ({isLKR ? 'Rs' : '$'})</Label>
                    <Input
                        id="securityDeposit"
                        type="number"
                        min="0"
                        value={data.securityDeposit || ""}
                        onChange={(e) => updateData({ securityDeposit: parseFloat(e.target.value) })}
                        placeholder={isLKR ? "50000" : "300.00"}
                        className={errors.securityDeposit ? "border-red-500" : ""}
                    />
                    {errors.securityDeposit && <p className="text-xs text-red-500">{errors.securityDeposit}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="includedKm">Included KM per day <span className="text-red-500">*</span></Label>
                <Input
                    id="includedKm"
                    type="number"
                    min="10"
                    value={data.includedKm || ""}
                    onChange={(e) => updateData({ includedKm: parseInt(e.target.value) })}
                    placeholder="e.g. 100"
                    className={errors.includedKm ? "border-red-500" : ""}
                />
                {errors.includedKm && <p className="text-xs text-red-500">{errors.includedKm}</p>}
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="extraKmFee">Extra KM Fee ({isLKR ? 'Rs' : '$'}/km)</Label>
                    <Input
                        id="extraKmFee"
                        type="number"
                        step="0.01"
                        value={data.extraKmFee || ""}
                        onChange={(e) => updateData({ extraKmFee: parseFloat(e.target.value) })}
                        placeholder={isLKR ? "100" : "0.25"}
                        className={errors.extraKmFee ? "border-red-500" : ""}
                    />
                    {errors.extraKmFee && <p className="text-xs text-red-500">{errors.extraKmFee}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="fuelPolicy">Fuel Policy <span className="text-red-500">*</span></Label>
                    <Select
                        value={data.fuelPolicy}
                        onValueChange={(val) => updateData({ fuelPolicy: val })}
                    >
                        <SelectTrigger className={errors.fuelPolicy ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select Policy" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Full-to-full">Full-to-full (Recommended)</SelectItem>
                            <SelectItem value="Same-to-same">Same-to-same</SelectItem>
                            <SelectItem value="Prepaid">Prepaid</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.fuelPolicy && <p className="text-xs text-red-500">{errors.fuelPolicy}</p>}
                </div>
            </div>
        </div>
    )
}
