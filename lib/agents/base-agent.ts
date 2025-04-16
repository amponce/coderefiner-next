import { AgentType, AgentStatus, AgentPriority } from '@prisma/client'
import { prisma } from '../prisma'

export interface AgentContext {
  projectId: string
  repositoryId?: string
  teamId: string
  userId: string
  configurationId: string
}

export interface AgentResult {
  success: boolean
  error?: string
  data?: any
}

export abstract class BaseAgent {
  protected context: AgentContext
  protected executionId: string | null = null

  constructor(context: AgentContext) {
    this.context = context
  }

  abstract get type(): AgentType
  abstract execute(): Promise<AgentResult>

  protected async initializeExecution() {
    const execution = await prisma.agentExecution.create({
      data: {
        configuration_id: this.context.configurationId,
        project_id: this.context.projectId,
        repository_id: this.context.repositoryId,
        status: AgentStatus.RUNNING,
        started_at: new Date(),
      }
    })
    this.executionId = execution.id
    return execution
  }

  protected async finalizeExecution(result: AgentResult) {
    if (!this.executionId) throw new Error('Execution not initialized')

    await prisma.agentExecution.update({
      where: { id: this.executionId },
      data: {
        status: result.success ? AgentStatus.COMPLETED : AgentStatus.FAILED,
        completed_at: new Date(),
        error: result.error,
        results: result.data,
      }
    })
  }

  protected async createRecommendation({
    title,
    description,
    priority = AgentPriority.MEDIUM,
    category,
    filePath,
    diff,
    metadata
  }: {
    title: string
    description: string
    priority?: AgentPriority
    category: string
    filePath?: string
    diff?: string
    metadata?: any
  }) {
    if (!this.executionId) throw new Error('Execution not initialized')

    return prisma.agentRecommendation.create({
      data: {
        execution_id: this.executionId,
        title,
        description,
        priority,
        category,
        file_path: filePath,
        diff,
        metadata,
      }
    })
  }

  protected async logPromptResult({
    originalPrompt,
    refinedPrompt,
    contextFiles,
    cursorCommands,
    metadata
  }: {
    originalPrompt: string
    refinedPrompt: string
    contextFiles: string[]
    cursorCommands?: any
    metadata?: any
  }) {
    if (!this.executionId) throw new Error('Execution not initialized')

    return prisma.promptResult.create({
      data: {
        execution_id: this.executionId,
        original_prompt,
        refined_prompt,
        context_files: contextFiles,
        cursor_commands: cursorCommands,
        metadata,
      }
    })
  }
} 