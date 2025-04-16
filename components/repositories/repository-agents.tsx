import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Code2, FileCode, GitBranch, Lock, Puzzle, RefreshCw, Shield, Zap } from "lucide-react"

interface Repository {
  id: string
  name: string
  description: string
  owner: string
  stars: number
  forks: number
  watchers: number
  language: string
  lastAnalyzed?: string
  healthScore?: number
  branches: string[]
}

interface RepositoryAgentsProps {
  repository: Repository
}

const agents = [
  {
    id: "redundancy",
    name: "Redundancy Agent",
    description: "Detect and flag unused files, functions, components, and assets.",
    icon: <GitBranch className="h-6 w-6 text-purple-500" />,
    enabled: true,
  },
  {
    id: "code-review",
    name: "Code Review Agent",
    description: "Analyze code for complexity, readability issues, and anti-patterns.",
    icon: <Code2 className="h-6 w-6 text-purple-500" />,
    enabled: true,
  },
  {
    id: "optimization",
    name: "Optimization Agent",
    description: "Identify performance bottlenecks and inefficient algorithms.",
    icon: <Zap className="h-6 w-6 text-purple-500" />,
    enabled: true,
  },
  {
    id: "modularization",
    name: "Modularization Agent",
    description: "Detect complex components and provide refactoring instructions.",
    icon: <Puzzle className="h-6 w-6 text-purple-500" />,
    enabled: false,
  },
  {
    id: "documentation",
    name: "Documentation Agent",
    description: "Automatically generate up-to-date markdown documentation.",
    icon: <FileCode className="h-6 w-6 text-purple-500" />,
    enabled: false,
  },
  {
    id: "framework-migration",
    name: "Framework Migration Agent",
    description: "Provide guided flow for migrating between frameworks.",
    icon: <RefreshCw className="h-6 w-6 text-purple-500" />,
    enabled: false,
  },
  {
    id: "security-scan",
    name: "Security Scan Agent",
    description: "Monitor for vulnerabilities in dependencies and code.",
    icon: <Shield className="h-6 w-6 text-purple-500" />,
    enabled: true,
  },
  {
    id: "autonomous-refactoring",
    name: "Autonomous Refactoring Agent",
    description: "Automatically apply refactoring changes following approved patterns.",
    icon: <Lock className="h-6 w-6 text-purple-500" />,
    enabled: false,
  },
]

export function RepositoryAgents({ repository }: RepositoryAgentsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">AI Agents Configuration</h3>
        <Button>Run All Agents</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
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
            <CardFooter className="pt-2 border-t flex justify-end">
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
