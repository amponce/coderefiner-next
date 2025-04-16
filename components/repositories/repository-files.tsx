"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown, ChevronRight, File, Folder, Search } from "lucide-react"
import { type FileNode } from "@/lib/github"

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

interface RepositoryFilesProps {
  repository: Repository
}

// Track UI state separately from the file data
interface UIState {
  expanded: Set<string>
  selected: Set<string>
}

export function RepositoryFiles({ repository }: RepositoryFilesProps) {
  const [files, setFiles] = useState<FileNode[]>([])
  const [uiState, setUIState] = useState<UIState>({
    expanded: new Set(),
    selected: new Set()
  })
  const [searchQuery, setSearchQuery] = useState("")

  const toggleFolder = (path: string) => {
    setUIState(prev => {
      const expanded = new Set(prev.expanded)
      if (expanded.has(path)) {
        expanded.delete(path)
      } else {
        expanded.add(path)
      }
      return { ...prev, expanded }
    })
  }

  const toggleSelection = (path: string) => {
    setUIState(prev => {
      const selected = new Set(prev.selected)
      if (selected.has(path)) {
        selected.delete(path)
      } else {
        selected.add(path)
      }
      return { ...prev, selected }
    })
  }

  const renderFileTree = (nodes: FileNode[], level = 0) => {
    return nodes.map((node) => (
      <div key={node.path} style={{ marginLeft: `${level * 16}px` }}>
        <div className="flex items-center py-1">
          {node.type === "directory" ? (
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleFolder(node.path)}>
              {uiState.expanded.has(node.path) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          ) : (
            <div className="w-6" />
          )}
          <div className="flex items-center gap-2 flex-1">
            <Checkbox
              id={`select-${node.path}`}
              checked={uiState.selected.has(node.path)}
              onCheckedChange={() => toggleSelection(node.path)}
            />
            {node.type === "directory" ? (
              <Folder className="h-4 w-4 text-muted-foreground" />
            ) : (
              <File className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-sm">{node.name}</span>
          </div>
        </div>
        {node.type === "directory" && uiState.expanded.has(node.path) && node.children && renderFileTree(node.children, level + 1)}
      </div>
    ))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
      </div>
      <div className="border rounded-md p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-medium">Repository Files</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Select All
            </Button>
            <Button variant="outline" size="sm">
              Deselect All
            </Button>
          </div>
        </div>
        <div className="max-h-[500px] overflow-y-auto">{renderFileTree(files)}</div>
      </div>
    </div>
  )
}
