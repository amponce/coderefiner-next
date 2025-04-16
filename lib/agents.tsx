import React from 'react'
import { Code2, FileCode, GitBranch, Lock, Puzzle, RefreshCw, Shield, Zap } from "lucide-react"
import type { Agent, AgentStatus } from "@/app/dashboard/agents/page"

export async function getAgents(): Promise<Agent[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Return mock agents
  return [
    {
      id: "redundancy",
      name: "Redundancy Agent",
      description: "Detect and flag unused files, functions, components, and assets.",
      icon: <GitBranch className="h-6 w-6 text-purple-500" />,
      enabled: true,
      lastRun: "2 days ago",
      status: "completed" as AgentStatus,
    },
    {
      id: "code-review",
      name: "Code Review Agent",
      description: "Analyze code for complexity, readability issues, and anti-patterns.",
      icon: <Code2 className="h-6 w-6 text-purple-500" />,
      enabled: true,
      lastRun: "2 days ago",
      status: "completed" as AgentStatus,
    },
    {
      id: "optimization",
      name: "Optimization Agent",
      description: "Identify performance bottlenecks and inefficient algorithms.",
      icon: <Zap className="h-6 w-6 text-purple-500" />,
      enabled: true,
      lastRun: "2 days ago",
      status: "completed" as AgentStatus,
    },
    {
      id: "modularization",
      name: "Modularization Agent",
      description: "Detect complex components and provide refactoring instructions.",
      icon: <Puzzle className="h-6 w-6 text-purple-500" />,
      enabled: false,
      status: "idle" as AgentStatus,
    },
    {
      id: "documentation",
      name: "Documentation Agent",
      description: "Automatically generate up-to-date markdown documentation.",
      icon: <FileCode className="h-6 w-6 text-purple-500" />,
      enabled: false,
      status: "idle" as AgentStatus,
    },
    {
      id: "framework-migration",
      name: "Framework Migration Agent",
      description: "Provide guided flow for migrating between frameworks.",
      icon: <RefreshCw className="h-6 w-6 text-purple-500" />,
      enabled: false,
      status: "idle" as AgentStatus,
    },
    {
      id: "security-scan",
      name: "Security Scan Agent",
      description: "Monitor for vulnerabilities in dependencies and code.",
      icon: <Shield className="h-6 w-6 text-purple-500" />,
      enabled: true,
      lastRun: "2 days ago",
      status: "completed" as AgentStatus,
    },
    {
      id: "autonomous-refactoring",
      name: "Autonomous Refactoring Agent",
      description: "Automatically apply refactoring changes following approved patterns.",
      icon: <Lock className="h-6 w-6 text-purple-500" />,
      enabled: false,
      status: "idle" as AgentStatus,
    },
  ]
}
