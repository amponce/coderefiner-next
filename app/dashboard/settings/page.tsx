import { SettingsForm } from "@/components/settings/settings-form"
import { SettingsHeader } from "@/components/settings/settings-header"
import { getSettings } from "@/lib/settings"
import { requireAuth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function SettingsPage() {
  const user = await requireAuth()
  
  if (!user) {
    redirect("/login")
  }

  const settings = await getSettings()

  return (
    <div className="space-y-6">
      <SettingsHeader />
      <SettingsForm settings={settings} />
    </div>
  )
}
