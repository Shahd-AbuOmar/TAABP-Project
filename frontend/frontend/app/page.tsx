import { Navbar } from "@/components/layout/navbar"
import { HeroSection } from "@/components/home/hero-section"
import { TrendingCities } from "@/components/home/trending-cities"
import { FeaturedDeals } from "@/components/home/featured-deals"
import { FeaturesSection } from "@/components/home/features-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <TrendingCities />
        <FeaturedDeals />
        <FeaturesSection />
      </main>
    </div>
  )
}
