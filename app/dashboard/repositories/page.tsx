import { RepositoriesList } from "@/components/repositories/repositories-list"
import { RepositoriesHeader } from "@/components/repositories/repositories-header"
import { getRepositories } from "@/lib/github"

export default async function RepositoriesPage() {
  const repositories = await getRepositories()

  return (
    <div className="space-y-6">
      <RepositoriesHeader />
      <RepositoriesList repositories={repositories} />
    </div>
  )
}
