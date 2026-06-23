
"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { authService, type User } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, firstName: string, lastName: string, phoneNumber: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  /*useEffect(() => {
    const token = authService.getToken()
    if (token) {
      setUser({
        id: "1",
        email: "user@example.com",
        firstName: "Shahd",
        lastName: "Omar",
        role: "user",
      })
    }
    setIsLoading(false)
  }, [])

 const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { user } = await authService.login(email, password)
      setUser({
        ...user,
        firstName: "Shahd",
        lastName: "Omar"
      })
    } finally {
      setIsLoading(false)
    }
  }

 


  const register = async (email: string, password: string, firstName: string, lastName: string, phoneNumber: string) => {
    setIsLoading(true)
    try {
      const { user } = await authService.register(email, password, firstName, lastName, phoneNumber)
      setUser(user)
    } finally {
      setIsLoading(false)
    }
  }*/
 useEffect(() => {
    const token = authService.getToken()
    
    
    const savedUserStr = typeof window !== "undefined" ? localStorage.getItem("user") : null
    const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null
    
    if (token && savedUser) {
      setUser(savedUser) 
    } else {
      setUser(null)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { user } = await authService.login(email, password)
      
      if (typeof window !== "undefined") localStorage.setItem("user", JSON.stringify(user))
      setUser(user) 
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, firstName: string, lastName: string, phoneNumber: string) => {
    setIsLoading(true)
    try {
      const { user } = await authService.register(email, password, firstName, lastName, phoneNumber)
      
      if (typeof window !== "undefined") localStorage.setItem("user", JSON.stringify(user))
      setUser(user)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

