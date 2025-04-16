export interface Repository {
  id: string
  name: string
  fullName: string
  description: string | null
  owner: string
  stars: number
  forks: number
  watchers: number
  language: string | null
  lastAnalyzed?: string
  healthScore?: number
  defaultBranch: string
  url: string
} 