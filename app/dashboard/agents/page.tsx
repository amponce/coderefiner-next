import { AgentsList } from "@/components/agents/agents-list"
import { getAgents } from "@/lib/agents"
import { AgentsHeader } from "@/components/agents/agents-header"

export type AgentStatus = "completed" | "idle" | "running" | "failed"

export interface Agent {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  enabled: boolean
  lastRun?: string
  status: AgentStatus
}

export default async function AgentsPage() {
  const agents = await getAgents()

  return (
    <div className="space-y-6">
      <AgentsHeader />
      <AgentsList agents={agents} />
    </div>
  )
}
