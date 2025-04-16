import fs from 'fs/promises'
import path from 'path'
import { getPatterns, THRESHOLDS } from './patterns'
import type { AnalyzerConfig, AnalysisResults, AnalysisIssue, LargeFunction } from './types'

const DEFAULT_EXCLUDE = [
  'node_modules',
  '.next',
  'dist',
  'build',
  '.git',
  '*.test.*',
  '*.spec.*',
  '*.d.ts'
]

export class CodeAnalyzer {
  private patterns: Record<string, RegExp>
  private config: AnalyzerConfig
  private results: AnalysisResults

  constructor(config: AnalyzerConfig) {
    this.config = {
      ...config,
      exclude: [...DEFAULT_EXCLUDE, ...(config.exclude || [])],
      thresholds: {
        lineThreshold: THRESHOLDS.LINE_THRESHOLD,
        maxFunctionParams: THRESHOLDS.MAX_FUNCTION_PARAMS,
        maxArrayOperations: THRESHOLDS.MAX_ARRAY_OPERATIONS,
        maxStateUpdates: THRESHOLDS.MAX_STATE_UPDATES,
        ...config.thresholds
      }
    }
    this.patterns = getPatterns(config.framework)
    this.results = this.initializeResults()
  }

  private initializeResults(): AnalysisResults {
    return {
      classComponents: [],
      largeFunctions: [],
      performanceIssues: [],
      expensiveCompute: [],
      securityIssues: [],
      summary: {
        totalFiles: 0,
        totalClassComponents: 0,
        totalLargeFunctions: 0,
        totalPerformanceIssues: 0,
        totalExpensiveCompute: 0,
        totalSecurityIssues: 0,
        overallScore: 100,
        recommendations: []
      }
    }
  }

  private async findFiles(dir: string): Promise<string[]> {
    const files: string[] = []
    
    async function traverse(currentDir: string) {
      const entries = await fs.readdir(currentDir, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name)
        
        if (entry.isDirectory() && !DEFAULT_EXCLUDE.includes(entry.name)) {
          await traverse(fullPath)
        } else if (entry.isFile() && /\.(js|jsx|ts|tsx|vue)$/.test(entry.name)) {
          files.push(fullPath)
        }
      }
    }
    
    await traverse(dir)
    return files
  }

  private async analyzeFile(filePath: string) {
    try {
      const content = await fs.readFile(filePath, 'utf8')
      const lines = content.split('\n')
      const relativePath = path.relative(process.cwd(), filePath)

      // Check for class components
      if (this.patterns.CLASS_COMPONENT) {
        const matches = content.match(this.patterns.CLASS_COMPONENT)
        if (matches) {
          this.results.classComponents.push({
            file: relativePath,
            count: matches.length
          })
        }
      }

      // Check for large functions
      this.analyzeFunctions(content, relativePath)

      // Check for performance issues
      this.analyzePerformance(content, relativePath)

      // Check for expensive computations
      this.analyzeExpensiveCompute(content, relativePath)

      // Framework-specific analysis
      if (this.config.framework === 'next') {
        this.analyzeNextJs(content, relativePath)
      } else if (this.config.framework === 'vue') {
        this.analyzeVue(content, relativePath)
      } else if (this.config.framework === 'angular') {
        this.analyzeAngular(content, relativePath)
      }

    } catch (error) {
      console.error(`Error analyzing ${filePath}:`, error)
    }
  }

  private analyzeFunctions(content: string, filePath: string) {
    let match
    // Analyze function declarations
    while ((match = this.patterns.LARGE_FUNCTION.exec(content)) !== null) {
      this.extractAndAnalyzeFunction(content, match, filePath)
    }
    
    // Analyze arrow functions
    while ((match = this.patterns.ARROW_FUNCTION.exec(content)) !== null) {
      this.extractAndAnalyzeFunction(content, match, filePath, true)
    }
  }

  private analyzePerformance(content: string, filePath: string) {
    // Check inline functions in JSX
    if (this.patterns.INLINE_FUNCTION) {
      const matches = content.match(this.patterns.INLINE_FUNCTION)
      if (matches) {
        this.results.performanceIssues.push({
          file: filePath,
          issue: 'Inline function in JSX',
          count: matches.length,
          severity: 'medium',
          category: 'performance',
          suggestion: 'Move functions outside of JSX or use useCallback'
        })
      }
    }

    // Check inline object creation
    const objectMatches = content.match(this.patterns.INLINE_OBJECT_CREATION)
    if (objectMatches) {
      this.results.performanceIssues.push({
        file: filePath,
        issue: 'Inline object creation in JSX',
        count: objectMatches.length,
        severity: 'medium',
        category: 'performance',
        suggestion: 'Move object creation outside of render or use useMemo'
      })
    }
  }

  private analyzeExpensiveCompute(content: string, filePath: string) {
    // Check for expensive array operations
    const arrayMatches = content.match(this.patterns.EXPENSIVE_ARRAY_METHODS)
    if (arrayMatches && arrayMatches.length > this.config.thresholds!.maxArrayOperations!) {
      this.results.expensiveCompute.push({
        file: filePath,
        issue: 'Heavy use of array methods',
        count: arrayMatches.length,
        severity: 'high',
        category: 'performance',
        suggestion: 'Consider using more efficient data structures or memoization'
      })
    }

    // Check for nested loops
    const nestedLoops = content.match(this.patterns.NESTED_LOOPS)
    if (nestedLoops) {
      this.results.expensiveCompute.push({
        file: filePath,
        issue: 'Nested loops detected',
        count: nestedLoops.length,
        severity: 'high',
        category: 'performance',
        suggestion: 'Consider restructuring the logic to avoid nested loops'
      })
    }
  }

  private analyzeNextJs(content: string, filePath: string) {
    // Check for proper use of server/client components
    const clientComponent = content.match(this.patterns.CLIENT_COMPONENT)
    const serverComponent = content.match(this.patterns.SERVER_COMPONENT)
    
    if (!clientComponent && !serverComponent && filePath.includes('app/')) {
      this.results.performanceIssues.push({
        file: filePath,
        issue: 'Missing client/server directive',
        count: 1,
        severity: 'medium',
        category: 'maintainability',
        suggestion: 'Add "use client" or "use server" directive'
      })
    }
  }

  private analyzeVue(content: string, filePath: string) {
    // Vue-specific analysis
    const optionsApi = content.match(this.patterns.OPTIONS_API)
    if (optionsApi) {
      this.results.performanceIssues.push({
        file: filePath,
        issue: 'Using Options API instead of Composition API',
        count: optionsApi.length,
        severity: 'low',
        category: 'maintainability',
        suggestion: 'Consider migrating to Composition API for better type inference and code reuse'
      })
    }
  }

  private analyzeAngular(content: string, filePath: string) {
    // Angular-specific analysis
    const asyncPipe = content.match(this.patterns.ASYNC_PIPE)
    if (!asyncPipe && content.includes('subscribe(')) {
      this.results.performanceIssues.push({
        file: filePath,
        issue: 'Manual subscription without async pipe',
        count: 1,
        severity: 'medium',
        category: 'maintainability',
        suggestion: 'Use async pipe instead of manual subscription'
      })
    }
  }

  private extractAndAnalyzeFunction(
    content: string,
    match: RegExpExecArray,
    filePath: string,
    isArrow: boolean = false
  ) {
    const functionName = match[1]
    const params = match[2]
    const startLine = content.substring(0, match.index).split('\n').length
    
    const bodyStart = content.indexOf('{', match.index + match[0].length)
    if (bodyStart !== -1) {
      const body = this.extractFunctionBody(content, bodyStart)
      if (body) {
        const lineCount = body.split('\n').length
        const paramCount = params ? params.split(',').length : 0
        
        if (lineCount > this.config.thresholds!.lineThreshold!) {
          this.results.largeFunctions.push({
            file: filePath,
            function: `${functionName}${isArrow ? ' (arrow)' : ''}`,
            lines: lineCount,
            startLine,
            endLine: startLine + lineCount,
            params: paramCount
          })
        }
        
        if (paramCount > this.config.thresholds!.maxFunctionParams!) {
          this.results.performanceIssues.push({
            file: filePath,
            issue: `Function has too many parameters (${paramCount})`,
            count: 1,
            severity: 'medium',
            category: 'maintainability',
            suggestion: 'Use an options object pattern instead of multiple parameters'
          })
        }
      }
    }
  }

  private extractFunctionBody(content: string, start: number): string | null {
    let openBraces = 1
    let currentIndex = start + 1
    
    while (openBraces > 0 && currentIndex < content.length) {
      if (content[currentIndex] === '{') openBraces++
      if (content[currentIndex] === '}') openBraces--
      currentIndex++
    }
    
    return openBraces === 0 ? content.substring(start, currentIndex) : null
  }

  private calculateScore() {
    let score = 100

    // Deduct points based on issues
    score -= this.results.classComponents.length * 2 // -2 points per class component
    score -= this.results.largeFunctions.length * 3 // -3 points per large function
    score -= this.results.performanceIssues.reduce((acc, issue) => 
      acc + (issue.severity === 'high' ? 5 : issue.severity === 'medium' ? 3 : 1) * issue.count, 0
    )
    score -= this.results.expensiveCompute.length * 5 // -5 points per expensive computation
    
    return Math.max(0, Math.min(100, score))
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = []

    if (this.results.classComponents.length > 0) {
      recommendations.push('Convert class components to functional components with hooks')
    }

    if (this.results.largeFunctions.length > 0) {
      recommendations.push('Break down large functions into smaller, more manageable pieces')
    }

    if (this.results.performanceIssues.length > 0) {
      recommendations.push('Address performance issues by removing inline functions and optimizing renders')
    }

    if (this.results.expensiveCompute.length > 0) {
      recommendations.push('Optimize expensive computations using memoization or better algorithms')
    }

    return recommendations
  }

  public async analyze(): Promise<AnalysisResults> {
    for (const dir of this.config.paths) {
      const files = await this.findFiles(dir)
      this.results.summary.totalFiles += files.length
      
      for (const file of files) {
        await this.analyzeFile(file)
      }
    }

    // Calculate summary statistics
    this.results.summary.totalClassComponents = this.results.classComponents.reduce((sum, item) => sum + item.count, 0)
    this.results.summary.totalLargeFunctions = this.results.largeFunctions.length
    this.results.summary.totalPerformanceIssues = this.results.performanceIssues.reduce((sum, item) => sum + item.count, 0)
    this.results.summary.totalExpensiveCompute = this.results.expensiveCompute.reduce((sum, item) => sum + item.count, 0)
    this.results.summary.overallScore = this.calculateScore()
    this.results.summary.recommendations = this.generateRecommendations()

    return this.results
  }
} 