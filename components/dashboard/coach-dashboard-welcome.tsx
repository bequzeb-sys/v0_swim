"use client"

import { useTranslations } from "next-intl"
import { useAuth } from "@/lib/auth/auth-context"

export function CoachDashboardWelcome() {
  const t = useTranslations("dashboardCoach")
  const { user } = useAuth()

  return (
    <h1 className="text-xl font-bold text-white">
      {t("welcome", { name: user?.name ?? "" })}
    </h1>
  )
}
