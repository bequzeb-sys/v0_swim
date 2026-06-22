"use client"

import { useTranslations } from "next-intl"
import { useAuth } from "@/lib/auth/auth-context"
import { Link } from "@/i18n/navigation"

export function HeaderActions() {
  const t = useTranslations("nav")
  const { user } = useAuth()

  if (user) {
    return (
      <Link
        href="/dashboard"
        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-accent to-blue-accent-dark px-6 py-2.5 text-[15px] font-bold text-white shadow-lg shadow-blue-accent/30 transition-opacity hover:opacity-90"
      >
        {t("dashboardCta")}
      </Link>
    )
  }

  return (
    <a
      href="#search"
      className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-accent to-blue-accent-dark px-6 py-2.5 text-[15px] font-bold text-white shadow-lg shadow-blue-accent/30 transition-opacity hover:opacity-90"
    >
      {t("cta")}
    </a>
  )
}
