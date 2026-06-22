import { getTranslations } from "next-intl/server"

export default async function ClientMessagesPage() {
  const t = await getTranslations("dashboard.client.messages")
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
    </div>
  )
}
