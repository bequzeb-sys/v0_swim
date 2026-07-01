"use client"

import { ChevronRight, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { usePathname } from "@/i18n/navigation"

interface FooterCTAProps {
  href?: string
}

export function FooterCTA({ href = "#search" }: FooterCTAProps) {
  const t = useTranslations("footer")
  const pathname = usePathname()
  const isHome = pathname === "/"

  return (
    <section className="relative px-6 pb-12 pt-4">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 rounded-3xl border border-blue-300/20 bg-blue-400/[8%] px-5 py-6 shadow-xl shadow-black/20 backdrop-blur-md sm:flex-row sm:items-center sm:px-7">
        <div className="flex items-start gap-4 sm:items-center">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-teal-accent/15 text-teal-accent shadow-lg shadow-teal-accent/20">
            <MessageCircle className="size-6" />
          </span>
          <p className="text-base text-white sm:text-lg">{t("text")}</p>
        </div>
        {/* Primary CTA — "Essayez gratuitement", teal, rounded-xl. On homepage with #search anchor,
            use scrollIntoView to bypass next-intl Link routing for bare hash hrefs. */}
        {isHome && href === "#search" ? (
          <button
            type="button"
            onClick={() => document.getElementById("search")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-teal-accent px-6 py-3 text-base font-semibold text-navy-deep shadow-lg shadow-teal-accent/20 transition-all hover:bg-teal-accent-light hover:text-navy-deep active:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
          >
            {t("cta")}
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        ) : (
          <Button variant="primary" href={href} iconRight={ChevronRight}>
            {t("cta")}
          </Button>
        )}
      </div>
    </section>
  )
}
