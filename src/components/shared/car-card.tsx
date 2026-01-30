import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Image as CarImage } from "@prisma/client"
import Link from "next/link"
import PriceDisplay from "@/components/shared/price-display"

interface CarCardProps {
    car: Car & { images: CarImage[] }
}

export default function CarCard({ car }: CarCardProps) {
    return (
        <Link href={`/car/${car.id}`} className="block">
            <Card className="overflow-hidden hover:shadow-lg transition cursor-pointer group h-full">
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                    {(car.images.find(img => img.label === 'COVER')?.url || car.images[0]?.url) ? (
                        <img
                            src={car.images.find(img => img.label === 'COVER')?.url || car.images[0]?.url}
                            alt={car.make}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                </div>
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg">{car.year} {car.make} {car.model}</CardTitle>
                    <p className="text-sm text-gray-500">{car.location}</p>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <div className="flex justify-between items-end mt-2">
                        <span className="font-bold text-lg"><PriceDisplay amount={car.pricePerDay} /><span className="text-sm font-normal text-gray-500">/day</span></span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
