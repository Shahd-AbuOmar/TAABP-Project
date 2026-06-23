"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { apiService, type Deal } from "@/lib/api"
import { Star, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function FeaturedDeals() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const data = await apiService.getFeaturedDeals()
        setDeals(data)
      } catch (error) {
        console.error("Error fetching deals:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDeals()
  }, [])

  if (isLoading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Deals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-muted animate-pulse" />
                <CardContent className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                  <div className="h-6 bg-muted rounded animate-pulse w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Featured Deals</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't miss out on these amazing offers from top-rated hotels
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <Card key={deal.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={deal.imageUrl || "/placeholder.svg"}
                  alt={deal.hotelName}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">{deal.discount}% OFF</Badge>
              </div>

              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4" />
                  {deal.cityName}
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2">{deal.hotelName}</h3>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{deal.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">({deal.reviewCount} reviews)</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">${deal.discountedPrice}</span>
                    <span className="text-sm text-muted-foreground line-through">${deal.originalPrice}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">per night</span>
                </div>

                <Button asChild className="w-full">
                  <Link href={`/hotels/${deal.id}`}>View Deal</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
