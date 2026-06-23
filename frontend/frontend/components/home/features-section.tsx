
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Clock, Award, HeartHandshake } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Secure Booking",
    description: "Your payments are protected with bank-level security and encryption.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Get help anytime, anywhere with our round-the-clock customer service.",
  },
  {
    icon: Award,
    title: "Best Price Guarantee",
    description: "Find a lower price elsewhere? We'll match it and give you an extra discount.",
  },
  {
    icon: HeartHandshake,
    title: "Trusted by Millions",
    description: "Join millions of satisfied travelers who trust us with their journeys.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose TravelBook?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're committed to making your travel experience seamless and memorable
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground text-pretty">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
