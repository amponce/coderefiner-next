"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Code2, Cog, GitBranch, LayoutDashboard, Puzzle, Shield, Zap } from "lucide-react"

const items = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Repositories",
    href: "/dashboard/repositories",
    icon: <GitBranch className="h-5 w-5" />,
  },
  {
    title: "Agents",
    href: "/dashboard/agents",
    icon: <Puzzle className="h-5 w-5" />,
  },
  {
    title: "Code Review",
    href: "/dashboard/code-review",
    icon: <Code2 className="h-5 w-5" />,
  },
  {
    title: "Optimization",
    href: "/dashboard/optimization",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    title: "Security",
    href: "/dashboard/security",
    icon: <Shield className="h-5 w-5" />,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Cog className="h-5 w-5" />,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed top-16 z-30 hidden h-[calc(100vh-4rem)] w-56 shrink-0 md:sticky md:block">
      <div className="h-full py-6 pr-6 lg:pr-0">
        <nav className="flex flex-col space-y-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}
