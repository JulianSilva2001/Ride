"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ImagesStep({ data, updateData, errors }: { data: any, updateData: (d: any) => void, errors: any }) {
    // For MVP we handle a single main image URL string in the form state
    // The server action will handle converting this to the relation
    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-800 mb-1">Photos are crucial!</h3>
                <p className="text-sm text-blue-600">
                    High quality photos increase your earnings. Add a clear photo of the exterior.
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="imageUrl">Main Image URL (HTTPS) <span className="text-red-500">*</span></Label>
                <Input
                    id="imageUrl"
                    value={data.imageUrl || ""}
                    onChange={(e) => updateData({ imageUrl: e.target.value })}
                    placeholder="https://example.com/car.jpg"
                    className={errors.imageUrl ? "border-red-500" : ""}
                />
                {errors.imageUrl && <p className="text-xs text-red-500">{errors.imageUrl}</p>}
                <p className="text-xs text-gray-500">
                    For this MVP version, please host your image elsewhere (e.g. Imgur, Drive link) and paste the direct link here.
                </p>
            </div>

            {data.imageUrl && (
                <div className="mt-4 border rounded-lg overflow-hidden aspect-video bg-gray-100 relative">
                    <img
                        src={data.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                </div>
            )}
        </div>
    )
}
