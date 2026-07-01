"use client"

import { Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import { useAuth } from "@/lib/auth/auth-context"
import { usePathname } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
  const pathname = usePathname()
  const isHome = pathname === "/"

  function handleClick() {
    onNavigate?.()
  }

  if (user) {
    return (
      <Button variant="entry" href="/dashboard" onClick={handleClick} className={className}>
        {compact ? <Plus size={18} className="lg:hidden" aria-hidden="true" /> : null}
        <span className={compact ? "hidden lg:inline" : undefined}>
          {t("dashboardCta")}
        </span>
      </Button>
    )
  }

  return (
    <>
      {isHome ? (
        <button
          type="button"
          onClick={() => {
            document.getElementById("search")?.scrollIntoView({ behavior: "smooth" })
          }}
          className={cn(
            "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-accent px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-accent/30 transition-all hover:bg-blue-accent-dark active:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
            className
          )}
        >
          {compact ? <Plus size={18} className="lg:hidden" aria-hidden="true" /> : null}
          <span className={compact ? "hidden lg:inline" : undefined}>{t("cta")}</span>
        </button>
      ) : (
        <Button variant="entry" href="/#search" className={className}>
          {compact ? <Plus size={18} className="lg:hidden" aria-hidden="true" /> : null}
          <span className={compact ? "hidden lg:inline" : undefined}>{t("cta")}</span>
        </Button>
      )}
    </>
  )
}
