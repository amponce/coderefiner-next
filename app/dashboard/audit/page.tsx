import { RelationshipAudit } from "@/components/audit/relationship-audit"
import { requireAuth } from "@/lib/auth"

export default async function AuditPage() {
  await requireAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Code Relationship Audit</h1>
        <p className="text-muted-foreground">
          Analyze where components, utilities, and images are used in your codebase
        </p>
      </div>
      <RelationshipAudit />
    </div>
  )
} 