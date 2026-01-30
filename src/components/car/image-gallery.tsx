"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface ImageGalleryProps {
    images: {
        id: string
        url: string
        label?: string
    }[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
    // Filter out internal/private images
    // Show COVER, FRONT, REAR, SIDE, WHEELS, INTERIOR_*, BOOT, GALLERY
    // Exclude GPS, DAMAGE (unless we decide otherwise)
    const displayImages = images.filter(img =>
        !['GPS', 'DAMAGE'].includes(img.label || '')
    ).sort((a, b) => {
        // Sort COVER first
        if (a.label === 'COVER') return -1
        if (b.label === 'COVER') return 1
        return 0
    })

    const [selectedImage, setSelectedImage] = useState(displayImages[0]?.url)

    if (displayImages.length === 0) {
        return (
            <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                No Images Available
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden relative border shadow-sm">
                <img
                    src={selectedImage || displayImages[0].url}
                    alt="Vehicle"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {displayImages.map((img, idx) => (
                    <div
                        key={img.id || idx}
                        className={cn(
                            "aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all hover:opacity-100",
                            selectedImage === img.url ? "border-primary opacity-100" : "border-transparent opacity-70 hover:border-gray-300"
                        )}
                        onClick={() => setSelectedImage(img.url)}
                    >
                        <img
                            src={img.url}
                            alt={img.label || "Vehicle photo"}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ImageGallery
