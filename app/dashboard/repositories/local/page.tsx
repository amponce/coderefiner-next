"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Folder } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LocalAnalysisPage() {
  const router = useRouter()
  const [localPath, setLocalPath] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleContinue = async () => {
    if (!localPath) {
      setError("Please enter a local path")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate analysis setup - in a real app, this would verify the path exists
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Navigate to file selection with the local path
      router.push(`/dashboard/repositories/files?path=${encodeURIComponent(localPath)}`)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to setup local analysis")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBrowse = () => {
    // In a real app, this would open a file dialog
    // For now we'll just set a sample path
    setLocalPath("/Users/username/projects/my-project")
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/repositories/connect">
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
        <h2 className="text-2xl font-bold mb-2">Local Analysis Setup</h2>
        <p className="text-muted-foreground mb-6">Specify the local directory path to analyze</p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <div className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            <div className="font-medium">Local Directory Path</div>
          </div>
          <div className="flex gap-2">
            <Input 
              placeholder="/path/to/your/project" 
              className="flex-1"
              value={localPath}
              onChange={(e) => setLocalPath(e.target.value)}
            />
            <Button onClick={handleBrowse}>Browse</Button>
          </div>
          {error && (
            <p className="text-sm text-destructive">
              {error}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Select a local directory containing the code you want to analyze
          </p>
        </div>

        <Button 
          className="w-full"
          onClick={handleContinue}
          disabled={isLoading}
        >
          {isLoading ? "Setting up..." : "Continue to File Selection"}
        </Button>
      </div>
    </div>
  )
} 