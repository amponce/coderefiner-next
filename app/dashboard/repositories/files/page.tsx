"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronDown, ChevronRight, File, Folder, GitBranch, Plus, X } from "lucide-react"
import Link from "next/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { getRepositoryBranches, getRepositoryContents, parseGitHubUrl, type Branch, type FileNode } from "@/lib/github"

const DEFAULT_EXCLUSIONS = [
  "node_modules/",
  "build/",
  "dist/",
  ".next/",
  ".git/",
  "*.log",
  "*.lock",
  ".env*"
]

function matchesExclusionPattern(path: string, pattern: string): boolean {
  // Convert glob pattern to regex
  const regexPattern = pattern
    .replace(/\./g, "\\.")
    .replace(/\*/g, ".*")
    .replace(/\?/g, ".")
  const regex = new RegExp(`^${regexPattern}`)
  return regex.test(path)
}

function shouldExcludeFile(path: string, exclusions: string[]): boolean {
  // Don't exclude directories during initial filtering
  if (path.endsWith('/')) return false
  return exclusions.some(pattern => {
    // Ensure pattern ends with / for directory matching
    const dirPattern = pattern.endsWith('/') ? pattern : pattern
    return matchesExclusionPattern(path, dirPattern)
  })
}

function filterFileTree(nodes: FileNode[], exclusions: string[]): FileNode[] {
  return nodes.map(node => {
    if (node.type === "directory" && node.children) {
      const filteredChildren = filterFileTree(node.children, exclusions)
      return {
        ...node,
        children: filteredChildren
      }
    }
    return node
  }).filter(node => {
    if (node.type === "directory") {
      // Keep directories that have children or aren't excluded
      return node.children && node.children.length > 0
    }
    // Filter files based on exclusion patterns
    return !shouldExcludeFile(node.path, exclusions)
  })
}

export default function FilesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const repoUrl = searchParams.get("url")

  const [branches, setBranches] = useState<Branch[]>([])
  const [selectedBranch, setSelectedBranch] = useState<string>("")
  const [files, setFiles] = useState<FileNode[]>([])
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [loadingFolders, setLoadingFolders] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [exclusions, setExclusions] = useState<string[]>(DEFAULT_EXCLUSIONS)
  const [newExclusion, setNewExclusion] = useState("")

  useEffect(() => {
    if (!repoUrl) {
      setError("Repository URL is required")
      setLoading(false)
      return
    }

    const fetchBranches = async () => {
      try {
        const parsed = parseGitHubUrl(repoUrl)
        if (!parsed) {
          setError("Invalid repository URL")
          return
        }
        const { owner, repo } = parsed
        const branchList = await getRepositoryBranches(owner, repo)
        setBranches(branchList)
        const mainBranch = branchList.find(b => b.name === "main")
        setSelectedBranch(mainBranch ? mainBranch.name : branchList[0]?.name)
      } catch (error) {
        setError("Failed to fetch repository branches")
      } finally {
        setLoading(false)
      }
    }

    fetchBranches()
  }, [repoUrl])

  useEffect(() => {
    if (!selectedBranch || !repoUrl) return

    const fetchFiles = async () => {
      setLoading(true)
      setError("")
      try {
        const parsed = parseGitHubUrl(repoUrl)
        if (!parsed) {
          setError("Invalid repository URL")
          return
        }
        const { owner, repo } = parsed
        const fileList = await getRepositoryContents(owner, repo, "", selectedBranch)
        console.log("Fetched files:", fileList) // Debug log
        setFiles(fileList)
      } catch (error) {
        console.error("Error fetching files:", error)
        setError("Failed to fetch repository contents")
      } finally {
        setLoading(false)
      }
    }

    fetchFiles()
  }, [repoUrl, selectedBranch])

  // Apply filtering whenever exclusions change
  useEffect(() => {
    if (files.length > 0) {
      const filteredFiles = filterFileTree([...files], exclusions)
      console.log("Filtered files:", filteredFiles) // Debug log
      setFiles(filteredFiles)
    }
  }, [exclusions])

  const toggleSelection = (node: FileNode) => {
    setSelectedFiles(prev => {
      const next = new Set(prev)
      const togglePath = (currentNode: FileNode) => {
        if (next.has(currentNode.path)) {
          next.delete(currentNode.path)
        } else {
          next.add(currentNode.path)
        }
        
        // Toggle all children if it's a directory
        if (currentNode.type === "directory" && currentNode.children) {
          currentNode.children.forEach(child => togglePath(child))
        }
      }
      
      togglePath(node)
      return next
    })
  }

  const toggleFolder = async (path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
        // Fetch contents when expanding
        if (repoUrl && selectedBranch) {
          setLoadingFolders(prev => new Set(prev).add(path))
          const parsed = parseGitHubUrl(repoUrl)
          if (parsed) {
            const { owner, repo } = parsed
            getRepositoryContents(owner, repo, path, selectedBranch)
              .then(contents => {
                setFiles(prevFiles => {
                  const updateNode = (nodes: FileNode[]): FileNode[] => {
                    return nodes.map(node => {
                      if (node.path === path) {
                        return { ...node, children: contents }
                      }
                      if (node.children) {
                        return { ...node, children: updateNode(node.children) }
                      }
                      return node
                    })
                  }
                  return updateNode([...prevFiles])
                })
              })
              .catch(error => {
                console.error("Error fetching folder contents:", error)
                setError("Failed to fetch folder contents")
              })
              .finally(() => {
                setLoadingFolders(prev => {
                  const next = new Set(prev)
                  next.delete(path)
                  return next
                })
              })
          }
        }
      }
      return next
    })
  }

  const renderFileTree = (nodes: FileNode[], level = 0) => {
    return nodes.map((node) => (
      <div key={node.path} style={{ marginLeft: `${level * 16}px` }}>
        <div className="flex items-center py-1">
          {node.type === "directory" ? (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 flex items-center justify-center" 
              onClick={() => toggleFolder(node.path)}
              disabled={loadingFolders.has(node.path)}
            >
              {loadingFolders.has(node.path) ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : expandedFolders.has(node.path) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          ) : (
            <div className="w-6" />
          )}
          <div 
            className="flex items-center gap-2 flex-1 cursor-pointer hover:bg-accent rounded px-2 py-1 h-8"
            onClick={() => toggleSelection(node)}
          >
            <div onClick={(e) => e.stopPropagation()} className="flex items-center justify-center">
              <Checkbox
                id={`select-${node.path}`}
                checked={selectedFiles.has(node.path)}
                onCheckedChange={() => toggleSelection(node)}
                className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
            </div>
            {node.type === "directory" ? (
              <Folder className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            ) : (
              <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            )}
            <span className="text-sm truncate">{node.name}</span>
          </div>
        </div>
        {node.type === "directory" && expandedFolders.has(node.path) && node.children && renderFileTree(node.children, level + 1)}
      </div>
    ))
  }

  const handleContinue = () => {
    if (selectedFiles.size === 0) {
      setError("Please select at least one file")
      return
    }

    const params = new URLSearchParams({
      url: repoUrl || "",
      branch: selectedBranch,
      files: Array.from(selectedFiles).join(",")
    })

    router.push(`/dashboard/repositories/analyze?${params.toString()}`)
  }

  const addExclusion = () => {
    if (!newExclusion) return
    if (!exclusions.includes(newExclusion)) {
      setExclusions([...exclusions, newExclusion])
    }
    setNewExclusion("")
  }

  const removeExclusion = (pattern: string) => {
    setExclusions(exclusions.filter(p => p !== pattern))
  }

  if (!repoUrl) {
    return (
      <div className="p-6">
        <div className="text-destructive">Repository URL is required</div>
        <Button asChild className="mt-4">
          <Link href="/dashboard/repositories/connect">Go Back</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/repositories/connect">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Code Refactoring Toolkit</h1>
          <p className="text-muted-foreground">Connect to any GitHub repository, analyze the codebase, and receive AI-powered refactoring suggestions</p>
        </div>
      </div>
      
      <div className="flex gap-4">
        <div className="flex-1 bg-muted p-6 rounded-lg">
          <div className="text-muted-foreground">1. Connect Repository</div>
        </div>
        <div className="flex-1 bg-primary/10 p-6 rounded-lg border border-primary/20">
          <div className="font-medium">2. Select Files</div>
        </div>
        <div className="flex-1 bg-muted p-6 rounded-lg">
          <div className="text-muted-foreground">3. Configure Analysis</div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-2">File Selection</h2>
        <p className="text-muted-foreground mb-6">Select the files you want to analyze from your repository.</p>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            <span className="font-medium">Select Branch</span>
          </div>
          <Select
            value={selectedBranch}
            onValueChange={setSelectedBranch}
            disabled={loading || branches.length === 0}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a branch" />
            </SelectTrigger>
            <SelectContent>
              {branches.map(branch => (
                <SelectItem key={branch.name} value={branch.name}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-lg">
          <div className="p-4 border-b bg-muted">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Repository Files</h3>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add exclusion pattern (e.g. *.txt)"
                  value={newExclusion}
                  onChange={(e) => setNewExclusion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addExclusion()}
                  className="w-64"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={addExclusion}
                  disabled={!newExclusion}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">Excluded files and folders:</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {exclusions.map((pattern) => (
                <div
                  key={pattern}
                  className="flex items-center gap-1 bg-background text-foreground px-2 py-1 rounded-md text-sm group"
                >
                  {pattern}
                  <button
                    onClick={() => removeExclusion(pattern)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="text-center text-muted-foreground">Loading repository contents...</div>
            ) : files.length === 0 ? (
              <div className="text-center text-muted-foreground">No files found</div>
            ) : (
              renderFileTree(files)
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            asChild
          >
            <Link href="/dashboard/repositories/connect">Back</Link>
          </Button>
          <Button
            onClick={handleContinue}
            disabled={loading || selectedFiles.size === 0}
          >
            Continue to Analysis
          </Button>
        </div>
      </div>
    </div>
  )
} 