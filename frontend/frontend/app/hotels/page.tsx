"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { HotelCard } from "@/components/hotels/hotel-card"
import { HotelFiltersComponent } from "@/components/hotels/hotel-filters"
import { apiService, type Hotel, type SearchParams, type HotelFilters } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, Users } from "lucide-react"

function HotelsContent() {
  const searchParams = useSearchParams()
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<HotelFilters>({
    sortBy: "rating",
    sortOrder: "desc",
  })

  const searchQuery: SearchParams = {
    destination: searchParams.get("destination") || "",
    checkIn: searchParams.get("checkIn") || "",
    checkOut: searchParams.get("checkOut") || "",
    guests: Number(searchParams.get("guests")) || 2,
  }

  useEffect(() => {
    const fetchHotels = async () => {
      setIsLoading(true)
      try {
        const data = await apiService.getHotels(searchQuery, filters)
        setHotels(data)
      } catch (error) {
        console.error("Error fetching hotels:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHotels()
  }, [filters]) // Updated dependency array

  const handleFiltersChange = (newFilters: HotelFilters) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({
      sortBy: "rating",
      sortOrder: "desc",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Summary */}
        {searchQuery.destination && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{searchQuery.destination}</span>
                </div>
                {searchQuery.checkIn && searchQuery.checkOut && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {new Date(searchQuery.checkIn).toLocaleDateString()} -{" "}
                      {new Date(searchQuery.checkOut).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{searchQuery.guests} guests</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <HotelFiltersComponent
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Hotels List */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {searchQuery.destination ? `Hotels in ${searchQuery.destination}` : "All Hotels"}
              </h1>
              <p className="text-muted-foreground">{isLoading ? "Searching..." : `${hotels.length} hotels found`}</p>
            </div>

            {isLoading ? (
              <div className="space-y-6">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-80 h-48 bg-muted animate-pulse" />
                      <CardContent className="flex-1 p-6">
                        <div className="space-y-3">
                          <div className="h-6 bg-muted rounded animate-pulse" />
                          <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                          <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                          <div className="flex gap-2">
                            <div className="h-6 bg-muted rounded animate-pulse w-16" />
                            <div className="h-6 bg-muted rounded animate-pulse w-16" />
                            <div className="h-6 bg-muted rounded animate-pulse w-16" />
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            ) : hotels.length > 0 ? (
              <div className="space-y-6">
                {hotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-2">No hotels found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or filters to find more options.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function HotelsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HotelsContent />
    </Suspense>
  )
}
