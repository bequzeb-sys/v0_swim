import { Waves } from "lucide-react"
import { useTranslations } from "next-intl"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Link } from "@/i18n/navigation"
import { HeaderActions } from "@/components/header-actions"

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

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      {/* Subtle dark strip for nav contrast against the bright top of the photo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
        style={{
          background: "linear-gradient(180deg, rgba(5,11,26,0.45) 0%, rgba(5,11,26,0) 100%)",
        }}
      />
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
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

        {/* Center nav */}
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
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <HeaderActions />
        </div>
      </nav>
    </header>
  )
}
