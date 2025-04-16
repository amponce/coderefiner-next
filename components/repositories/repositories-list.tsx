import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GitBranch, GitFork, Star, Eye, ArrowRight } from "lucide-react"
import Link from "next/link"
import type { Repository } from "@/lib/github"

interface RepositoriesListProps {
  repositories: Repository[]
}

export function RepositoriesList({ repositories }: RepositoriesListProps) {
  if (repositories.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>No repositories connected</CardTitle>
          <CardDescription>Connect your GitHub repositories to start analyzing your code.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <GitBranch className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-center text-muted-foreground mb-4">
            You haven't connected any repositories yet. Connect your first repository to get started.
          </p>
          <Button asChild>
            <Link href="/dashboard/repositories/connect">
              <GitBranch className="mr-2 h-4 w-4" />
              Connect Repository
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {repositories.map((repo) => (
        <Card key={repo.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{repo.name}</CardTitle>
              {repo.healthScore && (
                <Badge variant={repo.healthScore > 80 ? "default" : repo.healthScore > 60 ? "outline" : "destructive"}>
                  {repo.healthScore}%
                </Badge>
              )}
            </div>
            <CardDescription className="line-clamp-2 h-10">
              {repo.description || "No description provided"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span>{repo.stars}</span>
              </div>
              <div className="flex items-center gap-1">
                <GitFork className="h-4 w-4" />
                <span>{repo.forks}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{repo.watchers}</span>
              </div>
            </div>
            {repo.language && (
              <div className="mt-3">
                <Badge variant="outline">{repo.language}</Badge>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-3 border-t flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              {repo.lastAnalyzed ? `Last analyzed: ${repo.lastAnalyzed}` : "Not analyzed yet"}
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/dashboard/repositories/${repo.id}`}>
                View <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
