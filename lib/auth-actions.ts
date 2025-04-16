"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Update the signIn function to work with the new approach

export async function signIn(provider: string) {
  // This function is now primarily used for server-side authentication
  // Client-side authentication is handled by redirecting to the API route

  if (provider === "github") {
    // For server-side GitHub authentication
    cookies().set("session", "mock-session-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })
  }

  return { success: true }
}

export async function signOut() {
  cookies().delete("session")
  redirect("/")
}
