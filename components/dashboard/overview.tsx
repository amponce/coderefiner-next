import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardOverviewProps {
  className?: string
}

export function DashboardOverview({ className }: DashboardOverviewProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Repository Health</CardTitle>
        <CardDescription>Overall health metrics for your connected repositories</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
          <p className="text-muted-foreground">Repository health chart will be displayed here</p>
        </div>
      </CardContent>
    </Card>
  )
}
