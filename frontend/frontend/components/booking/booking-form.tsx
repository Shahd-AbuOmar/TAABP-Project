"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { apiService, type BookingRequest, type HotelDetails, type Room } from "@/lib/api"
import { Calendar, Users, CreditCard } from "lucide-react"

interface BookingFormProps {
  hotel: HotelDetails
  selectedRoom?: Room
  initialData?: {
    checkIn: string
    checkOut: string
    guests: number
  }
}

export function BookingForm({ hotel, selectedRoom, initialData }: BookingFormProps) {
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [formData, setFormData] = useState({
    checkIn: initialData?.checkIn || "",
    checkOut: initialData?.checkOut || "",
    guests: initialData?.guests || 2,
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "",
    specialRequests: "",
  })

  const [isLoading, setIsLoading] = useState(false)

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0
    const checkIn = new Date(formData.checkIn)
    const checkOut = new Date(formData.checkOut)
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const calculateTotal = () => {
    const nights = calculateNights()
    const roomPrice = selectedRoom?.pricePerNight || hotel.pricePerNight
    return nights * roomPrice
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to make a booking.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    setIsLoading(true)

    try {
      const bookingData: BookingRequest = {
        hotelId: hotel.id,
        roomId: selectedRoom?.id,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: formData.guests,
        guestInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          specialRequests: formData.specialRequests,
        },
      }

      const booking = await apiService.createBooking(bookingData)

      toast({
        title: "Booking created!",
        description: "Redirecting to payment...",
      })

      router.push(`/payment/${booking.id}`)
    } catch (error) {
      toast({
        title: "Booking failed",
        description: "There was an error creating your booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const nights = calculateNights()
  const total = calculateTotal()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Booking Form */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Stay Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Stay Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkIn">Check-in</Label>
                    <Input
                      id="checkIn"
                      type="date"
                      value={formData.checkIn}
                      onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkOut">Check-out</Label>
                    <Input
                      id="checkOut"
                      type="date"
                      value={formData.checkOut}
                      onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guests">Guests</Label>
                    <Input
                      id="guests"
                      type="number"
                      min="1"
                      max={selectedRoom?.maxGuests || 10}
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Guest Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Guest Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                  <Textarea
                    id="specialRequests"
                    placeholder="Any special requests or preferences..."
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                <CreditCard className="mr-2 h-5 w-5" />
                {isLoading ? "Processing..." : "Proceed to Payment"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Booking Summary */}
      <div className="space-y-4">
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Hotel Info */}
            <div>
              <h4 className="font-semibold">{hotel.name}</h4>
              <p className="text-sm text-muted-foreground">
                {hotel.city}, {hotel.country}
              </p>
            </div>

            <Separator />

            {/* Room Info */}
            {selectedRoom && (
              <>
                <div>
                  <h4 className="font-semibold">{selectedRoom.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedRoom.description}</p>
                </div>
                <Separator />
              </>
            )}

            {/* Stay Details */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Check-in:</span>
                <span>{formData.checkIn ? new Date(formData.checkIn).toLocaleDateString() : "Select date"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Check-out:</span>
                <span>{formData.checkOut ? new Date(formData.checkOut).toLocaleDateString() : "Select date"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Guests:</span>
                <span>{formData.guests}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Nights:</span>
                <span>{nights}</span>
              </div>
            </div>

            <Separator />

            {/* Price Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  ${selectedRoom?.pricePerNight || hotel.pricePerNight} × {nights} nights
                </span>
                <span>${total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Taxes & fees</span>
                <span>$0</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-primary">${total}</span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              <p>Free cancellation until 24 hours before check-in</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
