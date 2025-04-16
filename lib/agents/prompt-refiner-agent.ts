import { AgentType } from '@prisma/client'
import { BaseAgent, AgentResult } from './base-agent'
import { prisma } from '../prisma'
import { getRelevantFiles } from '../utils/code-search'
import { generateRefinedPrompt } from '../utils/ai'

interface PromptRefinerOptions {
  originalPrompt: string
  maxContextFiles?: number
  includeTests?: boolean
}

export class PromptRefinerAgent extends BaseAgent {
  private options: PromptRefinerOptions

  constructor(context: any, options: PromptRefinerOptions) {
    super(context)
    this.options = {
      maxContextFiles: 5,
      includeTests: false,
      ...options
    }
  }

  get type(): AgentType {
    return AgentType.PROMPT_REFINER
  }

  async execute(): Promise<AgentResult> {
    try {
      await this.initializeExecution()

      // Get project and repository info
      const project = await prisma.project.findUnique({
        where: { id: this.context.projectId },
        include: {
          repositories: true,
          code_files: {
            where: {
              repository_id: this.context.repositoryId || undefined
            }
          }
        }
      })

      if (!project) {
        throw new Error('Project not found')
      }

      // Find relevant files based on the prompt
      const relevantFiles = await getRelevantFiles({
        projectId: this.context.projectId,
        repositoryId: this.context.repositoryId,
        searchQuery: this.options.originalPrompt,
        maxFiles: this.options.maxContextFiles,
        includeTests: this.options.includeTests
      })

      // Generate context from relevant files
      const fileContexts = await Promise.all(
        relevantFiles.map(async (file) => ({
          path: file.path,
          content: file.content,
          language: file.language
        }))
      )

      // Generate refined prompt using AI
      const refinedPrompt = await generateRefinedPrompt({
        originalPrompt: this.options.originalPrompt,
        fileContexts,
        projectInfo: {
          name: project.name,
          description: project.description,
          repositories: project.repositories.map(r => ({
            name: r.name,
            fullName: r.full_name
          }))
        }
      })

      // Generate suggested Cursor commands
      const cursorCommands = this.generateCursorCommands(refinedPrompt, fileContexts)

      // Log the prompt result
      await this.logPromptResult({
        originalPrompt: this.options.originalPrompt,
        refinedPrompt,
        contextFiles: relevantFiles.map(f => f.path),
        cursorCommands,
        metadata: {
          projectName: project.name,
          repositoryCount: project.repositories.length,
          relevantFileCount: relevantFiles.length
        }
      })

      return {
        success: true,
        data: {
          refinedPrompt,
          cursorCommands,
          relevantFiles: relevantFiles.map(f => f.path)
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    } finally {
      await this.finalizeExecution({
        success: true,
        data: {
          originalPrompt: this.options.originalPrompt
        }
      })
    }
  }

  private generateCursorCommands(refinedPrompt: string, fileContexts: any[]) {
    // Generate relevant Cursor commands based on the refined prompt
    // This could include:
    // - File creation/modification commands
    // - Navigation commands
    // - Search commands
    // - Test commands
    return {
      commands: [
        {
          type: 'openFiles',
          files: fileContexts.map(f => f.path)
        },
        {
          type: 'executePrompt',
          prompt: refinedPrompt
        }
      ]
    }
  }
} 