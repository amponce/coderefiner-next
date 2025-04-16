import type React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

interface Agent {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  enabled: boolean
  lastRun?: string
  status: "idle" | "running" | "completed" | "failed"
}

interface AgentsListProps {
  agents: Agent[]
}

export function AgentsList({ agents }: AgentsListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {agents.map((agent) => (
        <Card key={agent.id}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {agent.icon}
                <CardTitle>{agent.name}</CardTitle>
              </div>
              <Switch id={`agent-${agent.id}`} defaultChecked={agent.enabled} />
            </div>
            <CardDescription>{agent.description}</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center justify-between text-sm">
              <div className="text-muted-foreground">{agent.lastRun ? `Last run: ${agent.lastRun}` : "Never run"}</div>
              <Badge
                variant={
                  agent.status === "running"
                    ? "outline"
                    : agent.status === "completed"
                      ? "default"
                      : agent.status === "failed"
                        ? "destructive"
                        : "secondary"
                }
              >
                {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="pt-2 border-t flex justify-between">
            <Button variant="outline" size="sm">
              Configure
            </Button>
            <Button size="sm">Run Agent</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
