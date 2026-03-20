"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { invitedUsers, type InvitedUser } from "./data"

interface AuthContextType {
  user: InvitedUser | null
  isAuthenticated: boolean
  login: (email: string) => { success: boolean; error?: string }
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<InvitedUser | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("folio-user")
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch {
          return null
        }
      }
    }
    return null
  })

  const login = useCallback((email: string): { success: boolean; error?: string } => {
    const normalizedEmail = email.toLowerCase().trim()
    const invitedUser = invitedUsers.find(u => u.email.toLowerCase() === normalizedEmail)
    
    if (invitedUser) {
      setUser(invitedUser)
      if (typeof window !== "undefined") {
        localStorage.setItem("folio-user", JSON.stringify(invitedUser))
      }
      return { success: true }
    }
    
    return { success: false, error: "This email is not on the invite list." }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("folio-user")
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
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
