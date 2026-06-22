import { getTranslations } from "next-intl/server"

export default async function ClientDashboardPage() {
  const t = await getTranslations("dashboard.client.home")
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
    </div>
  )
}
