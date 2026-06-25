import { MessageCircle, Dumbbell, Apple, Brain } from "lucide-react"
import { useTranslations } from "next-intl"

const STEP3_FEATURES = [
  { key: "chat", Icon: MessageCircle },
  { key: "programs", Icon: Dumbbell },
  { key: "nutrition", Icon: Apple },
  { key: "mental", Icon: Brain },
] as const

export function HowItWorks() {
  const t = useTranslations("howItWorks")

  return (
    <section id="how" className="relative scroll-mt-24 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-text-secondary">
            {t("subtitle")}
          </p>
        </div>

        {/* Steps 1 & 2 — equal-weight side-by-side cards */}
        <ol className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {(["step1", "step2"] as const).map((key, i) => (
            <li
              key={key}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
            >
              <span
                aria-hidden="true"
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-teal-accent/15 text-lg font-bold text-teal-accent shadow-lg shadow-teal-accent/20"
              >
                {i + 1}
              </span>
              <h3 className="mt-5 text-lg font-bold text-white sm:text-xl">
                {t(`steps.${key}.title`)}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-text-secondary">
                {t(`steps.${key}.description`)}
              </p>
            </li>
          ))}
        </ol>

        {/* Step 3 — full-width featured differentiator with sub-feature pills */}
        <div className="mt-6 rounded-2xl border border-teal-accent/30 bg-gradient-to-br from-white/5 via-white/5 to-teal-accent/10 p-6 backdrop-blur-md md:p-8">
          <div className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-teal-accent/20 text-lg font-bold text-teal-accent shadow-lg shadow-teal-accent/30"
            >
              3
            </span>
            <h3 className="text-lg font-bold text-white sm:text-xl md:text-2xl">
              {t("steps.step3.title")}
            </h3>
          </div>
          <p className="mt-4 text-base leading-relaxed text-text-secondary md:text-lg">
            {t("steps.step3.description")}
          </p>

          {/* Sub-feature pills — chat / programs / nutrition / mental */}
          <ul className="mt-6 flex flex-wrap gap-2">
            {STEP3_FEATURES.map(({ key, Icon }) => (
              <li
                key={key}
                className="inline-flex items-center gap-2 rounded-xl border border-teal-accent/30 bg-teal-accent/10 px-3 py-1.5 text-sm font-medium text-teal-accent-light"
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                {t(`steps.step3.features.${key}`)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}