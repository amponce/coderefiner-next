'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import type { AnalysisResults, AnalysisIssue, LargeFunction } from '@/lib/analyzer/types'

export default function ResultsPage() {
  const [results, setResults] = useState<AnalysisResults | null>(null)

  useEffect(() => {
    const storedResults = localStorage.getItem('analysisResults')
    if (storedResults) {
      try {
        const parsed = JSON.parse(storedResults)
        // Ensure the parsed results match our expected structure
        if (parsed && 
            typeof parsed === 'object' && 
            'summary' in parsed && 
            parsed.summary && 
            typeof parsed.summary === 'object' &&
            'issues' in parsed &&
            Array.isArray(parsed.issues) &&
            'largeFunctions' in parsed &&
            Array.isArray(parsed.largeFunctions) &&
            'classComponents' in parsed &&
            Array.isArray(parsed.classComponents) &&
            'recommendations' in parsed &&
            Array.isArray(parsed.recommendations)) {
          setResults(parsed as AnalysisResults)
        } else {
          console.error('Invalid analysis results structure')
        }
      } catch (error) {
        console.error('Error parsing analysis results:', error)
      }
    }
  }, [])

  if (!results || !results.summary) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p>No analysis results found. Please run an analysis first.</p>
      </div>
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'text-red-500'
      case 'medium':
        return 'text-yellow-500'
      case 'low':
        return 'text-blue-500'
      default:
        return 'text-gray-500'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'low':
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Analysis Results</h1>
      
      <div className="grid gap-6">
        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>Overview of analysis findings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-red-100 rounded-lg">
                <p className="text-2xl font-bold">{results.summary.highSeverityCount}</p>
                <p className="text-sm text-gray-600">High Severity Issues</p>
              </div>
              <div className="p-4 bg-yellow-100 rounded-lg">
                <p className="text-2xl font-bold">{results.summary.mediumSeverityCount}</p>
                <p className="text-sm text-gray-600">Medium Severity Issues</p>
              </div>
              <div className="p-4 bg-blue-100 rounded-lg">
                <p className="text-2xl font-bold">{results.summary.lowSeverityCount}</p>
                <p className="text-sm text-gray-600">Low Severity Issues</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <Tabs defaultValue="issues">
          <TabsList>
            <TabsTrigger value="issues">Issues</TabsTrigger>
            <TabsTrigger value="large-functions">Large Functions</TabsTrigger>
            <TabsTrigger value="class-components">Class Components</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="issues">
            <Card>
              <CardHeader>
                <CardTitle>Identified Issues</CardTitle>
                <CardDescription>Detailed list of all issues found during analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {results.issues.map((issue: AnalysisIssue, index: number) => (
                      <Alert key={index}>
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(issue.severity)}
                          <AlertTitle className={getSeverityColor(issue.severity)}>
                            {issue.issue}
                          </AlertTitle>
                        </div>
                        <AlertDescription className="mt-2">
                          <p className="text-sm text-gray-600">File: {issue.file}</p>
                          <p className="text-sm text-gray-600">Category: {issue.category}</p>
                          <p className="text-sm text-gray-600">Count: {issue.count}</p>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="large-functions">
            <Card>
              <CardHeader>
                <CardTitle>Large Functions</CardTitle>
                <CardDescription>Functions that exceed the recommended line count</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {results.largeFunctions.map((func: LargeFunction, index: number) => (
                      <Alert key={index}>
                        <AlertTitle>{func.function}</AlertTitle>
                        <AlertDescription className="mt-2">
                          <p className="text-sm text-gray-600">File: {func.file}</p>
                          <p className="text-sm text-gray-600">Lines: {func.lines}</p>
                          <p className="text-sm text-gray-600">Location: {func.startLine} - {func.endLine}</p>
                          <p className="text-sm text-gray-600">Parameters: {func.params}</p>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="class-components">
            <Card>
              <CardHeader>
                <CardTitle>Class Components</CardTitle>
                <CardDescription>React class components that could be converted to functional components</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {results.classComponents.map((component: string, index: number) => (
                      <Alert key={index}>
                        <AlertTitle>{component}</AlertTitle>
                      </Alert>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>Suggested improvements for your codebase</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {results.recommendations.map((rec: string, index: number) => (
                      <Alert key={index}>
                        <AlertDescription>{rec}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 