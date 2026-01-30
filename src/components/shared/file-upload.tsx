"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Upload, X, Check } from "lucide-react"

interface FileUploadProps {
    value?: string
    onChange: (url: string) => void
    label: string
    accept?: string
    maxSizeMB?: number
    className?: string
}

export default function FileUpload({ value, onChange, label, accept = "image/*", maxSizeMB = 5, className }: FileUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validation
        if (file.size > maxSizeMB * 1024 * 1024) {
            setError(`File size exceeds ${maxSizeMB}MB`)
            return
        }

        setError(null)
        setUploading(true)

        try {
            const formData = new FormData()
            formData.append("file", file)

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error || "Upload failed")

            onChange(data.url)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setUploading(false)
        }
    }

    const handleRemove = () => {
        onChange("")
        setError(null)
    }

    return (
        <div className={`space-y-2 ${className}`}>
            <div className="font-medium text-sm text-gray-700 mb-1">{label}</div>

            {value ? (
                <div className="relative border rounded-lg overflow-hidden group">
                    {/* Preview based on type */}
                    {value.match(/\.(jpg|jpeg|png|webp)$/i) ? (
                        <div className="aspect-video bg-gray-100 relative">
                            <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
                            <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-xs p-1 px-2 truncate">
                                {value.split('/').pop()}
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 bg-gray-50 flex items-center justify-between">
                            <span className="text-sm truncate max-w-[200px]">{value.split('/').pop()}</span>
                            <Check className="h-4 w-4 text-green-500" />
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                    >
                        <X className="h-4 w-4 text-red-500" />
                    </button>
                    {!value.match(/\.(jpg|jpeg|png|webp)$/i) && (
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="ml-2 text-red-500 text-xs hover:underline"
                        >
                            Remove
                        </button>
                    )}
                </div>
            ) : (
                <div className="relative">
                    <input
                        type="file"
                        accept={accept}
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        id={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
                    />
                    <div className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors ${error ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-primary hover:bg-gray-50"}`}>
                        {uploading ? (
                            <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
                        ) : (
                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        )}
                        <span className="text-sm font-medium text-gray-700">
                            {uploading ? "Uploading..." : error ? <span className="text-red-500">{error}</span> : "Click to upload"}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                            Max {maxSizeMB}MB
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}
