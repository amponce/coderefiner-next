"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { SessionProvider } from "next-auth/react"

interface User {
  id: string
  name: string | null
  email: string | null
  image: string | null
}

interface Session {
  user: User
}

interface AuthContextType {
  session: Session | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSession() {
      try {
        const response = await fetch('/api/auth/session')
        if (!response.ok) {
          throw new Error('Failed to fetch session')
        }
        const data = await response.json()
        setSession(data)
      } catch (error) {
        console.error("Failed to load session:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSession()
  }, [])

  return <SessionProvider>
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  </SessionProvider>
}

export function useSession() {
  return useContext(AuthContext)
}
