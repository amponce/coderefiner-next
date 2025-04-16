import { CodeReviewHeader } from "@/components/code-review/header"
import { CodeReviewForm } from "@/components/code-review/form"
import { requireAuth } from "@/lib/auth"

export default async function CodeReviewPage() {
  await requireAuth()

  return (
    <div className="space-y-6">
      <CodeReviewHeader />
      <CodeReviewForm />
    </div>
  )
} 