"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, GitBranch } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { validateRepository } from "@/lib/github"

export default function ConnectRepositoryPage() {
  const router = useRouter()
  const [repoUrl, setRepoUrl] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState("")

  const handleValidate = async () => {
    if (!repoUrl) {
      setError("Please enter a GitHub repository URL")
      return
    }

    setIsValidating(true)
    setError("")

    try {
      const result = await validateRepository(repoUrl)
      
      if (!result.valid) {
        setError(result.message || "Failed to validate repository")
        return
      }

      // Navigate to file selection with repository info
      router.push(`/dashboard/repositories/files?url=${encodeURIComponent(repoUrl)}`)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to validate repository")
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/repositories">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Code Refactoring Toolkit</h1>
          <p className="text-muted-foreground">Connect to any GitHub repository, analyze the codebase, and receive AI-powered refactoring suggestions</p>
        </div>
      </div>
      
      <div className="flex gap-4">
        <div className="flex-1 bg-primary/10 p-6 rounded-lg border border-primary/20">
          <div className="font-medium">1. Connect Repository</div>
        </div>
        <div className="flex-1 bg-muted p-6 rounded-lg">
          <div className="text-muted-foreground">2. Select Files</div>
        </div>
        <div className="flex-1 bg-muted p-6 rounded-lg">
          <div className="text-muted-foreground">3. Configure Analysis</div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-2">Repository Connection</h2>
        <p className="text-muted-foreground mb-6">Connect to a GitHub repository to start analyzing your code.</p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <div className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            <div className="font-medium">GitHub Repository URL</div>
          </div>
          <div className="flex gap-2">
            <Input 
              placeholder="https://github.com/username/repository" 
              className="flex-1"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
            />
            <Button 
              onClick={handleValidate} 
              disabled={isValidating}
            >
              {isValidating ? "Validating..." : "Connect Repository"}
            </Button>
          </div>
          {error && (
            <p className="text-sm text-destructive">
              {error}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Enter the URL of a public GitHub repository to analyze
          </p>
        </div>
      </div>
    </div>
  )
} 