import { type Message } from 'ai'
import OpenAI from 'openai'
import { AnalyzerConfig } from './analyzer/types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

interface ToolCall {
  type: 'tool-call'
  toolCallId: string
  toolName: string
  args: Record<string, unknown>
}

interface Step {
  toolCalls?: ToolCall[]
}

export async function analyzeCode(content: string, options: AnalyzerConfig) {
  const tools = {
    reportIssue: {
      type: 'function' as const,
      function: {
        name: 'reportIssue',
        description: 'Report a code issue found during analysis',
        parameters: {
          type: 'object',
          properties: {
            issue: {
              type: 'string',
              description: 'Description of the issue found'
            },
            severity: {
              type: 'string',
              enum: ['high', 'medium', 'low'],
              description: 'Severity level of the issue'
            },
            category: {
              type: 'string',
              enum: ['Security', 'Performance', 'Code Quality', 'Accessibility'],
              description: 'Category of the issue'
            },
            suggestion: {
              type: 'string',
              description: 'Suggested fix or improvement'
            }
          },
          required: ['issue', 'severity', 'category', 'suggestion']
        }
      }
    },
    analyzeFunctionComplexity: {
      type: 'function' as const,
      function: {
        name: 'analyzeFunctionComplexity',
        description: 'Analyze a function for complexity issues',
        parameters: {
          type: 'object',
          properties: {
            functionName: {
              type: 'string',
              description: 'Name of the function being analyzed'
            },
            complexity: {
              type: 'number',
              description: 'Cyclomatic complexity score (1-10)'
            },
            issues: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'List of identified complexity issues'
            }
          },
          required: ['functionName', 'complexity', 'issues']
        }
      }
    }
  }

  const messages = [
    {
      role: 'system' as const,
      content: `You are a code analysis expert. Analyze the provided code for:
- Code quality issues
- Performance bottlenecks
- Security vulnerabilities
- Architectural concerns
- Best practices violations
Provide specific, actionable recommendations.`
    },
    {
      role: 'user' as const,
      content
    }
  ]

  const completion = await openai.chat.completions.create({
    model: options.model || 'gpt-4-turbo-preview',
    messages,
    temperature: options.temperature || 0.3,
    ...(options.functions ? { tools: [tools.reportIssue, tools.analyzeFunctionComplexity] } : {}),
  })

  return completion
} 