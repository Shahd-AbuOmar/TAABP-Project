"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ReviewCard } from "./review-card"
import { AddReviewForm } from "./add-review-form"
import { apiService, type Review } from "@/lib/api"
import { Star, MessageSquare, ChevronDown, ChevronUp } from "lucide-react"

interface ReviewsSectionProps {
  hotelId: string
  hotelRating: number
  reviewCount: number
}

export function ReviewsSection({ hotelId, hotelRating, reviewCount }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddReview, setShowAddReview] = useState(false)
  const [showAllReviews, setShowAllReviews] = useState(false)

  const fetchReviews = async () => {
    setIsLoading(true)
    try {
      const data = await apiService.getHotelReviews(hotelId)
      setReviews(data)
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [hotelId])

  const handleReviewAdded = () => {
    fetchReviews()
    setShowAddReview(false)
  }

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach((review) => {
      distribution[review.rating as keyof typeof distribution]++
    })
    return distribution
  }

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3)
  const ratingDistribution = getRatingDistribution()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Reviews Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Guest Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{hotelRating}</div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(hotelRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-muted-foreground">Based on {reviewCount} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm w-8">{rating}★</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all duration-300"
                      style={{
                        width: `${reviews.length > 0 ? (ratingDistribution[rating as keyof typeof ratingDistribution] / reviews.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">
                    {ratingDistribution[rating as keyof typeof ratingDistribution]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          <div className="flex gap-4">
            <Button onClick={() => setShowAddReview(!showAddReview)} variant={showAddReview ? "secondary" : "default"}>
              {showAddReview ? "Cancel" : "Write a Review"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Review Form */}
      {showAddReview && <AddReviewForm hotelId={hotelId} onReviewAdded={handleReviewAdded} />}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Recent Reviews</h3>

          <div className="space-y-4">
            {displayedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {reviews.length > 3 && (
            <div className="text-center">
              <Button variant="outline" onClick={() => setShowAllReviews(!showAllReviews)}>
                {showAllReviews ? (
                  <>
                    <ChevronUp className="mr-2 h-4 w-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-2 h-4 w-4" />
                    Show All {reviews.length} Reviews
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}

      {reviews.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to share your experience at this hotel.</p>
            <Button onClick={() => setShowAddReview(true)}>Write the First Review</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
