"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { apiService, type Review } from "@/lib/api"
import { Star, ThumbsUp } from "lucide-react"

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  const { toast } = useToast()
  const [helpfulCount, setHelpfulCount] = useState(review.helpful)
  const [hasMarkedHelpful, setHasMarkedHelpful] = useState(false)

  const handleMarkHelpful = async () => {
    if (hasMarkedHelpful) return

    try {
      await apiService.markReviewHelpful(review.id)
      setHelpfulCount((prev) => prev + 1)
      setHasMarkedHelpful(true)
      toast({
        title: "Thank you!",
        description: "Your feedback has been recorded.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark review as helpful.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={review.userAvatar || "/placeholder.svg"} alt={review.userName} />
            <AvatarFallback>{getInitials(review.userName)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">{review.userName}</h4>
                <p className="text-sm text-muted-foreground">{formatDate(review.createdAt)}</p>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
                <Badge variant="secondary" className="ml-2">
                  {review.rating}/5
                </Badge>
              </div>
            </div>

            <div>
              <h5 className="font-medium mb-2">{review.title}</h5>
              <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkHelpful}
                disabled={hasMarkedHelpful}
                className="text-muted-foreground hover:text-foreground"
              >
                <ThumbsUp className={`h-4 w-4 mr-1 ${hasMarkedHelpful ? "fill-current" : ""}`} />
                Helpful ({helpfulCount})
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
