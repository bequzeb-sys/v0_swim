"use client"

import { useTranslations } from "next-intl"
import { useAuth } from "@/lib/auth/auth-context"

interface WelcomeHeaderProps {
  namespace: "dashboardClient" | "dashboardCoach"
}

export function WelcomeHeader({ namespace }: WelcomeHeaderProps) {
  const t = useTranslations(namespace)
  const { user } = useAuth()
  return (
    <h1 className="text-xl font-bold text-white">
      {t("welcome", { name: user?.name ?? "" })}
    </h1>
  )
}
