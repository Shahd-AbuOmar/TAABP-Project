"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { apiService, type City } from "@/lib/api"
import Link from "next/link"
import Image from "next/image"
import { AlertCircle } from "lucide-react"

export function TrendingCities() {
  const [cities, setCities] = useState<City[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setError(null)
        const data = await apiService.getTrendingCities()
        setCities(data)
      } catch (error) {
        setError("Unable to load trending destinations. Showing sample destinations.")
        // Still set mock data so the component shows something
        setCities([
          {
            id: "1",
            name: "Paris",
            country: "France",
            imageUrl: "/images/france.png",
            description: "The City of Light",
          },
          {
            id: "2",
            name: "Tokyo",
            country: "Japan",
            imageUrl: "/tokyo-skyline-with-modern-buildings.jpg",
            description: "Modern meets traditional",
          },
          {
            id: "3",
            name: "New York",
            country: "USA",
            imageUrl: "/new-york-city-manhattan-skyline.jpg",
            description: "The Big Apple",
          },
          {
            id: "4",
            name: "London",
            country: "UK",
            imageUrl: "/london-big-ben-and-thames-river.jpg",
            description: "Historic charm",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCities()
  }, [])

  if (isLoading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Trending Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-muted animate-pulse" />
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Trending Destinations</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore the most popular destinations chosen by travelers worldwide
          </p>
        </div>

        {error && (
          <Alert className="mb-8 max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error} Please check your network connection or try again later.</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cities.map((city) => (
            <Link key={city.id} href={`/hotels?destination=${encodeURIComponent(city.name)}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={city.imageUrl || "/placeholder.svg"}
                    alt={`${city.name}, ${city.country}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{city.name}</h3>
                    <p className="text-sm opacity-90">{city.country}</p>
                  </div>
                </div>
                {city.description && (
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">{city.description}</p>
                  </CardContent>
                )}
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
