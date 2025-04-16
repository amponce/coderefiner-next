import { AgentType } from '@prisma/client'
import { BaseAgent } from './base-agent'
import { PromptRefinerAgent } from './prompt-refiner-agent'
import { prisma } from '../prisma'

export interface CreateAgentOptions {
  agentType: AgentType
  projectId: string
  repositoryId?: string
  teamId: string
  userId: string
  configurationId?: string
  options?: Record<string, any>
}

export class AgentFactory {
  static async createAgent(options: CreateAgentOptions): Promise<BaseAgent> {
    const {
      agentType,
      projectId,
      repositoryId,
      teamId,
      userId,
      configurationId,
      options: agentOptions
    } = options

    // Get or create agent configuration
    const config = configurationId 
      ? await this.getConfiguration(configurationId)
      : await this.createConfiguration(agentType, teamId)

    const context = {
      projectId,
      repositoryId,
      teamId,
      userId,
      configurationId: config.id
    }

    switch (agentType) {
      case AgentType.PROMPT_REFINER:
        return new PromptRefinerAgent(context, agentOptions)
      // Add other agent types here as they're implemented
      default:
        throw new Error(`Unsupported agent type: ${agentType}`)
    }
  }

  private static async getConfiguration(configId: string) {
    const config = await prisma.agentConfiguration.findUnique({
      where: { id: configId }
    })

    if (!config) {
      throw new Error(`Agent configuration not found: ${configId}`)
    }

    return config
  }

  private static async createConfiguration(type: AgentType, teamId: string) {
    // Create default configuration for the agent type
    const defaultConfig = this.getDefaultConfiguration(type)

    return prisma.agentConfiguration.create({
      data: {
        team_id: teamId,
        agent_type: type,
        name: `Default ${type} Configuration`,
        parameters: defaultConfig
      }
    })
  }

  private static getDefaultConfiguration(type: AgentType) {
    switch (type) {
      case AgentType.PROMPT_REFINER:
        return {
          maxContextFiles: 5,
          includeTests: false,
          similarityThreshold: 0.5
        }
      // Add default configurations for other agent types
      default:
        return {}
    }
  }
} 