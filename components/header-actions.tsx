"use client"

import { useTranslations } from "next-intl"
import { useAuth } from "@/lib/auth/auth-context"
import { Button } from "@/components/ui/button"

interface HeaderActionsProps {
  onNavigate?: () => void
}

export function HeaderActions({ onNavigate }: HeaderActionsProps = {}) {
  const t = useTranslations("nav")
  const { user } = useAuth()

  function handleClick() {
    onNavigate?.()
  }

  if (user) {
    return (
      <Button variant="entry" href="/dashboard" onClick={handleClick}>
        {t("dashboardCta")}
      </Button>
    )
  }

  return (
    // Commencer — entry variant, blue, rounded-xl, navigates to search
    <Button variant="entry" href="#search" onClick={handleClick}>
      {t("cta")}
    </Button>
  )
}
