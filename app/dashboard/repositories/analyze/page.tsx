"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Settings, Zap } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AnalysisConfigPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  
  const [analysisOptions, setAnalysisOptions] = useState({
    performanceOptimization: true,
    codeQuality: true,
    securityVulnerabilities: true,
    accessibility: false,
    depth: 2, // 1-3
    model: "gpt-4o"
  })

  useEffect(() => {
    // Get selected files from URL params
    const fileParam = searchParams.get("files")
    if (fileParam) {
      setSelectedFiles(fileParam.split(','))
    }
  }, [searchParams])

  const handleOptionToggle = (option: string) => {
    setAnalysisOptions({
      ...analysisOptions,
      [option]: !analysisOptions[option as keyof typeof analysisOptions]
    })
  }

  const handleDepthChange = (value: number[]) => {
    setAnalysisOptions({
      ...analysisOptions,
      depth: value[0]
    })
  }

  const handleModelChange = (value: string) => {
    setAnalysisOptions({
      ...analysisOptions,
      model: value
    })
  }

  const handleStartAnalysis = async () => {
    setIsLoading(true)
    
    try {
      const fileParam = searchParams.get("files")
      if (!fileParam) {
        throw new Error("No files selected")
      }

      const selectedPaths = fileParam.split(',')
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paths: selectedPaths,
          framework: 'next', // Default to Next.js for now
          thresholds: {
            lineThreshold: analysisOptions.depth === 1 ? 150 : analysisOptions.depth === 2 ? 100 : 50,
            maxFunctionParams: 4,
            maxArrayOperations: 5,
            maxStateUpdates: 3
          }
        })
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const results = await response.json()
      
      // Store results in localStorage for the results page
      localStorage.setItem('analysisResults', JSON.stringify(results))
      
      // Navigate to results page
      router.push(`/dashboard/repositories/results`)
    } catch (error) {
      console.error('Error during analysis:', error)
      // You might want to show an error toast or message here
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/repositories/files">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Code Refactoring Toolkit</h1>
          <p className="text-muted-foreground">Connect to any GitHub repository, analyze the codebase, and receive AI-powered refactoring suggestions</p>
        </div>
      </div>
      
      <div className="flex gap-4">
        <div className="flex-1 bg-muted p-6 rounded-lg">
          <div className="text-muted-foreground">1. Connect Repository</div>
        </div>
        <div className="flex-1 bg-muted p-6 rounded-lg">
          <div className="text-muted-foreground">2. Select Files</div>
        </div>
        <div className="flex-1 bg-primary/10 p-6 rounded-lg border border-primary/20">
          <div className="font-medium">3. Configure Analysis</div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-2">Analysis Configuration</h2>
        <p className="text-muted-foreground mb-2">Files selected: {selectedFiles.length}</p>
      </div>

      <div className="grid gap-6">
        <div className="border rounded-md p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Analysis Options
          </h3>
          
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <Label htmlFor="performance">Performance Optimization</Label>
                <p className="text-sm text-muted-foreground">Identify performance bottlenecks and suggest optimizations</p>
              </div>
              <Switch 
                id="performance" 
                checked={analysisOptions.performanceOptimization}
                onCheckedChange={() => handleOptionToggle('performanceOptimization')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <Label htmlFor="quality">Code Quality</Label>
                <p className="text-sm text-muted-foreground">Improve readability, maintainability, and best practices</p>
              </div>
              <Switch 
                id="quality" 
                checked={analysisOptions.codeQuality}
                onCheckedChange={() => handleOptionToggle('codeQuality')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <Label htmlFor="security">Security Vulnerabilities</Label>
                <p className="text-sm text-muted-foreground">Identify potential security issues and suggest fixes</p>
              </div>
              <Switch 
                id="security" 
                checked={analysisOptions.securityVulnerabilities}
                onCheckedChange={() => handleOptionToggle('securityVulnerabilities')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <Label htmlFor="accessibility">Accessibility</Label>
                <p className="text-sm text-muted-foreground">Improve accessibility compliance</p>
              </div>
              <Switch 
                id="accessibility" 
                checked={analysisOptions.accessibility}
                onCheckedChange={() => handleOptionToggle('accessibility')}
              />
            </div>
          </div>
        </div>
        
        <div className="border rounded-md p-6">
          <h3 className="text-lg font-medium mb-4">Analysis Depth</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Level {analysisOptions.depth}: {analysisOptions.depth === 1 ? 'Quick' : analysisOptions.depth === 2 ? 'Standard' : 'Deep'}</Label>
                <span className="text-sm text-muted-foreground">
                  {analysisOptions.depth === 1 ? '~1 min' : analysisOptions.depth === 2 ? '~3 mins' : '~10 mins'}
                </span>
              </div>
              <Slider 
                value={[analysisOptions.depth]} 
                min={1} 
                max={3} 
                step={1} 
                onValueChange={handleDepthChange}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Quick</span>
                <span>Standard</span>
                <span>Deep</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border rounded-md p-6">
          <h3 className="text-lg font-medium mb-4">AI Model</h3>
          <div className="space-y-2">
            <Label htmlFor="model">Select AI Model</Label>
            <Select value={analysisOptions.model} onValueChange={handleModelChange}>
              <SelectTrigger id="model">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                <SelectItem value="claude-3.5-sonnet" disabled>Claude 3.5 Sonnet (Coming Soon)</SelectItem>
                <SelectItem value="claude-3.7-sonnet-max" disabled>Claude 3.7 Sonnet MAX (Coming Soon)</SelectItem>
                <SelectItem value="claude-3.7-sonnet" disabled>Claude 3.7 Sonnet (Coming Soon)</SelectItem>
                <SelectItem value="gemini-2.5-pro-exp-03-25" disabled>Gemini 2.5 Pro (exp-03-25) (Coming Soon)</SelectItem>
                <SelectItem value="gemini-2.5-pro-max" disabled>Gemini 2.5 Pro MAX (Coming Soon)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-2">Currently using GPT-4o. Additional models will be available soon.</p>
          </div>
        </div>
        
        <Button 
          onClick={handleStartAnalysis} 
          disabled={isLoading} 
          size="lg"
          className="gap-2"
        >
          {isLoading ? "Analysis in progress..." : (
            <>
              <Zap className="h-4 w-4" />
              Start Analysis
            </>
          )}
        </Button>
      </div>
    </div>
  )
} 