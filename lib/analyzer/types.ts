export interface AnalyzerConfig {
  model?: string
  temperature?: number
  functions?: boolean
}

export interface AnalysisIssue {
  description: string
  severity: 'high' | 'medium' | 'low'
  category: 'Security' | 'Performance' | 'Code Quality' | 'Accessibility'
  suggestion: string
}

export interface FunctionComplexity {
  functionName: string
  complexity: number
  issues: string[]
}

export interface AnalysisResult {
  issues: AnalysisIssue[]
  functionComplexity: FunctionComplexity[]
  summary: string
} 