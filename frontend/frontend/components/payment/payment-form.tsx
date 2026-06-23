"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { apiService, type Booking, type PaymentRequest } from "@/lib/api"
import { CreditCard, Lock, Shield } from "lucide-react"

interface PaymentFormProps {
  booking: Booking
}

export function PaymentForm({ booking }: PaymentFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create payment intent
      const paymentRequest: PaymentRequest = {
        bookingId: booking.id,
        amount: booking.totalPrice * 100, // Convert to cents
        currency: "usd",
      }

      const paymentIntent = await apiService.createPaymentIntent(paymentRequest)

      // In a real implementation, you would use Stripe Elements here
      // For demo purposes, we'll simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Confirm payment
      await apiService.confirmPayment(paymentIntent.paymentIntentId)

      toast({
        title: "Payment successful!",
        description: "Your booking has been confirmed and payment processed.",
      })

      router.push(`/booking/confirmation/${booking.id}`)
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Payment Form */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardholderName">Cardholder Name</Label>
                  <Input
                    id="cardholderName"
                    placeholder="John Doe"
                    value={paymentData.cardholderName}
                    onChange={(e) => setPaymentData({ ...paymentData, cardholderName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={paymentData.cardNumber}
                    onChange={(e) => {
                      // Format card number with spaces
                      const value = e.target.value
                        .replace(/\s/g, "")
                        .replace(/(.{4})/g, "$1 ")
                        .trim()
                      if (value.length <= 19) {
                        setPaymentData({ ...paymentData, cardNumber: value })
                      }
                    }}
                    maxLength={19}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={paymentData.expiryDate}
                      onChange={(e) => {
                        // Format expiry date
                        const value = e.target.value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2")
                        if (value.length <= 5) {
                          setPaymentData({ ...paymentData, expiryDate: value })
                        }
                      }}
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={paymentData.cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "")
                        if (value.length <= 4) {
                          setPaymentData({ ...paymentData, cvv: value })
                        }
                      }}
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Your payment information is secure and encrypted</span>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                <Lock className="mr-2 h-4 w-4" />
                {isLoading ? "Processing Payment..." : `Pay $${booking.totalPrice}`}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="mt-4">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-medium">Secure Payment</h4>
                <p className="text-sm text-muted-foreground">
                  Your payment is protected by 256-bit SSL encryption. We never store your card details.
                </p>
              </div>
            </div>
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
              <h4 className="font-semibold">{booking.hotelName}</h4>
              <p className="text-sm text-muted-foreground">{booking.roomName}</p>
            </div>

            <Separator />

            {/* Stay Details */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Check-in:</span>
                <span>{new Date(booking.checkIn).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Check-out:</span>
                <span>{new Date(booking.checkOut).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Guests:</span>
                <span>{booking.guests}</span>
              </div>
            </div>

            <Separator />

            {/* Price Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${booking.totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Taxes & fees</span>
                <span>$0</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary">${booking.totalPrice}</span>
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
