"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { HotelGallery } from "@/components/hotels/hotel-gallery"
import { ReviewsSection } from "@/components/reviews/reviews-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { apiService, type HotelDetails } from "@/lib/api"
import { Star, MapPin, Clock, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function HotelDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [hotel, setHotel] = useState<HotelDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const hotelId = params.id as string
  const shouldShowBooking = searchParams.get("book") === "true"

  useEffect(() => {
    const fetchHotelDetails = async () => {
      setIsLoading(true)
      try {
        const data = await apiService.getHotelDetails(hotelId)
        setHotel(data)
      } catch (error) {
        console.error("Error fetching hotel details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (hotelId) {
      fetchHotelDetails()
    }
  }, [hotelId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="h-96 bg-muted rounded-lg animate-pulse" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                <div className="h-32 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-64 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <h1 className="text-2xl font-bold text-foreground mb-2">Hotel not found</h1>
              <p className="text-muted-foreground mb-4">The hotel you're looking for doesn't exist.</p>
              <Button asChild>
                <Link href="/hotels">Back to Hotels</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Hotel Gallery */}
        <div className="mb-8">
          <HotelGallery photos={hotel.photos} hotelName={hotel.name} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Hotel Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{hotel.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {hotel.city}, {hotel.country}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{hotel.rating}</span>
                  <span className="text-muted-foreground">({hotel.reviewCount} reviews)</span>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">{hotel.description}</p>
            </div>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {hotel.amenities.map((amenity) => (
                    <Badge key={amenity} variant="secondary">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Available Rooms */}
            <Card>
              <CardHeader>
                <CardTitle>Available Rooms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {hotel.rooms.map((room, index) => (
                  <div key={room.id}>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="md:w-48 h-32 relative rounded-lg overflow-hidden">
                        <img
                          src={room.imageUrl || "/placeholder.svg"}
                          alt={room.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-semibold">{room.name}</h4>
                          <div className="text-right">
                            <div className="text-xl font-bold text-primary">${room.pricePerNight}</div>
                            <div className="text-sm text-muted-foreground">per night</div>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">{room.description}</p>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm text-muted-foreground">Max {room.maxGuests} guests</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {room.amenities.map((amenity) => (
                            <Badge key={amenity} variant="outline" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                        <Button asChild className="w-full md:w-auto">
                          <Link href={`/booking?hotelId=${hotel.id}&roomId=${room.id}`}>Book This Room</Link>
                        </Button>
                      </div>
                    </div>
                    {index < hotel.rooms.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Policies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Hotel Policies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Check-in:</strong> {hotel.policies.checkIn} | <strong>Check-out:</strong>{" "}
                    {hotel.policies.checkOut}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{hotel.policies.cancellation}</p>
              </CardContent>
            </Card>

            <ReviewsSection hotelId={hotel.id} hotelRating={hotel.rating} reviewCount={hotel.reviewCount} />
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-4">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Book Your Stay</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">From ${hotel.pricePerNight}</div>
                  <div className="text-sm text-muted-foreground">per night</div>
                </div>
                <Button asChild className="w-full" size="lg">
                  <Link href={`/booking?hotelId=${hotel.id}`}>Book Now</Link>
                </Button>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Free cancellation available</p>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{hotel.location.address}</p>
                <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Map placeholder</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
