import { Button } from "@/components/ui/button"
import { GitBranch } from "lucide-react"
import Link from "next/link"

interface DashboardWelcomeProps {
  user: {
    name?: string | null
  } | null
}

export function DashboardWelcome({ user }: DashboardWelcomeProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || "Developer"}</h1>
        <p className="text-muted-foreground">Here's an overview of your codebase and recent activity.</p>
      </div>
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/dashboard/repositories">
            <GitBranch className="mr-2 h-4 w-4" />
            Connect Repository
          </Link>
        </Button>
      </div>
    </div>
  )
}
