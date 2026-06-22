import { getTranslations } from "next-intl/server"

export default async function CoachBookingsPage() {
  const t = await getTranslations("dashboard.coach.bookings")
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
    </div>
  )
}
