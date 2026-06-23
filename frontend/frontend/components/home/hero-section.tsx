
"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Calendar, MapPin, Users, Search } from "lucide-react"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const [destination, setDestination] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState("2")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const searchParams = new URLSearchParams({ destination, checkIn, checkOut, guests })
    router.push(`/hotels?${searchParams.toString()}`)
  }

  return (
    <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-blue-950 mb-6">Your perfect stay awaits</h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Discover amazing hotels, resorts, and unique accommodations around the world. Book with confidence and create unforgettable memories.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto p-6 shadow-lg bg-white border-blue-100">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="destination" className="flex items-center gap-2 text-slate-700">
                  <MapPin className="h-4 w-4" /> Destination
                </Label>
                <Input
                  id="destination"
                  placeholder="Where are you going?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                  className="border-blue-200 text-slate-800 placeholder:text-slate-400 bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkIn" className="flex items-center gap-2 text-slate-700">
                  <Calendar className="h-4 w-4" /> Check-in
                </Label>
                <Input
                  id="checkIn"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required
                  className="border-blue-200 text-slate-800 bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkOut" className="flex items-center gap-2 text-slate-700">
                  <Calendar className="h-4 w-4" /> Check-out
                </Label>
                <Input
                  id="checkOut"
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required
                  className="border-blue-200 text-slate-800 bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guests" className="flex items-center gap-2 text-slate-700">
                  <Users className="h-4 w-4" /> Guests
                </Label>
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  max="10"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  required
                  className="border-blue-200 text-slate-800 bg-white"
                />
              </div>
            </div>
            <Button type="submit" size="lg" className="w-full md:w-auto px-8 bg-emerald-600 hover:bg-emerald-700 text-white border-none">
              <Search className="mr-2 h-5 w-5" />
              Search Hotels
            </Button>
          </form>
        </Card>
      </div>
    </section>
  )
}