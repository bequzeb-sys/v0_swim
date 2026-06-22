"use client"

import { useLocale } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"

const LOCALE_LABELS: Record<(typeof routing.locales)[number], string> = {
  fr: "FR",
  en: "EN",
}

export function LanguageSwitcher() {
  const currentLocale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div
      role="group"
      aria-label="Language switcher"
      className="inline-flex items-center rounded-full border border-white/15 bg-white/5 p-0.5 text-[13px] font-semibold backdrop-blur-md"
    >
      {routing.locales.map((locale) => {
        const isActive = locale === currentLocale
        return (
          <button
            key={locale}
            type="button"
            aria-pressed={isActive}
            aria-current={isActive ? "true" : undefined}
            onClick={() => {
              if (isActive) return
              router.replace(pathname, { locale })
            }}
            className={
              isActive
                ? "rounded-full bg-gradient-to-r from-teal-accent to-blue-accent px-3 py-1 text-white shadow-sm shadow-teal-accent/30 transition-colors"
                : "rounded-full px-3 py-1 text-white/70 transition-colors hover:text-white"
            }
          >
            {LOCALE_LABELS[locale]}
          </button>
        )
      })}
    </div>
  )
}
