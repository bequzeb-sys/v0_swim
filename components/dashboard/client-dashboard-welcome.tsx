"use client"

import { useTranslations } from "next-intl"
import { useAuth } from "@/lib/auth/auth-context"

export function ClientDashboardWelcome() {
  const t = useTranslations("dashboardClient")
  const { user } = useAuth()

  return (
    <h1 className="text-xl font-bold text-white">
      {t("welcome", { name: user?.name ?? "" })}
    </h1>
  )
}
