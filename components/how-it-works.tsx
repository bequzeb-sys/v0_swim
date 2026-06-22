import { useTranslations } from "next-intl"

export function HowItWorks() {
  const t = useTranslations("howItWorks")

  const steps = [
    { key: "step1", number: "1" },
    { key: "step2", number: "2" },
    { key: "step3", number: "3" },
  ] as const

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

        <ol className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.key}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
            >
              <span
                aria-hidden="true"
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-teal-accent/15 text-lg font-bold text-teal-accent shadow-lg shadow-teal-accent/20"
              >
                {step.number}
              </span>
              <h3 className="mt-5 text-lg font-bold text-white sm:text-xl">
                {t(`steps.${step.key}.title`)}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-text-secondary">
                {t(`steps.${step.key}.description`)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
