import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { DashboardOverview } from "@/components/dashboard/overview"
import { DashboardRecentActivity } from "@/components/dashboard/recent-activity"
import { DashboardStats } from "@/components/dashboard/stats"
import { DashboardWelcome } from "@/components/dashboard/welcome"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="space-y-8">
      <DashboardWelcome user={session?.user} />
      <DashboardStats />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <DashboardOverview className="col-span-4" />
        <DashboardRecentActivity className="col-span-3" />
      </div>
    </div>
  )
}
