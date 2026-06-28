import {
  Search,
  Calendar,
  MessageCircle,
  Sparkles,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

const BENEFITS = [
  { key: "b1", Icon: Search },
  { key: "b2", Icon: Calendar },
  { key: "b3", Icon: MessageCircle },
  { key: "b4", Icon: Sparkles },
  { key: "b5", Icon: Shield },
] as const

export function ForCoaches() {
  const t = useTranslations("forCoaches")

  return (
    <section id="coaches-pro" className="relative scroll-mt-24 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-text-secondary">
            {t("subtitle")}
          </p>
        </div>

        {/* Featured callout — teal border-left, visually distinct headline benefit */}
        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-teal-accent/40 bg-gradient-to-r from-teal-accent/15 via-teal-accent/5 to-transparent p-6 backdrop-blur-md md:p-7">
          <div className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-accent/20 text-teal-accent shadow-lg shadow-teal-accent/30"
            >
              <Sparkles className="size-5" />
            </span>
            <p className="text-base font-semibold leading-relaxed text-white md:text-lg">
              {t("callout")}
            </p>
          </div>
        </div>

        {/* Benefits grid — 5 columns at md+, 2 at sm, 1 at base */}
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {BENEFITS.map(({ key, Icon }) => (
            <li
              key={key}
              className="flex flex-col rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-5 shadow-xl shadow-black/20 backdrop-blur-md"
            >
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-accent/15 text-teal-accent shadow-md shadow-teal-accent/15"
              >
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-white">
                {t(`benefits.${key}.title`)}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                {t(`benefits.${key}.description`)}
              </p>
            </li>
          ))}
        </ul>

        {/* CTA — documented exception: "Devenir coach" intentionally href="#" pending signup infra */}
        <div className="mt-10 flex justify-center">
          <Button variant="entry" href="#">
            {t("cta")}
          </Button>
        </div>
      </div>
    </section>
  )
}