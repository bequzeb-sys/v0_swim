"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Waves } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { LanguageSwitcher } from "@/components/language-switcher"
import { cn } from "@/lib/utils"

// Lighter site-wide secondary-page header. Mirrors the main <Header />'s
// sticky floating-pill geometry and the same scrollY>50 adaptive
// transparency, but drops nav links + auth-aware CTA. Used on
// /coaches, /coaches/[id], and the three legal pages.
//
// Back link is intentionally always "/" (homepage) — never browser
// history — so a user landing on a legal page from a shared link
// reliably returns home. Coach profile's old raw <a> + hardcoded
// `/${locale}` template literal is replaced by this component, which
// goes through next-intl's typed Link with an unprefixed path.

export function SecondaryPageHeader() {
  const tBrand = useTranslations("brand")
  const tBack = useTranslations("coachProfile")
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky z-50 mx-auto max-w-[min(52rem,calc(100vw-2rem))] px-4 transition-all duration-300",
        scrolled
          ? "bg-blue-400/[12%] backdrop-blur-xl border-blue-300/25 shadow-lg shadow-black/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
          : "bg-blue-400/[6%] backdrop-blur-lg border-blue-300/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
      )}
      style={{
        borderWidth: "1px",
        borderStyle: "solid",
        borderRadius: "1.125rem",
        top: "calc(0.375rem + env(safe-area-inset-top, 0px))",
        marginTop: "0.375rem",
      }}
    >
      <nav
        className="flex items-center justify-between py-2.5"
        style={{ borderRadius: "1.125rem" }}
      >
        {/* Back — always returns to the homepage */}
        <Link
          href="/"
          className="inline-flex size-9 cursor-pointer items-center justify-center rounded-md border border-white/15 bg-white/5 p-1.5 text-white/70 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
          aria-label={tBack("back")}
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </Link>

        {/* Logo + wordmark — also goes to "/" */}
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label="SwimAI"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-accent to-blue-accent-dark text-white shadow-lg shadow-blue-accent/30">
            <Waves className="size-5" strokeWidth={2.5} />
          </span>
          <span className="text-2xl font-extrabold tracking-tight text-white">
            {tBrand("swim")}
            <span className="bg-gradient-to-r from-teal-accent-light to-blue-accent bg-clip-text text-transparent">
              {tBrand("ai")}
            </span>
          </span>
        </Link>

        {/* Language switcher — same component as the main header */}
        <div className="flex items-center">
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  )
}
