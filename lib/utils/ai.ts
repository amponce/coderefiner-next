interface FileContext {
  path: string
  content: string
  language: string
}

interface ProjectInfo {
  name: string
  description?: string
  repositories: {
    name: string
    fullName: string
  }[]
}

interface GenerateRefinedPromptOptions {
  originalPrompt: string
  fileContexts: FileContext[]
  projectInfo: ProjectInfo
}

export async function generateRefinedPrompt({
  originalPrompt,
  fileContexts,
  projectInfo
}: GenerateRefinedPromptOptions): Promise<string> {
  // Construct the system prompt
  const systemPrompt = `You are an AI assistant helping to refine a user's prompt for code changes.
Project Context:
- Name: ${projectInfo.name}
- Description: ${projectInfo.description || 'N/A'}
- Repositories: ${projectInfo.repositories.map(r => r.fullName).join(', ')}

Relevant files:
${fileContexts.map(file => `- ${file.path} (${file.language})`).join('\n')}

File contents:
${fileContexts.map(file => `
--- ${file.path} ---
${file.content.slice(0, 500)}${file.content.length > 500 ? '...' : ''}`).join('\n')}

Original prompt: "${originalPrompt}"

Please analyze the context and refine the prompt to:
1. Be more specific about which files to modify
2. Include relevant code patterns from the existing codebase
3. Maintain consistent naming and coding style
4. Consider project structure and dependencies
5. Include necessary imports or setup
6. Suggest test modifications if needed

Refined prompt:`;

  // For now, we'll use a simple refinement
  // TODO: Implement actual AI call (OpenAI/Gemini)
  const refinedPrompt = `Based on the project context, here's how to implement "${originalPrompt}":

1. Files to modify:
${fileContexts.map(f => `- ${f.path}`).join('\n')}

2. Implementation steps:
- [Step-by-step implementation details]
- [Specific code patterns to follow]
- [Test modifications needed]

3. Additional considerations:
- [Project-specific considerations]
- [Dependencies to consider]
- [Potential impacts]`;

  return refinedPrompt
} 