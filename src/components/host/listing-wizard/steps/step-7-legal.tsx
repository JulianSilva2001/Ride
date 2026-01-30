"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import FileUpload from "@/components/shared/file-upload"

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

            {/* Document Uploads */}
            <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold text-gray-900">Required Documents</h3>

                <FileUpload
                    label="Vehicle Registration Book (CR) *"
                    value={data.registrationBookUrl}
                    onChange={(url: string) => updateData({ registrationBookUrl: url })}
                    maxSizeMB={10}
                    accept=".jpg,.png,.pdf"
                />
                {errors.registrationBookUrl && <p className="text-xs text-red-500">{errors.registrationBookUrl}</p>}

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

                <FileUpload
                    label="Insurance Certificate (Recommended)"
                    value={data.insuranceCertUrl}
                    onChange={(url: string) => updateData({ insuranceCertUrl: url })}
                    maxSizeMB={10}
                    accept=".jpg,.png,.pdf"
                />

                <div className="pt-2"> {/* Optional VET */}
                    <FileUpload
                        label="Emission Test Certificate (VET) - Optional"
                        value={data.emissionCertUrl}
                        onChange={(url: string) => updateData({ emissionCertUrl: url })}
                        maxSizeMB={10}
                        accept=".jpg,.png,.pdf"
                    />
                </div>
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
