import { Waves } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

// next-intl's typed <Link> rejects raw hash strings ("#search", "#pricing", …)
// at type-check time. Hash anchors are same-page navigation, not routes —
// they correctly resolve to native anchor jumps at runtime. Casting through
// the Link href union lets us write them inline without spreading the cast
// everywhere by hand.
function hashHref(hash: string): Parameters<typeof Link>[0]["href"] {
  return hash as unknown as Parameters<typeof Link>[0]["href"]
}

export function Footer() {
  const t = useTranslations("siteFooter")
  const tBrand = useTranslations("brand")
  const year = new Date().getFullYear()

  return (
    <footer className="relative px-6 pb-8 pt-12">
      <div className="mx-auto max-w-7xl rounded-3xl border border-blue-300/20 bg-blue-400/[8%] px-6 py-10 shadow-xl shadow-black/20 backdrop-blur-md sm:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand + tagline */}
          <div className="md:col-span-1">
            <Link href="/" className="flex cursor-pointer items-center gap-2.5 focus-visible:outline-none focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-teal-accent/60" aria-label="SwimAI">
              <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-accent to-blue-accent-dark text-white shadow-lg shadow-blue-accent/30">
                <Waves className="size-5" strokeWidth={2.5} />
              </span>
              <span className="text-xl font-extrabold tracking-tight text-white">
                {tBrand("swim")}
                <span className="bg-gradient-to-r from-teal-accent-light to-blue-accent bg-clip-text text-transparent">
                  {tBrand("ai")}
                </span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              {t("tagline")}
            </p>
          </div>

          {/* Produit */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              {t("product.heading")}
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <Link
                  href={hashHref("#search")}
                  className="cursor-pointer text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-teal-accent/60"
                >
                  {t("product.findCoach")}
                </Link>
              </li>
              <li>
                <Link
                  href={hashHref("#pricing")}
                  className="cursor-pointer text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-teal-accent/60"
                >
                  {t("product.pricing")}
                </Link>
              </li>
              <li>
                <Link
                  href={hashHref("#how")}
                  className="cursor-pointer text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-teal-accent/60"
                >
                  {t("product.howItWorks")}
                </Link>
              </li>
              <li>
                <Link
                  href={hashHref("#coaches-pro")}
                  className="cursor-pointer text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-teal-accent/60"
                >
                  {t("product.forCoaches")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Entreprise */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              {t("company.heading")}
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <Link
                  href={hashHref("#coaches-pro")}
                  className="cursor-pointer text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-teal-accent/60"
                >
                  {t("company.becomeCoach")}
                </Link>
              </li>
              <li>
                <span className="text-sm text-white/40">
                  {t("company.about")}
                </span>
              </li>
              <li>
                <span className="text-sm text-white/40">
                  {t("company.contact")}
                </span>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              {t("legal.heading")}
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <Link
                  href="/mentions-legales"
                  className="cursor-pointer text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-teal-accent/60"
                >
                  {t("legal.mentionsLegales")}
                </Link>
              </li>
              <li>
                <Link
                  href="/cgu"
                  className="cursor-pointer text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-teal-accent/60"
                >
                  {t("legal.cgu")}
                </Link>
              </li>
              <li>
                <Link
                  href="/confidentialite"
                  className="cursor-pointer text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-teal-accent/60"
                >
                  {t("legal.confidentialite")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-white/50">
            {t("copyright", { year })}
          </p>
          <p className="text-xs text-white/40">
            {t("madeWith")}
          </p>
        </div>
      </div>
    </footer>
  )
}
