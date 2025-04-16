import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

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

interface RepositorySettingsProps {
  repository: Repository
}

export function RepositorySettings({ repository }: RepositorySettingsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Configure general settings for this repository</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="branch">Default Branch</Label>
            <Select defaultValue={repository.branches[0] || "main"}>
              <SelectTrigger id="branch">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                {repository.branches.map((branch) => (
                  <SelectItem key={branch} value={branch}>
                    {branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scan-frequency">Scan Frequency</Label>
            <Select defaultValue="daily">
              <SelectTrigger id="scan-frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="manual">Manual Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-pr">Automatic Pull Requests</Label>
              <div className="text-sm text-muted-foreground">
                Create pull requests for suggested changes automatically
              </div>
            </div>
            <Switch id="auto-pr" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ignored Files</CardTitle>
          <CardDescription>Specify files and directories to ignore during analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ignore-patterns">Ignore Patterns</Label>
            <Input
              id="ignore-patterns"
              placeholder="e.g., node_modules/**, *.test.js"
              defaultValue="node_modules/**, .git/**, build/**, dist/**"
            />
            <p className="text-sm text-muted-foreground">Use glob patterns, one per line or comma-separated</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>Destructive actions for this repository</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-md bg-destructive/10">
            <div>
              <h4 className="font-medium">Disconnect Repository</h4>
              <p className="text-sm text-muted-foreground">Remove this repository from CodeRefiner</p>
            </div>
            <Button variant="destructive">Disconnect</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
