import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GitBranch, GitFork, Star, Eye, Play } from "lucide-react"

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

interface RepositoryHeaderProps {
  repository: Repository
}

export function RepositoryHeader({ repository }: RepositoryHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{repository.name}</h1>
            {repository.healthScore && (
              <Badge
                variant={
                  repository.healthScore > 80 ? "default" : repository.healthScore > 60 ? "outline" : "destructive"
                }
              >
                {repository.healthScore}%
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">{repository.description || "No description provided"}</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Play className="mr-2 h-4 w-4" />
            Run Analysis
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-1 text-muted-foreground">
          <GitBranch className="h-4 w-4" />
          <span>{repository.owner}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Star className="h-4 w-4" />
          <span>{repository.stars}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <GitFork className="h-4 w-4" />
          <span>{repository.forks}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Eye className="h-4 w-4" />
          <span>{repository.watchers}</span>
        </div>
        {repository.language && <Badge variant="outline">{repository.language}</Badge>}
      </div>
    </div>
  )
}
