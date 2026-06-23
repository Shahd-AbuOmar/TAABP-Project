"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { PaymentForm } from "@/components/payment/payment-form"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { apiService, type Booking } from "@/lib/api"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const bookingId = params.bookingId as string

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    const fetchBooking = async () => {
      try {
        const bookingData = await apiService.getBookingDetails(bookingId)

        if (bookingData.paymentStatus === "paid") {
          toast({
            title: "Payment already completed",
            description: "This booking has already been paid for.",
          })
          router.push(`/booking/confirmation/${bookingId}`)
          return
        }

        setBooking(bookingData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load booking details.",
          variant: "destructive",
        })
        router.push("/bookings")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooking()
  }, [bookingId, isAuthenticated, router, toast])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Booking not found</h1>
          <Button onClick={() => router.push("/bookings")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bookings
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Complete Your Payment</h1>
        <p className="text-muted-foreground mt-2">Secure payment for your booking at {booking.hotelName}</p>
      </div>

      <PaymentForm booking={booking} />
    </div>
  )
}
