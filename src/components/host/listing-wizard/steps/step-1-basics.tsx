"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function VehicleBasics({ data, updateData, errors }: { data: any, updateData: (d: any) => void, errors: any }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="make">Make <span className="text-red-500">*</span></Label>
                    <Input
                        id="make"
                        value={data.make || ""}
                        onChange={(e) => updateData({ make: e.target.value })}
                        placeholder="e.g. Toyota"
                        className={errors.make ? "border-red-500" : ""}
                    />
                    {errors.make && <p className="text-xs text-red-500">{errors.make}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="model">Model <span className="text-red-500">*</span></Label>
                    <Input
                        id="model"
                        value={data.model || ""}
                        onChange={(e) => updateData({ model: e.target.value })}
                        placeholder="e.g. Camry"
                        className={errors.model ? "border-red-500" : ""}
                    />
                    {errors.model && <p className="text-xs text-red-500">{errors.model}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="year">Year <span className="text-red-500">*</span></Label>
                    <Select
                        value={data.year?.toString()}
                        onValueChange={(val) => updateData({ year: parseInt(val) })}
                    >
                        <SelectTrigger className={errors.year ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() + 1 - i).map(year => (
                                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.year && <p className="text-xs text-red-500">{errors.year}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="category">Vehicle Type <span className="text-red-500">*</span></Label>
                    <Select
                        value={data.category}
                        onValueChange={(val) => updateData({ category: val })}
                    >
                        <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Sedan">Sedan</SelectItem>
                            <SelectItem value="SUV">SUV</SelectItem>
                            <SelectItem value="Hatchback">Hatchback</SelectItem>
                            <SelectItem value="Van">Van</SelectItem>
                            <SelectItem value="Pickup">Pickup</SelectItem>
                            <SelectItem value="Luxury">Luxury</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="transmission">Transmission <span className="text-red-500">*</span></Label>
                    <Select
                        value={data.transmission}
                        onValueChange={(val) => updateData({ transmission: val })}
                    >
                        <SelectTrigger className={errors.transmission ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Automatic">Automatic</SelectItem>
                            <SelectItem value="Manual">Manual</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.transmission && <p className="text-xs text-red-500">{errors.transmission}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="fuelType">Fuel Type <span className="text-red-500">*</span></Label>
                    <Select
                        value={data.fuelType}
                        onValueChange={(val) => updateData({ fuelType: val })}
                    >
                        <SelectTrigger className={errors.fuelType ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select Fuel Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Petrol">Petrol</SelectItem>
                            <SelectItem value="Diesel">Diesel</SelectItem>
                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                            <SelectItem value="Electric">Electric</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.fuelType && <p className="text-xs text-red-500">{errors.fuelType}</p>}
                </div>
            </div>
        </div>
    )
}
