import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

const CLIENT_BULLETS = ["b1", "b2", "b3"] as const
const COACH_BULLETS = ["b1", "b2", "b3"] as const

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
          {/* For clients — booking is free */}
          <article className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md md:p-8">
            <span
              aria-hidden="true"
              className="inline-flex w-fit items-center gap-1.5 rounded-full border border-teal-accent/30 bg-teal-accent/10 px-3 py-1 text-xs font-bold text-teal-accent"
            >
              {t("client.audience")}
            </span>
            <h3 className="mt-5 text-4xl font-extrabold leading-tight text-white md:text-5xl">
              {t("client.headline")}
            </h3>
            <p className="mt-2 text-base font-medium text-text-secondary">
              {t("client.subheadline")}
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {CLIENT_BULLETS.map((key) => (
                <li key={key} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-teal-accent/15 text-teal-accent"
                  >
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-base leading-relaxed text-white">
                    {t(`client.bullets.${key}`)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-text-secondary">
              {t("client.optional")}
            </p>
            <div className="mt-6 grow" />
            <Button variant="entry" href="#search" className="mt-6 w-full">
              {t("client.cta")}
            </Button>
          </article>

          {/* For coaches — free until 3 confirmed bookings */}
          <article className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md md:p-8">
            <span
              aria-hidden="true"
              className="inline-flex w-fit items-center gap-1.5 rounded-full border border-blue-accent/30 bg-blue-accent/10 px-3 py-1 text-xs font-bold text-blue-accent"
            >
              {t("coach.audience")}
            </span>
            <h3 className="mt-5 text-2xl font-extrabold leading-tight text-white md:text-3xl">
              {t("coach.headline")}
            </h3>
            <p className="mt-2 text-base font-medium text-text-secondary">
              {t("coach.subheadline")}
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {COACH_BULLETS.map((key) => (
                <li key={key} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-teal-accent/15 text-teal-accent"
                  >
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-base leading-relaxed text-white">
                    {t(`coach.bullets.${key}`)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-text-secondary">
              {t("coach.optional")}
            </p>
            <div className="mt-6 grow" />
            {/* Documented exception: "Devenir coach" CTA is intentionally href="#" pending signup infra */}
            <Button variant="entry" href="#" className="mt-6 w-full">
              {t("coach.cta")}
            </Button>
          </article>
        </div>
      </div>
    </section>
  )
}