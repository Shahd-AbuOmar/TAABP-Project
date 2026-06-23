const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7159"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export interface AuthResponse {
  token: string
  user: User
}

class AuthService {
  private tokenKey = "travel_booking_token"

  getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(this.tokenKey)
  }

  setToken(token: string): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.tokenKey, token)
  }

  removeToken(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(this.tokenKey)
  }

  /*async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })

    if (!response.ok) {
      throw new Error("Login failed")
    }*/

    /*const data = await response.json()
    const { token, user } = data
    this.setToken(token)
    return { token, user }*/
    /*const result = await response.json()

const token = result.data

this.setToken(token)

return {
  token,
  user: {} as User,
}
  }*/

async login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })

  if (!response.ok) {
    throw new Error("Login failed")
  }

  const result = await response.json()

  const token = result.data

  this.setToken(token)

  // Decode JWT
  const payload = JSON.parse(atob(token.split(".")[1]))

  const fullName =
    payload[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
    ] || ""

  const emailValue =
    payload[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
    ] || ""

  const role =
    payload[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ] || "Guest"

  const names = fullName.split(" ")

  const user: User = {
    id: "1",
    email: emailValue,
    firstName: names[0] || "",
    lastName: names[1] || "",
    role,
  }

  return {
    token,
    user,
  }
}
  async register(email: string, password: string, firstName: string, lastName: string , phoneNumber: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
      }),
    })

    if (!response.ok) {
      throw new Error("Registration failed")
    }

    /*const data = await response.json()
    const { token, user } = data
    this.setToken(token)
    return { token, user }*/
    const result = await response.json()

const token = result.data

this.setToken(token)

return {
  token,
  user: {} as User,
}
  }

  logout(): void {
    this.removeToken()
    window.location.href = "/login"
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export const authService = new AuthService()
