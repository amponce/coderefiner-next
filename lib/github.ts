import { Octokit } from "@octokit/rest";
import type { components } from "@octokit/openapi-types";

// Initialize Octokit with GitHub token if available
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN || "",
});

export interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string | null;
  owner: string;
  stars: number;
  forks: number;
  watchers: number;
  language: string | null;
  lastAnalyzed?: string;
  healthScore?: number;
  defaultBranch: string;
  url: string;
}

export interface FileNode {
  id: string;
  name: string;
  path: string;
  type: "file" | "directory";
  size?: number;
  url?: string;
  sha?: string;
  children?: FileNode[];
}

export interface Branch {
  name: string;
  sha: string;
  url: string;
}

// Parse GitHub repository URL to extract owner and repo name
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const githubUrlRegex = /github\.com\/([^\/]+)\/([^\/]+)/;
    const match = url.match(githubUrlRegex);
    
    if (!match || match.length < 3) {
      return null;
    }
    
    // Remove .git extension if present
    const repo = match[2].replace(/\.git$/, "");
    
    return {
      owner: match[1],
      repo
    };
  } catch (error) {
    console.error("Error parsing GitHub URL:", error);
    return null;
  }
}

// Validate GitHub repository URL
export async function validateRepository(url: string): Promise<{ valid: boolean; repository?: Repository; message?: string }> {
  const parsed = parseGitHubUrl(url);
  if (!parsed) {
    return { valid: false, message: "Invalid GitHub repository URL format" };
  }
  
  try {
    const { owner, repo } = parsed;
    const response = await octokit.rest.repos.get({
      owner,
      repo,
    });
    
    if (response.status !== 200) {
      return { valid: false, message: "Repository not found or not accessible" };
    }
    
    const repository: Repository = {
      id: response.data.id.toString(),
      name: response.data.name,
      fullName: response.data.full_name,
      description: response.data.description,
      owner: response.data.owner.login,
      stars: response.data.stargazers_count,
      forks: response.data.forks_count,
      watchers: response.data.watchers_count,
      language: response.data.language,
      defaultBranch: response.data.default_branch,
      url: response.data.html_url,
    };
    
    return { valid: true, repository };
  } catch (error) {
    console.error("Error validating repository:", error);
    return { valid: false, message: "Error connecting to GitHub API or repository not found" };
  }
}

// Get repository branches
export async function getRepositoryBranches(owner: string, repo: string): Promise<Branch[]> {
  try {
    const response = await octokit.rest.repos.listBranches({
      owner,
      repo,
      per_page: 100,
    });
    
    return response.data.map(branch => ({
      name: branch.name,
      sha: branch.commit.sha,
      url: branch.commit.url,
    }));
  } catch (error) {
    console.error("Error fetching repository branches:", error);
    throw new Error("Failed to fetch repository branches");
  }
}

// Get repository contents (file tree)
export async function getRepositoryContents(
  owner: string,
  repo: string,
  path: string = "",
  branch: string,
  recursive: boolean = false
): Promise<FileNode[]> {
  try {
    const response = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });
    
    // Handle single file response
    if (!Array.isArray(response.data)) {
      const file = response.data;
      return [{
        id: `${path}/${file.name}`.replace(/^\//, ''),
        name: file.name,
        path: file.path,
        type: "file",
        size: file.size,
        url: file.html_url || undefined,
        sha: file.sha,
      }];
    }
    
    // Handle directory response
    const items: FileNode[] = response.data.map(item => ({
      id: item.path,
      name: item.name,
      path: item.path,
      type: item.type === "dir" ? "directory" : "file",
      size: item.size,
      url: item.html_url || undefined,
      sha: item.sha,
    }));
    
    // Recursively fetch contents for directories if requested
    if (recursive) {
      for (const item of items) {
        if (item.type === "directory") {
          item.children = await getRepositoryContents(
            owner,
            repo,
            item.path,
            branch,
            recursive
          );
        }
      }
    }
    
    return items;
  } catch (error) {
    console.error(`Error fetching repository contents for path ${path}:`, error);
    throw new Error(`Failed to fetch repository contents for path: ${path}`);
  }
}

// Get mock repositories (only if needed for testing)
export async function getRepositories(): Promise<Repository[]> {
  // For backwards compatibility
  return [
    {
      id: "repo1",
      name: "frontend-app",
      fullName: "johndoe/frontend-app",
      description: "React frontend application with Next.js",
      owner: "johndoe",
      stars: 24,
      forks: 5,
      watchers: 8,
      language: "TypeScript",
      lastAnalyzed: "2 days ago",
      healthScore: 85,
      defaultBranch: "main",
      url: "https://github.com/johndoe/frontend-app",
    },
    {
      id: "repo2",
      name: "backend-api",
      fullName: "johndoe/backend-api",
      description: "Node.js backend API with Express",
      owner: "johndoe",
      stars: 12,
      forks: 3,
      watchers: 4,
      language: "JavaScript",
      lastAnalyzed: "5 days ago",
      healthScore: 72,
      defaultBranch: "main",
      url: "https://github.com/johndoe/backend-api",
    },
  ];
}
