import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

export function Pricing() {
  const t = useTranslations("pricing")

  return (
    <section id="pricing" className="relative scroll-mt-24 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-text-secondary">
            {t("subtitle")}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Single session card */}
          <article className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h3 className="text-lg font-bold text-white sm:text-xl">
              {t("single.name")}
            </h3>
            <div className="mt-5 flex items-baseline whitespace-nowrap">
              <span className="text-4xl font-extrabold text-white">
                {t("single.price")}
              </span>
              <span className="ml-1 text-base text-text-secondary">
                {t("single.unit")}
              </span>
            </div>
            <p className="mt-3 text-base leading-relaxed text-text-secondary">
              {t("single.description")}
            </p>
            <div className="mt-6">
              <Button variant="primary" href="#search" className="w-full">
                {t("single.cta")}
              </Button>
            </div>
          </article>

          {/* Monthly plan card — highlighted */}
          <article className="relative flex flex-col rounded-2xl border border-teal-accent/30 bg-white/5 p-6 backdrop-blur-md">
            <span className="absolute -top-3 left-6 inline-flex items-center gap-1.5 rounded-full border border-teal-accent/40 bg-teal-accent/15 px-3 py-1 text-xs font-bold text-teal-accent shadow-lg shadow-teal-accent/20">
              {t("badge.popular")}
            </span>
            <h3 className="text-lg font-bold text-white sm:text-xl">
              {t("monthly.name")}
            </h3>
            <div className="mt-5 flex items-baseline whitespace-nowrap">
              <span className="text-4xl font-extrabold text-white">
                {t("monthly.price")}
              </span>
              <span className="ml-1 text-base text-text-secondary">
                {t("monthly.unit")}
              </span>
            </div>
            <p className="mt-2 text-sm font-medium text-teal-accent-light">
              {t("monthly.sessions")}
            </p>
            <p className="mt-1 text-sm font-medium text-teal-accent-light">
              {t("monthly.savings")}
            </p>
            <p className="mt-3 text-base leading-relaxed text-text-secondary">
              {t("monthly.description")}
            </p>
            <div className="mt-6">
              {/* S'abonner — entry variant, blue solid, rounded-xl */}
              <Button variant="entry" href="#" className="w-full">
                {t("monthly.cta")}
              </Button>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
