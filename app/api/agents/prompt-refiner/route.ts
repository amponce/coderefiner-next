import { NextRequest, NextResponse } from 'next/server'
import { AgentType } from '@prisma/client'
import { AgentFactory } from '@/lib/agents/agent-factory'
import { z } from 'zod'

const promptRefinerSchema = z.object({
  projectId: z.string().uuid(),
  repositoryId: z.string().uuid().optional(),
  prompt: z.string().min(1),
  options: z.object({
    maxContextFiles: z.number().min(1).max(20).optional(),
    includeTests: z.boolean().optional()
  }).optional()
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = promptRefinerSchema.parse(body)

    // TODO: Get actual user and team info from session
    const userId = 'test-user-id'
    const teamId = 'test-team-id'

    const agent = await AgentFactory.createAgent({
      agentType: AgentType.PROMPT_REFINER,
      projectId: validatedData.projectId,
      repositoryId: validatedData.repositoryId,
      teamId,
      userId,
      options: {
        originalPrompt: validatedData.prompt,
        ...validatedData.options
      }
    })

    const result = await agent.execute()

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to refine prompt' },
        { status: 500 }
      )
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error('Error in prompt refiner:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 