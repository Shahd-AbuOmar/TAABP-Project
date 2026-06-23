"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Grid3X3 } from "lucide-react"

interface HotelGalleryProps {
  photos: string[]
  hotelName: string
}

export function HotelGallery({ photos, hotelName }: HotelGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  return (
    <div className="grid grid-cols-4 gap-2 h-96">
      {/* Main Image */}
      <div className="col-span-2 row-span-2 relative overflow-hidden rounded-lg">
        <Image src={photos[0] || "/placeholder.svg"} alt={`${hotelName} - Main`} fill className="object-cover" />
      </div>

      {/* Secondary Images */}
      {photos.slice(1, 5).map((photo, index) => (
        <div key={index} className="relative overflow-hidden rounded-lg">
          <Image src={photo || "/placeholder.svg"} alt={`${hotelName} - ${index + 2}`} fill className="object-cover" />
        </div>
      ))}

      {/* View All Photos Button */}
      {photos.length > 5 && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="absolute bottom-4 right-4 bg-background/80 backdrop-blur">
              <Grid3X3 className="mr-2 h-4 w-4" />
              View all {photos.length} photos
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
            <div className="relative">
              <Image
                src={photos[currentIndex] || "/placeholder.svg"}
                alt={`${hotelName} - ${currentIndex + 1}`}
                width={800}
                height={600}
                className="w-full h-auto"
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur rounded-full px-3 py-1 text-sm">
                {currentIndex + 1} / {photos.length}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
