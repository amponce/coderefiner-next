import { AgentType } from '@prisma/client'
import { AgentFactory } from '@/lib/agents/agent-factory'
import { prisma } from '@/lib/prisma'

// Mock Prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    project: {
      findUnique: jest.fn()
    },
    codeFile: {
      findMany: jest.fn()
    },
    agentConfiguration: {
      findUnique: jest.fn(),
      create: jest.fn()
    },
    agentExecution: {
      create: jest.fn(),
      update: jest.fn()
    },
    promptResult: {
      create: jest.fn()
    }
  }
}))

describe('PromptRefinerAgent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should refine a prompt with project context', async () => {
    // Mock project data
    const mockProject = {
      id: 'test-project',
      name: 'Test Project',
      description: 'A test project',
      repositories: [
        {
          id: 'test-repo',
          name: 'test-repo',
          full_name: 'org/test-repo'
        }
      ],
      code_files: [
        {
          id: 'test-file',
          path: 'src/app.ts',
          content: 'console.log("Hello World")',
          language: 'typescript'
        }
      ]
    }

    // Mock Prisma responses
    prisma.project.findUnique.mockResolvedValue(mockProject)
    prisma.codeFile.findMany.mockResolvedValue(mockProject.code_files)
    prisma.agentConfiguration.create.mockResolvedValue({
      id: 'test-config',
      team_id: 'test-team',
      agent_type: AgentType.PROMPT_REFINER,
      name: 'Test Config',
      parameters: {}
    })
    prisma.agentExecution.create.mockResolvedValue({
      id: 'test-execution',
      status: 'RUNNING'
    })

    // Create and execute agent
    const agent = await AgentFactory.createAgent({
      agentType: AgentType.PROMPT_REFINER,
      projectId: 'test-project',
      teamId: 'test-team',
      userId: 'test-user',
      options: {
        originalPrompt: 'Add a new API endpoint'
      }
    })

    const result = await agent.execute()

    // Verify success
    expect(result.success).toBe(true)
    expect(result.data).toBeDefined()
    expect(result.data.refinedPrompt).toBeDefined()

    // Verify Prisma calls
    expect(prisma.project.findUnique).toHaveBeenCalled()
    expect(prisma.codeFile.findMany).toHaveBeenCalled()
    expect(prisma.agentExecution.create).toHaveBeenCalled()
    expect(prisma.promptResult.create).toHaveBeenCalled()
  })

  it('should handle errors gracefully', async () => {
    // Mock project not found
    prisma.project.findUnique.mockResolvedValue(null)

    const agent = await AgentFactory.createAgent({
      agentType: AgentType.PROMPT_REFINER,
      projectId: 'non-existent',
      teamId: 'test-team',
      userId: 'test-user',
      options: {
        originalPrompt: 'Add a new feature'
      }
    })

    const result = await agent.execute()

    // Verify error handling
    expect(result.success).toBe(false)
    expect(result.error).toBe('Project not found')
  })
}) 