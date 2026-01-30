"use client"

import FileUpload from "@/components/shared/file-upload"
import { Button } from "@/components/ui/button"
import { X, CheckCircle, AlertTriangle, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { loadModel, verifyImage } from "@/lib/image-verification"
import { useToast } from "@/hooks/use-toast"

const REQUIRED_PHOTOS = [
    { label: "FRONT", title: "Front Exterior", description: "Full front view, number plate visible." },
    { label: "REAR", title: "Rear Exterior", description: "Full rear view, number plate visible." },
    { label: "SIDE", title: "Side Exterior", description: "Body condition, scratches." },
    { label: "WHEELS", title: "Wheels / Tyres", description: "Tyre condition & safety." },
    { label: "BOOT", title: "Boot / Trunk", description: "Luggage space visibility." },
    { label: "INTERIOR_FRONT", title: "Interior - Front", description: "Dashboard, steering wheel, front seats." },
    { label: "INTERIOR_REAR", title: "Interior - Rear", description: "Rear seats condition." },
]

export default function PhotosStep({ data, updateData, errors }: { data: any, updateData: (d: any) => void, errors: any }) {
    const images = data.images || []
    const [verifying, setVerifying] = useState<Record<string, boolean>>({})
    const [verificationResults, setVerificationResults] = useState<Record<string, { valid: boolean, probability: number, prediction: string }>>({})
    const { toast } = useToast()

    useEffect(() => {
        // Pre-warm model
        loadModel()
    }, [])

    const getImageUrl = (label: string) => {
        return images.find((img: any) => img.label === label)?.url || ""
    }

    const getDamageImages = () => {
        return images.filter((img: any) => img.label === "DAMAGE")
    }

    const getGalleryImages = () => {
        return images.filter((img: any) => img.label === "GALLERY")
    }

    const runVerification = async (label: string, url: string) => {
        if (!url) return

        setVerifying(prev => ({ ...prev, [label]: true }))

        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = url

        try {
            await new Promise((resolve, reject) => {
                img.onload = resolve
                img.onerror = reject
            })

            const result = await verifyImage(img, label)
            setVerificationResults(prev => ({ ...prev, [label]: result }))

            if (!result.valid && result.probability > 0.0) {
                toast({
                    title: `Photo verification warning for ${label}`,
                    description: `Our AI detected '${result.prediction}' instead of the expected content. Please verify this is correct.`,
                    variant: 'destructive'
                })
            }
        } catch (e) {
            console.error(e)
        } finally {
            setVerifying(prev => ({ ...prev, [label]: false }))
        }
    }

    const handleImageUpdate = (label: string, url: string) => {
        let newImages = [...images]
        if (!url) {
            newImages = newImages.filter((img: any) => img.label !== label)
            // Clear verification
            const newResults = { ...verificationResults }
            delete newResults[label]
            setVerificationResults(newResults)
        } else {
            const index = newImages.findIndex((img: any) => img.label === label)
            if (index >= 0) {
                newImages[index] = { ...newImages[index], url }
            } else {
                newImages.push({ label, url })
            }
            // Trigger verification
            runVerification(label, url)
        }
        updateData({ images: newImages })
    }

    const addDamagePhoto = (url: string) => {
        if (!url) return
        const newImages = [...images, { label: "DAMAGE", url }]
        updateData({ images: newImages })
    }

    const removeDamagePhoto = (urlToRemove: string) => {
        const newImages = images.filter((img: any) => !(img.label === "DAMAGE" && img.url === urlToRemove))
        updateData({ images: newImages })
    }

    const addGalleryPhoto = (url: string) => {
        if (!url) return
        const newImages = [...images, { label: "GALLERY", url }]
        updateData({ images: newImages })
    }

    const removeGalleryPhoto = (urlToRemove: string) => {
        const newImages = images.filter((img: any) => !(img.label === "GALLERY" && img.url === urlToRemove))
        updateData({ images: newImages })
    }

    const VerificationBadge = ({ label }: { label: string }) => {
        if (verifying[label]) {
            return <div className="text-xs text-blue-500 flex items-center mt-1"><Loader2 className="h-3 w-3 animate-spin mr-1" /> Verifying...</div>
        }
        const result = verificationResults[label]
        if (!result) return null

        if (result.valid) {
            return <div className="text-xs text-green-600 flex items-center mt-1"><CheckCircle className="h-3 w-3 mr-1" /> Verified</div>
        }
        return (
            <div className="text-xs text-orange-600 flex items-center mt-1">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Detected: {result.prediction} ({(result.probability * 100).toFixed(0)}%)
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-1">Clear photos help you earn more</h3>
                <p className="text-sm text-blue-600">
                    Proprietary AI will verify your photos automatically. Please ensure good lighting.
                </p>
            </div>

            {errors.images && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                    {errors.images}
                </div>
            )}

            {/* Cover Photo */}
            <div>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    Cover Photo <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">Mandatory</span>
                </h3>
                <div className="max-w-md">
                    <FileUpload
                        label="Main Cover Photo *"
                        value={getImageUrl("COVER")}
                        onChange={(url) => handleImageUpdate("COVER", url)}
                        maxSizeMB={5}
                    />
                    <VerificationBadge label="COVER" />
                </div>
            </div>

            <div className="border-t pt-8">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    Required Photos <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">Mandatory</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {REQUIRED_PHOTOS.map((slot) => (
                        <div key={slot.label}>
                            <FileUpload
                                label={`${slot.title} *`}
                                value={getImageUrl(slot.label)}
                                onChange={(url) => handleImageUpdate(slot.label, url)}
                                maxSizeMB={5}
                            />
                            <VerificationBadge label={slot.label} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t pt-8">
                <h3 className="font-bold text-lg mb-4 text-gray-700">Additional Photos</h3>
                <p className="text-sm text-gray-500 mb-4">Upload any other angles or features (e.g. detailed interior, sunroof, etc).</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {getGalleryImages().map((img: any, idx: number) => (
                        <div key={idx} className="relative aspect-video border rounded-lg overflow-hidden group">
                            <img src={img.url} alt="Gallery" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeGalleryPhoto(img.url)}
                                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                            >
                                <X className="h-4 w-4 text-red-500" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="max-w-xs">
                    <FileUpload
                        label="Add Photo"
                        onChange={addGalleryPhoto}
                        value=""
                        maxSizeMB={5}
                    />
                </div>
            </div>

            <div className="border-t pt-8">
                <h3 className="font-bold text-lg mb-4 text-gray-700">Damage / Scratches</h3>
                <p className="text-sm text-gray-500 mb-4">Upload close-up photos of any existing damage (multiple photos allowed).</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {getDamageImages().map((img: any, idx: number) => (
                        <div key={idx} className="relative aspect-video border rounded-lg overflow-hidden group">
                            <img src={img.url} alt="Damage" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeDamagePhoto(img.url)}
                                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                            >
                                <X className="h-4 w-4 text-red-500" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="max-w-xs">
                    <FileUpload
                        label="Add Damage Photo"
                        onChange={addDamagePhoto}
                        value=""
                        maxSizeMB={5}
                    />
                </div>
            </div>
        </div>
    )
}
