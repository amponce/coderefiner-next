export type FrameworkType = 'react' | 'vue' | 'angular' | 'next' | 'base'

export interface AnalysisIssue {
  issue: string
  severity: 'high' | 'medium' | 'low'
  file: string
  category: string
  count: number
}

export interface LargeFunction {
  function: string
  file: string
  lines: number
  startLine: number
  endLine: number
  params: number
}

export interface AnalysisSummary {
  highSeverityCount: number
  mediumSeverityCount: number
  lowSeverityCount: number
}

export interface AnalysisResults {
  summary: AnalysisSummary
  issues: AnalysisIssue[]
  largeFunctions: LargeFunction[]
  classComponents: string[]
  recommendations: string[]
}

export interface AnalyzerConfig {
  framework: FrameworkType
  paths: string[]
  exclude?: string[]
  thresholds?: {
    lineThreshold?: number
    maxFunctionParams?: number
    maxArrayOperations?: number
    maxStateUpdates?: number
  }
} 