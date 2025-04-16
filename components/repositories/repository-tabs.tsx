"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RepositoryOverview } from "@/components/repositories/repository-overview"
import { RepositoryFiles } from "@/components/repositories/repository-files"
import { RepositoryAgents } from "@/components/repositories/repository-agents"
import { RepositorySettings } from "@/components/repositories/repository-settings"

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

interface RepositoryTabsProps {
  repository: Repository
}

export function RepositoryTabs({ repository }: RepositoryTabsProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="files">Files</TabsTrigger>
        <TabsTrigger value="agents">Agents</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4">
        <RepositoryOverview repository={repository} />
      </TabsContent>
      <TabsContent value="files" className="space-y-4">
        <RepositoryFiles repository={repository} />
      </TabsContent>
      <TabsContent value="agents" className="space-y-4">
        <RepositoryAgents repository={repository} />
      </TabsContent>
      <TabsContent value="settings" className="space-y-4">
        <RepositorySettings repository={repository} />
      </TabsContent>
    </Tabs>
  )
}
