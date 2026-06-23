
"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await login(email, password)
      toast({ title: "Welcome back!", description: "You have been successfully logged in." })
      router.push("/")
    } catch (error) {
      toast({ title: "Login failed", description: "Please check your credentials and try again.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center">

      <img
        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=80"
        alt="beach background"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(4,44,83,0.78) 0%, rgba(12,68,124,0.65) 40%, rgba(8,80,65,0.20) 100%)" }} />

      <div className="absolute top-10 z-10 text-3xl animate-plane">✈</div>

      <div className="absolute top-6 left-7 z-10 flex items-center gap-2">
        <span className="text-base font-medium text-white tracking-wide">✈ TravelBook</span>
      </div>

      <div className="relative z-10 w-full max-w-sm mx-4 rounded-2xl p-8 backdrop-blur-md"
        style={{ background: "rgba(255,255,255,0.13)", border: "0.5px solid rgba(255,255,255,0.22)" }}>

        <h2 className="text-xl font-medium text-white text-center mb-1">Welcome back</h2>
        <p className="text-sm text-center mb-6 text-white/60">Sign in to continue your journey</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
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

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-white/70">Password</Label>
              <span className="text-xs text-emerald-300">Forgot password?</span>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-white/25 text-white placeholder:text-white/40 bg-white/10"
            />
          </div>

          <Button
            type="submit"
            className="w-full font-medium bg-emerald-600 hover:bg-emerald-700 text-white border-none"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-sm mt-4 text-white/50">
          Don't have an account?{" "}
          <Link href="/register" className="text-emerald-300 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes flyRightLeft {
          0%   { left: -60px; transform: scaleX(1) translateY(0px); opacity: 0; }
          5%   { opacity: 1; }
          45%  { left: calc(100% + 60px); transform: scaleX(1) translateY(-10px); opacity: 1; }
          50%  { left: calc(100% + 60px); opacity: 0; }
          55%  { left: calc(100% + 60px); transform: scaleX(-1) translateY(-10px); opacity: 1; }
          95%  { left: -60px; transform: scaleX(-1) translateY(0px); opacity: 1; }
          100% { left: -60px; opacity: 0; }
        }
        .animate-plane {
          position: absolute;
          animation: flyRightLeft 9s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
