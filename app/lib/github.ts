import { Octokit } from "@octokit/rest"
import { components } from "@octokit/openapi-types"

// Initialize Octokit with a personal access token if available
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
})

export interface Branch {
  name: string
  commit: {
    sha: string
    url: string
  }
}

export interface FileNode {
  name: string
  path: string
  type: "file" | "directory"
  children?: FileNode[]
}

type GitHubErrorResponse = {
  status?: number
  message?: string
}

type GitHubContentResponse = components["schemas"]["content-directory"][number]

/**
 * Extract owner and repo from a GitHub repository URL
 */
function parseGitHubUrl(url: string): { owner: string; repo: string } {
  // Remove trailing .git if present
  url = url.replace(/\.git$/, "")
  
  // Handle SSH URLs
  if (url.startsWith("git@github.com:")) {
    const [owner, repo] = url.slice("git@github.com:".length).split("/")
    return { owner, repo }
  }
  
  // Handle HTTPS URLs
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/)
  if (!match) {
    throw new Error("Invalid GitHub repository URL")
  }
  
  return {
    owner: match[1],
    repo: match[2]
  }
}

/**
 * Validate if a repository exists and is accessible
 */
export async function validateRepository(url: string): Promise<{ valid: boolean; message?: string }> {
  try {
    const { owner, repo } = parseGitHubUrl(url)
    const response = await octokit.repos.get({ owner, repo })
    return { valid: true }
  } catch (error: unknown) {
    const err = error as GitHubErrorResponse
    if (err?.status === 404) {
      return { valid: false, message: "Repository not found" }
    }
    if (err?.status === 401) {
      return { valid: false, message: "Authentication required" }
    }
    if (err?.status === 403) {
      return { valid: false, message: "Access denied" }
    }
    return { valid: false, message: "Failed to validate repository" }
  }
}

/**
 * Get all branches for a repository
 */
export async function getRepositoryBranches(url: string): Promise<Branch[]> {
  try {
    const { owner, repo } = parseGitHubUrl(url)
    const response = await octokit.repos.listBranches({ owner, repo })
    return response.data
  } catch (error: unknown) {
    const err = error as GitHubErrorResponse
    console.error("Error fetching repository branches:", err)
    throw new Error(`Failed to fetch repository branches: ${err?.message || "Unknown error"}`)
  }
}

/**
 * Get repository contents for a specific branch
 */
export async function getRepositoryContents(url: string, branch: string, path: string = ""): Promise<FileNode[]> {
  try {
    const { owner, repo } = parseGitHubUrl(url)
    
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref: branch
    })

    if (!Array.isArray(response.data)) {
      throw new Error("Path does not point to a directory")
    }

    const contents = await Promise.all(
      response.data.map(async (item: GitHubContentResponse) => {
        const node: FileNode = {
          name: item.name,
          path: item.path,
          type: item.type === "dir" ? "directory" : "file"
        }

        if (item.type === "dir") {
          try {
            node.children = await getRepositoryContents(url, branch, item.path)
          } catch (error) {
            console.warn(`Failed to fetch contents for ${item.path}:`, error)
            node.children = []
          }
        }

        return node
      })
    )

    return contents
  } catch (error: unknown) {
    const err = error as GitHubErrorResponse
    console.error("Error fetching repository contents:", err)
    throw new Error(`Failed to fetch repository contents: ${err?.message || "Unknown error"}`)
  }
} 