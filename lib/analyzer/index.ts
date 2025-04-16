import type { AnalyzerConfig, AnalysisResults, AnalysisIssue, LargeFunction } from '@/lib/analyzer/types'
import { promises as fs } from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import { analyzeCode } from '@/lib/openai'

const execAsync = promisify(exec)

export class CodeAnalyzer {
  private config: AnalyzerConfig
  private thresholds: Required<NonNullable<AnalyzerConfig['thresholds']>>

  constructor(config: AnalyzerConfig) {
    this.config = config
    this.thresholds = {
      lineThreshold: config.thresholds?.lineThreshold ?? 100,
      maxFunctionParams: config.thresholds?.maxFunctionParams ?? 4,
      maxArrayOperations: config.thresholds?.maxArrayOperations ?? 5,
      maxStateUpdates: config.thresholds?.maxStateUpdates ?? 3
    }
  }

  private async readFileContents(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, 'utf-8')
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error)
      return ''
    }
  }

  private async findFiles(dir: string, pattern: RegExp): Promise<string[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const files: string[] = []
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      
      if (entry.isDirectory()) {
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
          files.push(...await this.findFiles(fullPath, pattern))
        }
      } else if (pattern.test(entry.name)) {
        files.push(fullPath)
      }
    }
    
    return files
  }

  private async analyzeLargeFunctions(fileContent: string, filePath: string): Promise<LargeFunction[]> {
    const functionPattern = /(?:function|const|let|var)\s+(\w+)\s*=?\s*(?:function\s*)?(\([^)]*\))/g
    const largeFunctions: LargeFunction[] = []
    let match

    const lines = fileContent.split('\n')
    let currentFunction = null
    let startLine = 0
    let braceCount = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      if (line.includes('function') || line.includes('=>')) {
        currentFunction = line
        startLine = i + 1
        braceCount = 0
      }

      if (currentFunction) {
        braceCount += (line.match(/{/g) || []).length
        braceCount -= (line.match(/}/g) || []).length

        if (braceCount === 0 && i - startLine > this.thresholds.lineThreshold) {
          const params = (currentFunction.match(/\((.*?)\)/) || ['', ''])[1].split(',').length
          if (params > this.thresholds.maxFunctionParams) {
            largeFunctions.push({
              function: currentFunction.trim(),
              file: filePath,
              lines: i - startLine + 1,
              startLine,
              endLine: i + 1,
              params
            })
          }
          currentFunction = null
        }
      }
    }

    return largeFunctions
  }

  private async findClassComponents(fileContent: string, filePath: string): Promise<string[]> {
    const classPattern = /class\s+(\w+)\s+extends\s+(?:React\.)?Component/g
    const components: string[] = []
    let match

    while ((match = classPattern.exec(fileContent)) !== null) {
      components.push(`${match[1]} (${filePath})`)
    }

    return components
  }

  private async analyzeWithAI(content: string, filePath: string): Promise<{
    issues: AnalysisIssue[]
    recommendations: string[]
  }> {
    try {
      const response = await analyzeCode(content, {
        functions: true,
        temperature: 0.3
      })

      const issues: AnalysisIssue[] = []
      const recommendations: string[] = []

      if (response.choices[0].message.function_calls) {
        for (const call of response.choices[0].message.function_calls) {
          const args = JSON.parse(call.arguments)
          
          if (call.name === 'reportIssue') {
            issues.push({
              issue: args.issue,
              severity: args.severity,
              category: args.category,
              file: filePath,
              count: 1
            })
            recommendations.push(args.suggestion)
          } else if (call.name === 'analyzeFunctionComplexity') {
            if (args.complexity > 7) {
              issues.push({
                issue: `High complexity in function ${args.functionName}`,
                severity: 'high',
                category: 'Code Quality',
                file: filePath,
                count: 1
              })
              recommendations.push(...args.issues)
            }
          }
        }
      }

      return { issues, recommendations }
    } catch (error) {
      console.error('Error during AI analysis:', error)
      return { issues: [], recommendations: [] }
    }
  }

  async analyze(): Promise<AnalysisResults> {
    const issues: AnalysisIssue[] = []
    const largeFunctions: LargeFunction[] = []
    const classComponents: string[] = []
    const recommendations: string[] = []

    for (const filePath of this.config.paths) {
      if (this.config.exclude?.some(pattern => filePath.includes(pattern))) {
        continue
      }

      const content = await this.readFileContents(filePath)
      
      // Basic static analysis
      const fileLargeFunctions = await this.analyzeLargeFunctions(content, filePath)
      largeFunctions.push(...fileLargeFunctions)

      if (filePath.endsWith('.jsx') || filePath.endsWith('.tsx')) {
        const fileClassComponents = await this.findClassComponents(content, filePath)
        classComponents.push(...fileClassComponents)
      }

      // AI-powered analysis
      const aiAnalysis = await this.analyzeWithAI(content, filePath)
      issues.push(...aiAnalysis.issues)
      recommendations.push(...aiAnalysis.recommendations)

      // ESLint analysis
      try {
        const { stdout } = await execAsync(`npx eslint "${filePath}" --format json`)
        const eslintResults = JSON.parse(stdout)
        
        for (const result of eslintResults) {
          for (const message of result.messages) {
            const { severity, category } = this.categorizeIssue(message.message)
            issues.push({
              issue: message.message,
              severity,
              file: filePath,
              category,
              count: 1
            })
          }
        }
      } catch (error) {
        if (error instanceof Error && 'stdout' in error) {
          try {
            const eslintResults = JSON.parse((error as any).stdout)
            for (const result of eslintResults) {
              for (const message of result.messages) {
                const { severity, category } = this.categorizeIssue(message.message)
                issues.push({
                  issue: message.message,
                  severity,
                  file: filePath,
                  category,
                  count: 1
                })
              }
            }
          } catch (e) {
            console.error('Error parsing ESLint output:', e)
          }
        }
      }
    }

    // Generate framework-specific recommendations
    if (this.config.framework === 'next') {
      if (largeFunctions.length > 0) {
        recommendations.push('Consider breaking down large Next.js page components into smaller, reusable components')
      }
      if (classComponents.length > 0) {
        recommendations.push('Migrate class components to functional components with React hooks for better Next.js compatibility')
      }
    }

    // Add general recommendations
    if (issues.filter(i => i.severity === 'high').length > 0) {
      recommendations.push('Address high severity issues as a priority to improve code security and stability')
    }

    // Calculate summary
    const highSeverityCount = issues.filter(i => i.severity === 'high').length
    const mediumSeverityCount = issues.filter(i => i.severity === 'medium').length
    const lowSeverityCount = issues.filter(i => i.severity === 'low').length

    return {
      summary: {
        highSeverityCount,
        mediumSeverityCount,
        lowSeverityCount
      },
      issues,
      largeFunctions,
      classComponents,
      recommendations: [...new Set(recommendations)] // Remove duplicates
    }
  }

  private categorizeIssue(issue: string): { severity: 'high' | 'medium' | 'low'; category: string } {
    const securityPatterns = /password|token|auth|secret|credential/i
    const performancePatterns = /loop|render|memory|leak/i
    const accessibilityPatterns = /aria|role|alt|label/i

    if (securityPatterns.test(issue)) {
      return { severity: 'high', category: 'Security' }
    } else if (performancePatterns.test(issue)) {
      return { severity: 'medium', category: 'Performance' }
    } else if (accessibilityPatterns.test(issue)) {
      return { severity: 'low', category: 'Accessibility' }
    }

    return { severity: 'medium', category: 'Code Quality' }
  }
} 