"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { apiService, type Booking } from "@/lib/api"
import { Calendar, MapPin, Users, CreditCard, X, Eye } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function BookingsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    const fetchBookings = async () => {
      setIsLoading(true)
      try {
        const data = await apiService.getUserBookings()
        setBookings(data)
      } catch (error) {
        console.error("Error fetching bookings:", error)
        toast({
          title: "Error",
          description: "Failed to load your bookings. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchBookings()
    }
  }, [isAuthenticated, authLoading, router, toast])

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await apiService.cancelBooking(bookingId)
      setBookings(bookings.map((booking) => (booking.id === bookingId ? { ...booking, status: "cancelled" } : booking)))
      toast({
        title: "Booking cancelled",
        description: "Your booking has been successfully cancelled.",
      })
    } catch (error) {
      toast({
        title: "Cancellation failed",
        description: "Failed to cancel your booking. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="h-8 bg-muted rounded animate-pulse" />
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-6 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                    <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Bookings</h1>
          <p className="text-muted-foreground">Manage your current and past reservations</p>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">No bookings found</h3>
              <p className="text-muted-foreground mb-4">You haven't made any bookings yet. Start exploring!</p>
              <Button asChild>
                <Link href="/hotels">Browse Hotels</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const checkInDate = new Date(booking.checkIn)
              const checkOutDate = new Date(booking.checkOut)
              const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
              const isUpcoming = checkInDate > new Date()
              const canCancel = isUpcoming && booking.status !== "cancelled"

              return (
                <Card key={booking.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{booking.hotelName}</CardTitle>
                        <p className="text-sm text-muted-foreground">{booking.roomName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            booking.status === "confirmed"
                              ? "default"
                              : booking.status === "cancelled"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {booking.status}
                        </Badge>
                        <Badge variant={booking.paymentStatus === "paid" ? "default" : "destructive"}>
                          {booking.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Booking Reference */}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Booking Reference:</span>
                      <span className="font-mono">{booking.id}</span>
                    </div>

                    <Separator />

                    {/* Stay Details */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Check-in</p>
                          <p className="text-muted-foreground">{checkInDate.toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Check-out</p>
                          <p className="text-muted-foreground">{checkOutDate.toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Guests</p>
                          <p className="text-muted-foreground">{booking.guests}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Total</p>
                          <p className="text-primary font-semibold">${booking.totalPrice}</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 justify-between">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/booking/confirmation/${booking.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/hotels/${booking.hotelId}`}>
                            <MapPin className="mr-2 h-4 w-4" />
                            View Hotel
                          </Link>
                        </Button>
                      </div>
                      {canCancel && (
                        <Button variant="destructive" size="sm" onClick={() => handleCancelBooking(booking.id)}>
                          <X className="mr-2 h-4 w-4" />
                          Cancel Booking
                        </Button>
                      )}
                    </div>

                    {/* Status Messages */}
                    {booking.status === "cancelled" && (
                      <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <p className="text-sm text-destructive">This booking has been cancelled.</p>
                      </div>
                    )}
                    {isUpcoming && booking.status === "confirmed" && (
                      <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                        <p className="text-sm text-primary">
                          Your booking is confirmed! Check-in is in{" "}
                          {Math.ceil((checkInDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
