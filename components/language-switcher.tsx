"use client"

import { useLocale } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import { useParams } from "next/navigation"
import { routing } from "@/i18n/routing"

const LOCALE_LABELS: Record<(typeof routing.locales)[number], string> = {
  fr: "FR",
  en: "EN",
}

export function LanguageSwitcher() {
  const currentLocale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  // `useParams` from `next/navigation` includes both `[locale]` and our
  // own dynamic segments (e.g. `[id]` for `/coaches/[id]`). next-intl's
  // localized router needs both the canonical pathname AND the actual
  // param values to produce the correct localized URL on locale switch.
  const routeParams = useParams() as Record<string, string | string[]>

  return (
    <div
      role="group"
      aria-label="Language switcher"
      className="inline-flex items-center rounded-xl border border-white/15 bg-white/5 px-1 py-0.5 text-[13px] font-semibold backdrop-blur-md"
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
              router.replace(
                {
                  pathname,
                  params: routeParams,
                } as Parameters<typeof router.replace>[0],
                { locale }
              )
            }}
            className={
              isActive
                ? "rounded-lg bg-white/10 px-3 py-1 text-white shadow-sm transition-colors"
                : "rounded-lg px-3 py-1 text-white/40 transition-colors hover:text-white/70"
            }
          >
            {LOCALE_LABELS[locale]}
          </button>
        )
      })}
    </div>
  )
}
