import { prisma } from '../prisma'
import { CodeFile } from '@prisma/client'

interface GetRelevantFilesOptions {
  projectId: string
  repositoryId?: string
  searchQuery: string
  maxFiles?: number
  includeTests?: boolean
}

interface RelevantFile {
  path: string
  content: string
  language: string
  similarity: number
}

export async function getRelevantFiles({
  projectId,
  repositoryId,
  searchQuery,
  maxFiles = 5,
  includeTests = false
}: GetRelevantFilesOptions): Promise<RelevantFile[]> {
  // Get all code files for the project/repository
  const files = await prisma.codeFile.findMany({
    where: {
      project_id: projectId,
      repository_id: repositoryId,
      // Exclude test files if not explicitly included
      ...(includeTests ? {} : {
        NOT: {
          path: {
            contains: 'test'
          }
        }
      })
    }
  })

  // TODO: Implement semantic search using embeddings
  // For now, just return files based on path matching
  const relevantFiles = files
    .map(file => ({
      path: file.path,
      content: file.content,
      language: file.language,
      similarity: calculateSimilarity(searchQuery, file)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, maxFiles)

  return relevantFiles
}

function calculateSimilarity(query: string, file: CodeFile): number {
  // TODO: Implement proper similarity calculation using embeddings
  // For now, use a simple heuristic based on path and content matching
  const queryTerms = query.toLowerCase().split(/\W+/)
  const pathScore = queryTerms.reduce((score, term) => 
    score + (file.path.toLowerCase().includes(term) ? 1 : 0), 0)
  
  const contentScore = queryTerms.reduce((score, term) => 
    score + (file.content.toLowerCase().includes(term) ? 0.5 : 0), 0)

  return pathScore + contentScore
} 