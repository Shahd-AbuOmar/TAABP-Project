"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Filter, X } from "lucide-react"
import type { HotelFilters } from "@/lib/api"

interface HotelFiltersProps {
  filters: HotelFilters
  onFiltersChange: (filters: HotelFilters) => void
  onClearFilters: () => void
}

const amenitiesList = [
  "WiFi",
  "Pool",
  "Spa",
  "Restaurant",
  "Gym",
  "Bar",
  "Beach Access",
  "Business Center",
  "Pet Friendly",
  "Parking",
]

export function HotelFiltersComponent({ filters, onFiltersChange, onClearFilters }: HotelFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [priceRange, setPriceRange] = useState([filters.minPrice || 0, filters.maxPrice || 500])

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value)
    onFiltersChange({
      ...filters,
      minPrice: value[0],
      maxPrice: value[1],
    })
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const currentAmenities = filters.amenities || []
    const newAmenities = checked ? [...currentAmenities, amenity] : currentAmenities.filter((a) => a !== amenity)

    onFiltersChange({
      ...filters,
      amenities: newAmenities,
    })
  }

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-") as [HotelFilters["sortBy"], HotelFilters["sortOrder"]]
    onFiltersChange({
      ...filters,
      sortBy,
      sortOrder,
    })
  }

  return (
    <div className="space-y-4">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="w-full">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Filters Panel */}
      <div className={`space-y-4 ${isOpen ? "block" : "hidden lg:block"}`}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Filters</CardTitle>
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                <X className="mr-1 h-4 w-4" />
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sort By */}
            <div className="space-y-2">
              <Label>Sort by</Label>
              <Select
                value={`${filters.sortBy || "rating"}-${filters.sortOrder || "desc"}`}
                onValueChange={handleSortChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating-desc">Highest Rated</SelectItem>
                  <SelectItem value="rating-asc">Lowest Rated</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="name-asc">Name: A to Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
              <Label>Price per night</Label>
              <div className="px-2">
                <Slider
                  value={priceRange}
                  onValueChange={handlePriceChange}
                  max={500}
                  min={0}
                  step={10}
                  className="w-full"
                />
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>

            {/* Minimum Rating */}
            <div className="space-y-2">
              <Label>Minimum Rating</Label>
              <Select
                value={filters.rating?.toString() || "any"}
                onValueChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    rating: value === "any" ? undefined : Number(value),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any rating</SelectItem>
                  <SelectItem value="4.5">4.5+ stars</SelectItem>
                  <SelectItem value="4">4+ stars</SelectItem>
                  <SelectItem value="3.5">3.5+ stars</SelectItem>
                  <SelectItem value="3">3+ stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amenities */}
            <div className="space-y-3">
              <Label>Amenities</Label>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                {amenitiesList.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={filters.amenities?.includes(amenity) || false}
                      onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                    />
                    <Label htmlFor={amenity} className="text-sm font-normal">
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
