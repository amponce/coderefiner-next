import { notFound } from "next/navigation"
import { RepositoryHeader } from "@/components/repositories/repository-header"
import { RepositoryTabs } from "@/components/repositories/repository-tabs"
import { getRepository } from "@/lib/github"

interface RepositoryPageProps {
  params: {
    id: string
  }
}

export default async function RepositoryPage({ params }: RepositoryPageProps) {
  const repository = await getRepository(params.id)

  if (!repository) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <RepositoryHeader repository={repository} />
      <RepositoryTabs repository={repository} />
    </div>
  )
}
