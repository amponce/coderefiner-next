import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GitCommit, GitPullRequest, Code2 } from "lucide-react"

interface DashboardRecentActivityProps {
  className?: string
}

const activities = [
  {
    id: 1,
    type: "commit",
    icon: <GitCommit className="h-4 w-4" />,
    title: "Refactored authentication module",
    repo: "frontend-app",
    time: "2 hours ago",
    user: {
      name: "John Doe",
      avatar: "/thoughtful-gaze.png",
    },
  },
  {
    id: 2,
    type: "pull-request",
    icon: <GitPullRequest className="h-4 w-4" />,
    title: "Add new dashboard components",
    repo: "frontend-app",
    time: "4 hours ago",
    user: {
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=32&width=32&query=portrait%20of%20woman",
    },
  },
  {
    id: 3,
    type: "code-review",
    icon: <Code2 className="h-4 w-4" />,
    title: "Optimized database queries",
    repo: "backend-api",
    time: "6 hours ago",
    user: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?key=t97hh",
    },
  },
  {
    id: 4,
    type: "commit",
    icon: <GitCommit className="h-4 w-4" />,
    title: "Fixed security vulnerability",
    repo: "auth-service",
    time: "1 day ago",
    user: {
      name: "Sarah Chen",
      avatar: "/placeholder.svg?height=32&width=32&query=portrait%20of%20female%20developer",
    },
  },
]

export function DashboardRecentActivity({ className }: DashboardRecentActivityProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions across your repositories</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {activity.icon}
                  <span className="font-medium">{activity.title}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span>{activity.repo}</span> • <span>{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
