
"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export function RegisterForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await register(email, password, firstName, lastName, phoneNumber)
      toast({ title: "Account created!", description: "Welcome to our travel platform." })
      router.push("/")
    } catch (error) {
      toast({ title: "Registration failed", description: "Please check your information and try again.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
  
    
    <div className="fixed inset-0 w-screen min-h-screen flex items-center justify-center p-4 overflow-y-auto" style={{ background: "linear-gradient(160deg, #042C53 0%, #0C447C 40%, #085041 100%)" }}>
      <Card className="w-full max-w-md border-white/20 backdrop-blur-md shadow-[0_0_50px_rgba(0,0,0,0.3)]" style={{ background: "rgba(255,255,255,0.13)" }}>
      
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-white text-xl">✈</span>
            <span className="text-white font-medium tracking-wide">TravelBook</span>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Create account</CardTitle>
          <CardDescription className="text-white/60">Join us and start exploring amazing destinations</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white/70">First name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="border-white/25 text-white placeholder:text-white/40 bg-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white/70">Last name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="border-white/25 text-white placeholder:text-white/40 bg-white/10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/70">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-white/25 text-white placeholder:text-white/40 bg-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-white/70">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+1234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="border-white/25 text-white placeholder:text-white/40 bg-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/70">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-white/25 text-white placeholder:text-white/40 bg-white/10"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white border-none"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-white/50">Already have an account? </span>
            <Link href="/login" className="text-emerald-300 hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}