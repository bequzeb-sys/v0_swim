"use client"

import { useState, useEffect } from "react"
import { Waves, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { useTranslations } from "next-intl"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Link } from "@/i18n/navigation"
import { HeaderActions } from "@/components/header-actions"
import { Button } from "@/components/ui/button"
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
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <DialogPrimitive.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
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
            {/* Hamburger trigger — mobile/tablet only */}
            <DialogPrimitive.Trigger
              className="inline-flex size-10 cursor-pointer items-center justify-center rounded-xl border border-blue-300/20 bg-blue-400/10 text-white/80 transition-colors hover:bg-blue-400/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60 lg:hidden"
              aria-label={t("openMenu")}
            >
              <Menu className="size-5" strokeWidth={2.25} aria-hidden="true" />
            </DialogPrimitive.Trigger>
          </div>
        </nav>
      </header>

      {/* Mobile/tablet side drawer */}
      <DialogPrimitive.Portal>
        <AnimatePresence>
          {drawerOpen && (
            <>
              <DialogPrimitive.Backdrop
                className="fixed inset-0 z-50"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="size-full bg-black/60 backdrop-blur-sm"
                />
              </DialogPrimitive.Backdrop>
              <DialogPrimitive.Popup
                className="fixed inset-y-0 right-0 z-50 outline-none"
              >
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", stiffness: 380, damping: 38 }}
                  className="flex h-full w-[min(20rem,85vw)] flex-col gap-2 border-l border-blue-300/20 bg-blue-400/[8%] p-6 shadow-xl shadow-black/20 backdrop-blur-md rounded-l-3xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white/50 uppercase tracking-wider">
                      {t("menu")}
                    </span>
                    <DialogPrimitive.Close
                      className="inline-flex size-9 cursor-pointer items-center justify-center rounded-xl text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
                      aria-label={t("closeMenu")}
                    >
                      <X className="size-4" aria-hidden="true" />
                    </DialogPrimitive.Close>
                  </div>

                  <nav className="flex flex-col gap-1" aria-label={t("menu")}>
                    {navLinks.map((link) => (
                      <Button
                        key={link.key}
                        variant="ghost"
                        href={link.href}
                        onClick={() => setDrawerOpen(false)}
                        className="w-full justify-start px-4 py-3 text-[15px] font-medium text-white/80"
                      >
                        {t(`links.${link.key}`)}
                      </Button>
                    ))}
                  </nav>

                  <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-4">
                    <LanguageSwitcher />
                  </div>

                  <div className="mt-2">
                    <HeaderActions onNavigate={() => setDrawerOpen(false)} />
                  </div>
                </motion.div>
              </DialogPrimitive.Popup>
            </>
          )}
        </AnimatePresence>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
