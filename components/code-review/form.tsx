"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileIcon, CheckCircleIcon, AlertCircleIcon } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ReviewFeedback {
  type: "success" | "warning" | "error"
  message: string
  suggestion?: string
  line?: number
}

export function CodeReviewForm() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isReviewing, setIsReviewing] = useState(false)
  const [feedback, setFeedback] = useState<ReviewFeedback[]>([])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files))
    }
  }

  const handleReview = async () => {
    if (selectedFiles.length === 0) return
    
    setIsReviewing(true)
    try {
      // This would make an API call to review the code
      // For now just mock the review process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setFeedback([
        {
          type: "warning",
          message: "Consider adding type annotations",
          suggestion: "Add TypeScript types to function parameters",
          line: 15
        },
        {
          type: "error",
          message: "Potential memory leak",
          suggestion: "Clean up event listeners in useEffect",
          line: 27
        },
        {
          type: "success",
          message: "Good use of React hooks",
          line: 10
        }
      ])
    } catch (error) {
      console.error("Failed to review code:", error)
    } finally {
      setIsReviewing(false)
    }
  }

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertCircleIcon className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertCircleIcon className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Submit Code for Review</CardTitle>
          <CardDescription>
            Upload files or paste code to get AI-powered suggestions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="files">Upload Files</Label>
            <div className="grid w-full gap-2">
              <Button variant="outline" className="w-full" onClick={() => document.getElementById("files")?.click()}>
                <FileIcon className="mr-2 h-4 w-4" />
                Select Files
              </Button>
              <input
                id="files"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              {selectedFiles.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  {selectedFiles.length} file(s) selected
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Or Paste Code</Label>
            <Textarea
              id="code"
              placeholder="Paste your code here..."
              className="min-h-[200px] font-mono"
            />
          </div>

          <Button 
            className="w-full"
            onClick={handleReview}
            disabled={selectedFiles.length === 0 || isReviewing}
          >
            {isReviewing ? "Reviewing Code..." : "Start Code Review"}
          </Button>

          {feedback.length > 0 && (
            <ScrollArea className="h-[300px] rounded-md border p-4">
              <div className="space-y-4">
                {feedback.map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    {getFeedbackIcon(item.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.message}</span>
                        {item.line && (
                          <span className="text-sm text-muted-foreground">Line {item.line}</span>
                        )}
                      </div>
                      {item.suggestion && (
                        <p className="mt-1 text-sm text-muted-foreground">{item.suggestion}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 