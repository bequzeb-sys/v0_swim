"use client"

import { useState, useEffect } from "react"
import { Waves } from "lucide-react"
import { useTranslations } from "next-intl"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Link } from "@/i18n/navigation"
import { HeaderActions } from "@/components/header-actions"
import { cn } from "@/lib/utils"

interface NavLink {
  key: "coaches" | "how" | "pricing" | "forCoaches"
  href: string
}

const navLinks: NavLink[] = [
  { key: "coaches", href: "#coaches" },
  { key: "how", href: "#how" },
  { key: "pricing", href: "#pricing" },
  { key: "forCoaches", href: "#coaches-pro" },
]

export function Header() {
  const t = useTranslations("nav")
  const tBrand = useTranslations("brand")
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
    <>
      {/* Floating sticky pill */}
      <header
        className={cn(
          "sticky top-3 z-50 mx-auto mt-3 w-fit transition-all duration-300",
          scrolled
            ? "bg-blue-400/[12%] backdrop-blur-xl border-blue-300/25 shadow-lg shadow-black/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
            : "bg-blue-400/[6%] backdrop-blur-lg border-blue-300/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
        )}
        style={{
          borderWidth: "1px",
          borderStyle: "solid",
          borderRadius: "1.125rem",
        }}
      >
        <nav
          className="flex items-center gap-8 px-5 py-4"
          style={{ borderRadius: "1.125rem" }}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5"
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

          {/* Center nav — hidden on small screens */}
          <ul className="hidden items-center gap-9 lg:flex">
            {navLinks.map((link) => (
              <li key={link.key}>
                <a
                  href={link.href}
                  className="text-[15px] font-medium text-white/80 transition-colors hover:text-white"
                >
                  {t(`links.${link.key}`)}
                </a>
              </li>
            ))}
          </ul>

          {/* Right-side actions: language switcher + auth-aware CTA */}
          <div className="ml-auto flex items-center gap-3">
            <LanguageSwitcher />
            <HeaderActions />
          </div>
        </nav>
      </header>
    </>
  )
}
