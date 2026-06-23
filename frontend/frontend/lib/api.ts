import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7159"

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

apiClient.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  },
)

export interface City {
  id: string
  name: string
  country: string
  imageUrl: string
  description?: string
}

export interface Deal {
  id: string
  hotelName: string
  cityName: string
  originalPrice: number
  discountedPrice: number
  discount: number
  imageUrl: string
  rating: number
  reviewCount: number
}

export interface Hotel {
  id: string
  name: string
  city: string
  country: string
  rating: number
  reviewCount: number
  pricePerNight: number
  imageUrl: string
  amenities: string[]
}

export interface HotelDetails extends Hotel {
  description: string
  photos: string[]
  rooms: Room[]
  location: {
    address: string
    latitude: number
    longitude: number
  }
  policies: {
    checkIn: string
    checkOut: string
    cancellation: string
  }
}

export interface Room {
  id: string
  name: string
  description: string
  pricePerNight: number
  maxGuests: number
  amenities: string[]
  imageUrl: string
  available: boolean
}

export interface HotelFilters {
  minPrice?: number
  maxPrice?: number
  rating?: number
  amenities?: string[]
  sortBy?: "price" | "rating" | "name"
  sortOrder?: "asc" | "desc"
}

export interface SearchParams {
  destination?: string
  checkIn?: string
  checkOut?: string
  guests?: number
  minPrice?: number
  maxPrice?: number
}

export interface Booking {
  id: string
  hotelId: string
  hotelName: string
  roomId: string
  roomName: string
  userId: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  status: "pending" | "confirmed" | "cancelled"
  createdAt: string
  paymentStatus: "pending" | "paid" | "failed"
}

export interface BookingRequest {
  hotelId: string
  roomId?: string
  checkIn: string
  checkOut: string
  guests: number
  guestInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    specialRequests?: string
  }
}

export interface PaymentIntent {
  clientSecret: string
  paymentIntentId: string
}

export interface PaymentRequest {
  bookingId: string
  amount: number
  currency?: string
}

export interface Review {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  hotelId: string
  rating: number
  title: string
  comment: string
  createdAt: string
  helpful: number
}

export interface ReviewRequest {
  rating: number
  title: string
  comment: string
}

class ApiService {
  async getTrendingCities(): Promise<City[]> {
    try {
      const response = await apiClient.get(`/api/home/trending-cities`)
      return response.data
    } catch (error) {
      return [
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
      ]
    }
  }

  async getFeaturedDeals(): Promise<Deal[]> {
    try {
      const response = await apiClient.get(`/api/home/featured-deals`)
      return response.data
    } catch (error) {
      return [
        {
          id: "1",
          hotelName: "Grand Palace Hotel",
          cityName: "Paris",
          originalPrice: 250,
          discountedPrice: 180,
          discount: 28,
          imageUrl: "/luxury-hotel-room-with-elegant-decor.jpg",
          rating: 4.8,
          reviewCount: 324,
        },
        {
          id: "2",
          hotelName: "Sakura Boutique",
          cityName: "Tokyo",
          originalPrice: 180,
          discountedPrice: 135,
          discount: 25,
          imageUrl: "/modern-japanese-hotel-room-with-city-view.jpg",
          rating: 4.6,
          reviewCount: 198,
        },
        {
          id: "3",
          hotelName: "Manhattan Suites",
          cityName: "New York",
          originalPrice: 320,
          discountedPrice: 240,
          discount: 25,
          imageUrl: "/modern-hotel-suite-with-city-skyline-view.jpg",
          rating: 4.7,
          reviewCount: 456,
        },
      ]
    }
  }

  async searchHotels(params: SearchParams): Promise<Hotel[]> {
    try {
      const response = await apiClient.get(`/api/home/search-hotels`, { params })
      return response.data
    } catch (error) {
      console.error("Error searching hotels:", error)
      return [
        {
          id: "1",
          name: "Luxury Resort & Spa",
          city: params.destination || "Paris",
          country: "France",
          rating: 4.8,
          reviewCount: 234,
          pricePerNight: 180,
          imageUrl: "/luxury-hotel-exterior-pool.png",
          amenities: ["Pool", "Spa", "WiFi", "Restaurant"],
        },
        {
          id: "2",
          name: "Boutique City Hotel",
          city: params.destination || "Paris",
          country: "France",
          rating: 4.5,
          reviewCount: 156,
          pricePerNight: 120,
          imageUrl: "/boutique-hotel-lobby-with-modern-design.jpg",
          amenities: ["WiFi", "Restaurant", "Gym", "Bar"],
        },
      ]
    }
  }

  async getHotels(searchParams?: SearchParams, filters?: HotelFilters): Promise<Hotel[]> {
    try {
      const params = { ...searchParams, ...filters }
      const response = await apiClient.get(`/api/hotels`, { params })
      if (response.data && response.data.length > 0) {
       return response.data;
    }
    throw new Error("No hotels found from backend, loading fallback data.");

    } catch (error) {
      console.error("Error fetching hotels:", error)
      return [
        {
          id: "1",
          name: "Grand Palace Hotel",
          city: searchParams?.destination || "Paris",
          country: "France",
          rating: 4.8,
          reviewCount: 324,
          pricePerNight: 180,
          imageUrl: "/luxury-hotel-exterior-pool.png",
          amenities: ["Pool", "Spa", "WiFi", "Restaurant", "Gym", "Bar"],
        },
        {
          id: "2",
          name: "Boutique City Hotel",
          city: searchParams?.destination || "Paris",
          country: "France",
          rating: 4.5,
          reviewCount: 156,
          pricePerNight: 120,
          imageUrl: "/boutique-hotel-lobby-with-modern-design.jpg",
          amenities: ["WiFi", "Restaurant", "Gym", "Bar"],
        },
        {
          id: "3",
          name: "Luxury Resort & Spa",
          city: searchParams?.destination || "Paris",
          country: "France",
          rating: 4.9,
          reviewCount: 567,
          pricePerNight: 250,
          imageUrl: "/luxury-hotel-room-with-elegant-decor.jpg",
          amenities: ["Pool", "Spa", "WiFi", "Restaurant", "Gym", "Bar", "Beach Access"],
        },
        {
          id: "4",
          name: "Modern Business Hotel",
          city: searchParams?.destination || "Paris",
          country: "France",
          rating: 4.3,
          reviewCount: 89,
          pricePerNight: 95,
          imageUrl: "/modern-hotel-suite-with-city-skyline-view.jpg",
          amenities: ["WiFi", "Business Center", "Gym"],
        },
      ]
    }
  }

  async getHotelDetails(hotelId: string): Promise<HotelDetails> {
    try {
      const response = await apiClient.get(`/api/hotels/${hotelId}`)
      return response.data
    } catch (error) {
      console.error("Error fetching hotel details:", error)
      return {
        id: hotelId,
        name: "Grand Palace Hotel",
        city: "Paris",
        country: "France",
        rating: 4.8,
        reviewCount: 324,
        pricePerNight: 180,
        imageUrl: "/luxury-hotel-exterior-pool.png",
        amenities: ["Pool", "Spa", "WiFi", "Restaurant", "Gym", "Bar"],
        description:
          "Experience luxury at its finest in our grand palace hotel. Located in the heart of Paris, we offer world-class amenities and exceptional service that will make your stay unforgettable.",
        photos: [
          "/luxury-hotel-exterior-pool.png",
          "/luxury-hotel-room-with-elegant-decor.jpg",
          "/boutique-hotel-lobby-with-modern-design.jpg",
          "/modern-hotel-suite-with-city-skyline-view.jpg",
        ],
        rooms: [
          {
            id: "1",
            name: "Deluxe Room",
            description: "Spacious room with city view and modern amenities",
            pricePerNight: 180,
            maxGuests: 2,
            amenities: ["WiFi", "Air Conditioning", "Mini Bar", "Safe"],
            imageUrl: "/luxury-hotel-room-with-elegant-decor.jpg",
            available: true,
          },
          {
            id: "2",
            name: "Executive Suite",
            description: "Luxurious suite with separate living area and premium amenities",
            pricePerNight: 320,
            maxGuests: 4,
            amenities: ["WiFi", "Air Conditioning", "Mini Bar", "Safe", "Living Area", "Balcony"],
            imageUrl: "/modern-hotel-suite-with-city-skyline-view.jpg",
            available: true,
          },
        ],
        location: {
          address: "123 Champs-Élysées, Paris, France",
          latitude: 48.8566,
          longitude: 2.3522,
        },
        policies: {
          checkIn: "3:00 PM",
          checkOut: "11:00 AM",
          cancellation: "Free cancellation up to 24 hours before check-in",
        },
      }
    }
  }

  async createBooking(bookingData: BookingRequest): Promise<Booking> {
    try {
      const response = await apiClient.post(`/api/hotels/${bookingData.hotelId}/bookings`, bookingData)
      return response.data
    } catch (error) {
      console.error("Error creating booking:", error)
      return {
        id: "booking-" + Date.now(),
        hotelId: bookingData.hotelId,
        hotelName: "Grand Palace Hotel",
        roomId: bookingData.roomId || "1",
        roomName: "Deluxe Room",
        userId: "user-1",
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: bookingData.guests,
        totalPrice: 540, // 3 nights * $180
        status: "pending",
        createdAt: new Date().toISOString(),
        paymentStatus: "pending",
      }
    }
  }

  async getUserBookings(hotelId?: string): Promise<Booking[]> {
    try {
      const url = hotelId ? `/api/hotels/${hotelId}/bookings` : `/api/bookings`
      const response = await apiClient.get(url)
      return response.data
    } catch (error) {
      console.error("Error fetching bookings:", error)
      return [
        {
          id: "booking-1",
          hotelId: "1",
          hotelName: "Grand Palace Hotel",
          roomId: "1",
          roomName: "Deluxe Room",
          userId: "user-1",
          checkIn: "2026-06-25",
          checkOut: "2026-06-27",
          guests: 2,
          totalPrice: 540,
          status: "confirmed",
          createdAt: "2026-12-01T10:00:00Z",
          paymentStatus: "paid",
        },
        {
          id: "booking-2",
          hotelId: "2",
          hotelName: "Boutique City Hotel",
          roomId: "2",
          roomName: "Executive Suite",
          userId: "user-1",
          checkIn: "2026-12-20",
          checkOut: "2026-12-23",
          guests: 2,
          totalPrice: 360,
          status: "pending",
          createdAt: "2026-12-02T14:30:00Z",
          paymentStatus: "pending",
        },
      ]
    }
  }

  async getBookingDetails(bookingId: string): Promise<Booking> {
    try {
      const response = await apiClient.get(`/api/bookings/${bookingId}`)
      return response.data
    } catch (error) {
      console.error("Error fetching booking details:", error)
      return {
        id: bookingId,
        hotelId: "1",
        hotelName: "Grand Palace Hotel",
        roomId: "1",
        roomName: "Deluxe Room",
        userId: "user-1",
        checkIn: "2026-06-25",
        checkOut: "2026-06-27",
        guests: 2,
        totalPrice: 540,
        status: "confirmed",
        createdAt: "2026-12-01T10:00:00Z",
        paymentStatus: "paid",
      }
    }
  }

  async cancelBooking(bookingId: string): Promise<void> {
    try {
      await apiClient.delete(`/api/bookings/${bookingId}`)
    } catch (error) {
      console.error("Error cancelling booking:", error)
      throw error
    }
  }

  async createPaymentIntent(paymentData: PaymentRequest): Promise<PaymentIntent> {
    try {
      const response = await apiClient.post(`/api/payments/create-payment-intent`, paymentData)
      return response.data
    } catch (error) {
      console.error("Error creating payment intent:", error)
      throw error
    }
  }

  async confirmPayment(paymentIntentId: string): Promise<void> {
    try {
      await apiClient.post(`/api/payments/confirm`, { paymentIntentId })
    } catch (error) {
      console.error("Error confirming payment:", error)
      throw error
    }
  }

  async getHotelReviews(hotelId: string): Promise<Review[]> {
    try {
      const response = await apiClient.get(`/api/hotels/${hotelId}/reviews`)
      return response.data
    } catch (error) {
      console.error("Error fetching hotel reviews:", error)
      return [
        {
          id: "review-1",
          userId: "user-1",
          userName: "Sarah Johnson",
          userAvatar: "/diverse-user-avatars.png",
          hotelId: hotelId,
          rating: 5,
          title: "Absolutely amazing stay!",
          comment:
            "The hotel exceeded all my expectations. The staff was incredibly friendly and helpful, the room was spacious and clean, and the location was perfect for exploring the city. I would definitely stay here again!",
          createdAt: "2026-11-15T10:30:00Z",
          helpful: 12,
        },
        {
          id: "review-2",
          userId: "user-2",
          userName: "Michael Chen",
          userAvatar: "/diverse-user-avatar-set-2.png",
          hotelId: hotelId,
          rating: 4,
          title: "Great value for money",
          comment:
            "Really enjoyed our stay here. The breakfast was excellent and the room was comfortable. Only minor complaint was that the WiFi was a bit slow, but overall a great experience.",
          createdAt: "2026-11-10T14:20:00Z",
          helpful: 8,
        },
        {
          id: "review-3",
          userId: "user-3",
          userName: "Emma Wilson",
          userAvatar: "/diverse-user-avatars-3.png",
          hotelId: hotelId,
          rating: 5,
          title: "Perfect location and service",
          comment:
            "This hotel is in the heart of everything! Walking distance to all major attractions. The concierge was extremely helpful with restaurant recommendations. Highly recommend!",
          createdAt: "2026-11-05T09:15:00Z",
          helpful: 15,
        },
        {
          id: "review-4",
          userId: "user-4",
          userName: "David Rodriguez",
          userAvatar: "/user-avatar-4.png",
          hotelId: hotelId,
          rating: 3,
          title: "Decent stay with some issues",
          comment:
            "The hotel is okay but had some maintenance issues. The air conditioning wasn't working properly and it took a while to get it fixed. The staff was apologetic and did their best to resolve the issue.",
          createdAt: "2026-10-28T16:45:00Z",
          helpful: 3,
        },
      ]
    }
  }

  async addHotelReview(hotelId: string, reviewData: ReviewRequest): Promise<Review> {
    try {
      const response = await apiClient.post(`/api/hotels/${hotelId}/reviews`, reviewData)
      return response.data
    } catch (error) {
      console.error("Error adding hotel review:", error)
      return {
        id: "review-" + Date.now(),
        userId: "current-user",
        userName: "You",
        hotelId: hotelId,
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment,
        createdAt: new Date().toISOString(),
        helpful: 0,
      }
    }
  }

  async markReviewHelpful(reviewId: string): Promise<void> {
    try {
      await apiClient.post(`/api/reviews/${reviewId}/helpful`)
    } catch (error) {
      console.error("Error marking review as helpful:", error)
      throw error
    }
  }
}

export const apiService = new ApiService()
