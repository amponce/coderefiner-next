"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github } from "lucide-react"
import { signIn } from "next-auth/react"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  
  const handleGitHubSignIn = async () => {
    try {
      setIsLoading(true)
      // Call signIn and let NextAuth handle the redirect
      await signIn("github", { callbackUrl: "/dashboard" })
    } catch (error) {
      console.error("Authentication error:", error)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
        <CardDescription className="text-center">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          className="w-full"
          variant="outline"
          onClick={handleGitHubSignIn}
          disabled={isLoading}
        >
          <Github className="mr-2 h-4 w-4" />
          {isLoading ? "Signing in..." : "Continue with GitHub"}
        </Button>
      </CardContent>
    </Card>
  )
}
