import { Check } from "lucide-react"
import { useTranslations } from "next-intl"

export function ForCoaches() {
  const t = useTranslations("forCoaches")

  const bullets = ["b1", "b2", "b3"] as const

  return (
    <section id="coaches-pro" className="relative scroll-mt-24 px-6 py-16">
      <div className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md md:p-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-text-secondary">
            {t("subtitle")}
          </p>
        </div>

        <ul className="mx-auto mt-10 flex max-w-2xl flex-col gap-4">
          {bullets.map((key) => (
            <li key={key} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-teal-accent/15 text-teal-accent shadow-md shadow-teal-accent/20"
              >
                <Check className="size-4" strokeWidth={3} />
              </span>
              <span className="text-base font-medium text-white sm:text-lg">
                {t(`bullets.${key}`)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <a
            href="#"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-accent to-blue-accent-dark px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-accent/30 transition-opacity hover:opacity-90"
          >
            {t("cta")}
          </a>
        </div>
      </div>
    </section>
  )
}
