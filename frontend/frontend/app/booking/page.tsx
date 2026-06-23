 "use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { BookingForm } from "@/components/booking/booking-form"
import { apiService, type HotelDetails } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function BookingContent() {
  const searchParams = useSearchParams()
  const [hotel, setHotel] = useState<HotelDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const hotelId = searchParams.get("hotelId")
  const roomId = searchParams.get("roomId")
  const checkIn = searchParams.get("checkIn") || ""
  const checkOut = searchParams.get("checkOut") || ""
  const guests = Number(searchParams.get("guests")) || 2

  useEffect(() => {
    const fetchHotelDetails = async () => {
      if (!hotelId) return

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

    fetchHotelDetails()
  }, [hotelId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="h-8 bg-muted rounded animate-pulse" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-96 bg-muted rounded animate-pulse" />
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
              <p className="text-muted-foreground mb-4">The hotel you're trying to book doesn't exist.</p>
              <Button asChild>
                <Link href="/hotels">Back to Hotels</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const selectedRoom = roomId ? hotel.rooms.find((room) => room.id === roomId) : undefined

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Booking</h1>
          <p className="text-muted-foreground">Review your details and confirm your reservation</p>
        </div>

        <BookingForm
          hotel={hotel}
          selectedRoom={selectedRoom}
          initialData={{
            checkIn,
            checkOut,
            guests,
          }}
        />
      </main>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingContent />
    </Suspense>
  )
}
