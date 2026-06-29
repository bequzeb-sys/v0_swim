"use client"

import { Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import { useAuth } from "@/lib/auth/auth-context"
import { Button } from "@/components/ui/button"

interface HeaderActionsProps {
  onNavigate?: () => void
  compact?: boolean
  className?: string
}

export function HeaderActions({
  onNavigate,
  compact = false,
  className,
}: HeaderActionsProps = {}) {
  const t = useTranslations("nav")
  const { user } = useAuth()

  function handleClick() {
    onNavigate?.()
  }

  if (user) {
    return (
      <Button variant="entry" href="/dashboard" onClick={handleClick} className={className}>
        {compact ? <Plus size={18} aria-hidden="true" /> : null}
        <span className={compact ? "hidden lg:inline" : undefined}>
          {t("dashboardCta")}
        </span>
      </Button>
    )
  }

  return (
    // Commencer — entry variant, blue, rounded-xl, navigates to search
    <Button variant="entry" href="#search" onClick={handleClick} className={className}>
      {compact ? <Plus size={18} aria-hidden="true" /> : null}
      <span className={compact ? "hidden lg:inline" : undefined}>
        {t("cta")}
      </span>
    </Button>
  )
}
