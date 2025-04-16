import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

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

interface RepositoryOverviewProps {
  repository: Repository
}

export function RepositoryOverview({ repository }: RepositoryOverviewProps) {
  // Mock data for the overview
  const metrics = [
    { name: "Code Quality", score: 85, description: "Overall code quality score" },
    { name: "Performance", score: 72, description: "Code performance and optimization" },
    { name: "Security", score: 90, description: "Security vulnerabilities and best practices" },
    { name: "Maintainability", score: 78, description: "Code maintainability and documentation" },
  ]

  const issues = [
    { type: "redundancy", count: 12, description: "Redundant code patterns detected" },
    { type: "complexity", count: 8, description: "Complex functions that need refactoring" },
    { type: "security", count: 3, description: "Security vulnerabilities found" },
    { type: "outdated", count: 15, description: "Outdated dependencies" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Repository Health</CardTitle>
          <CardDescription>Overall health metrics for {repository.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{metric.name}</span>
                  <span className="text-sm font-medium">{metric.score}%</span>
                </div>
                <Progress value={metric.score} className="h-2" />
                <p className="text-xs text-muted-foreground">{metric.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Issues Overview</CardTitle>
          <CardDescription>Detected issues that need attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {issues.map((issue) => (
              <div key={issue.type} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{issue.description}</div>
                  <div className="text-sm text-muted-foreground">
                    {issue.count} {issue.count === 1 ? "issue" : "issues"} detected
                  </div>
                </div>
                <Badge variant={issue.type === "security" ? "destructive" : "outline"}>{issue.count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest changes and analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="font-medium">Code analysis completed</div>
              <div className="text-sm text-muted-foreground">2 hours ago</div>
            </div>
            <div>
              <div className="font-medium">Security scan completed</div>
              <div className="text-sm text-muted-foreground">4 hours ago</div>
            </div>
            <div>
              <div className="font-medium">New pull request analyzed</div>
              <div className="text-sm text-muted-foreground">Yesterday at 4:30 PM</div>
            </div>
            <div>
              <div className="font-medium">Documentation updated</div>
              <div className="text-sm text-muted-foreground">2 days ago</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
