"use client"

import { useEffect } from "react"

interface SmoothScrollProps {
  enabled?: boolean
}

export default function SmoothScroll({ enabled = true }: SmoothScrollProps) {
  useEffect(() => {
    if (!enabled) return

    // Handle smooth scrolling for anchor links
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a[href^="#"]')

      if (!anchor) return

      const targetId = anchor.getAttribute("href")
      if (!targetId || targetId === "#") return

      const targetElement = document.querySelector(targetId)
      if (!targetElement) return

      e.preventDefault()

      window.scrollTo({
        top: targetElement.getBoundingClientRect().top + window.scrollY,
        behavior: "smooth",
      })
    }

    document.addEventListener("click", handleClick)

    return () => {
      document.removeEventListener("click", handleClick)
    }
  }, [enabled])

  return null
}
