import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Wifi, Car, Utensils } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Hotel } from "@/lib/api"

interface HotelCardProps {
  hotel: Hotel
}

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  WiFi: Wifi,
  Parking: Car,
  Restaurant: Utensils,
}

export function HotelCard({ hotel }: HotelCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="md:flex">
        <div className="relative md:w-80 h-48 md:h-auto overflow-hidden">
          <Image
            src={hotel.imageUrl || "/placeholder.svg"}
            alt={hotel.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <CardContent className="flex-1 p-6">
          <div className="flex flex-col h-full">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-1">{hotel.name}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {hotel.city}, {hotel.country}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">${hotel.pricePerNight}</div>
                <div className="text-sm text-muted-foreground">per night</div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{hotel.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">({hotel.reviewCount} reviews)</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {hotel.amenities.slice(0, 6).map((amenity) => {
                const Icon = amenityIcons[amenity]
                return (
                  <Badge key={amenity} variant="secondary" className="text-xs">
                    {Icon && <Icon className="mr-1 h-3 w-3" />}
                    {amenity}
                  </Badge>
                )
              })}
              {hotel.amenities.length > 6 && (
                <Badge variant="outline" className="text-xs">
                  +{hotel.amenities.length - 6} more
                </Badge>
              )}
            </div>

            <div className="mt-auto flex gap-2">
              <Button asChild className="flex-1">
                <Link href={`/hotels/${hotel.id}`}>View Details</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/hotels/${hotel.id}?book=true`}>Book Now</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
