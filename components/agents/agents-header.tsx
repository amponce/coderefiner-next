import { Button } from "@/components/ui/button"
import { Puzzle } from "lucide-react"

export function AgentsHeader() {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Agents</h1>
        <p className="text-muted-foreground">Configure and manage your AI agents for code analysis.</p>
      </div>
      <div className="flex gap-2">
        <Button>
          <Puzzle className="mr-2 h-4 w-4" />
          Run All Agents
        </Button>
      </div>
    </div>
  )
}
