"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { apiService, type Booking } from "@/lib/api"
import { CheckCircle, Calendar, Users, MapPin, CreditCard, Download, Share } from "lucide-react"
import Link from "next/link"

export default function BookingConfirmationPage() {
  const params = useParams()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const bookingId = params.id as string

  useEffect(() => {
    const fetchBookingDetails = async () => {
      setIsLoading(true)
      try {
        const data = await apiService.getBookingDetails(bookingId)
        setBooking(data)
      } catch (error) {
        console.error("Error fetching booking details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (bookingId) {
      fetchBookingDetails()
    }
  }, [bookingId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="h-8 bg-muted rounded animate-pulse" />
            <div className="h-64 bg-muted rounded animate-pulse" />
          </div>
        </main>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <h1 className="text-2xl font-bold text-foreground mb-2">Booking not found</h1>
              <p className="text-muted-foreground mb-4">The booking you're looking for doesn't exist.</p>
              <Button asChild>
                <Link href="/bookings">View My Bookings</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const checkInDate = new Date(booking.checkIn)
  const checkOutDate = new Date(booking.checkOut)
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground">
            Your reservation has been successfully created. We've sent a confirmation email to your registered email
            address.
          </p>
        </div>

        {/* Booking Details */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Booking Details</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>{booking.status}</Badge>
              <Badge variant={booking.paymentStatus === "paid" ? "default" : "destructive"}>
                {booking.paymentStatus}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Booking ID */}
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Booking Reference</p>
                <p className="font-mono font-semibold">{booking.id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Booking Date</p>
                <p className="font-semibold">{new Date(booking.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Hotel Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Hotel Information
              </h3>
              <div className="space-y-2">
                <p className="font-semibold">{booking.hotelName}</p>
                <p className="text-sm text-muted-foreground">{booking.roomName}</p>
              </div>
            </div>

            <Separator />

            {/* Stay Details */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Stay Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Check-in</p>
                  <p className="font-semibold">{checkInDate.toLocaleDateString()}</p>
                  <p className="text-xs text-muted-foreground">After 3:00 PM</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Check-out</p>
                  <p className="font-semibold">{checkOutDate.toLocaleDateString()}</p>
                  <p className="text-xs text-muted-foreground">Before 11:00 AM</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-semibold">{nights} nights</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Guest Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Guest Information
              </h3>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Number of guests:</span>
                <span className="font-semibold">{booking.guests}</span>
              </div>
            </div>

            <Separator />

            {/* Payment Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Amount:</span>
                  <span className="font-semibold text-primary">${booking.totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Payment Status:</span>
                  <Badge variant={booking.paymentStatus === "paid" ? "default" : "destructive"}>
                    {booking.paymentStatus}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Download Confirmation
          </Button>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Share className="h-4 w-4" />
            Share Booking
          </Button>
          <Button asChild>
            <Link href="/bookings">View All Bookings</Link>
          </Button>
        </div>

        {/* Important Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Important Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <h4 className="font-semibold mb-1">Cancellation Policy</h4>
              <p className="text-muted-foreground">
                Free cancellation until 24 hours before check-in. After that, the first night will be charged.
              </p>
            </div>
            <div className="text-sm">
              <h4 className="font-semibold mb-1">Check-in Requirements</h4>
              <p className="text-muted-foreground">
                Please bring a valid ID and the credit card used for booking. Early check-in may be available upon
                request.
              </p>
            </div>
            <div className="text-sm">
              <h4 className="font-semibold mb-1">Contact Information</h4>
              <p className="text-muted-foreground">
                For any questions or changes to your booking, please contact our customer service at
                support@travelbook.com or call +1 (555) 123-4567.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
