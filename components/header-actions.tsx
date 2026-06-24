"use client"

import { useTranslations } from "next-intl"
import { useAuth } from "@/lib/auth/auth-context"
import { Button } from "@/components/ui/button"

export function HeaderActions() {
  const t = useTranslations("nav")
  const { user } = useAuth()

  if (user) {
    return (
      <Button variant="entry" href="/dashboard">
        {t("dashboardCta")}
      </Button>
    )
  }

  return (
    // Commencer — entry variant, blue, rounded-xl, navigates to search
    <Button variant="entry" href="#search">
      {t("cta")}
    </Button>
  )
}
