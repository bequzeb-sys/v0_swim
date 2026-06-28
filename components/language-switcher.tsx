"use client"

import { useLocale } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import { useParams } from "next/navigation"
import { routing } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { Popover } from "@base-ui/react/popover"
import { LanguageFlag } from "@/components/ui/language-flag"
import type { LanguageCode } from "@/lib/coaches"
import { cn } from "@/lib/utils"

export function LanguageSwitcher() {
  const t = useTranslations("languages")
  const currentLocale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  // next-intl needs both the canonical pathname template and the actual param
  // values from useParams to produce the correctly localized URL.
  const routeParams = useParams() as Record<string, string | string[]>

  const otherLocales = routing.locales.filter((l) => l !== currentLocale)

  function switchLocale(nextLocale: string) {
    router.replace(
      {
        pathname,
        params: routeParams,
      } as Parameters<typeof router.replace>[0],
      { locale: nextLocale }
    )
  }

  const triggerLabel =
    currentLocale === "fr" ? "Changer la langue en English" : "Change language to Français"

  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label={triggerLabel}
        className={cn(
          "inline-flex items-center justify-center rounded-md border border-white/15 bg-white/5 p-1.5",
          "text-white/70 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
        )}
      >
        <LanguageFlag
          code={currentLocale as LanguageCode}
          size={22}
          aria-hidden="true"
        />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8} align="end" className="z-50">
          <Popover.Popup
            className={cn(
              "rounded-2xl border border-white/10 bg-white/[8%] p-1.5 shadow-xl shadow-black/20 backdrop-blur-md",
              "text-white",
              "data-[state=open]:animate-in data-[state=closed]:animate-out"
            )}
          >
            <div className="flex flex-col gap-1">
              {otherLocales.map((locale) => (
                <button
                  key={locale}
                  type="button"
                  onClick={() => switchLocale(locale)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium",
                    "text-white/70 transition-colors",
                    "hover:bg-white/10 hover:text-white",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
                  )}
                >
                  <LanguageFlag
                    code={locale as LanguageCode}
                    size={18}
                    aria-hidden="true"
                  />
                  <span>{t(locale)}</span>
                </button>
              ))}
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}
