import { ChevronRight, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

export function FooterCTA() {
  const t = useTranslations("footer")

  return (
    <section className="relative px-6 pb-12 pt-4">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 rounded-3xl border border-blue-300/20 bg-blue-400/[8%] px-5 py-6 shadow-xl shadow-black/20 backdrop-blur-md sm:flex-row sm:items-center sm:px-7">
        <div className="flex items-start gap-4 sm:items-center">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-teal-accent/15 text-teal-accent shadow-lg shadow-teal-accent/20">
            <MessageCircle className="size-6" />
          </span>
          <p className="text-base text-white sm:text-lg">{t("text")}</p>
        </div>
        {/* Primary CTA — "Essayez gratuitement", teal, rounded-xl */}
        <Button variant="primary" href="#search" iconRight={ChevronRight}>
          {t("cta")}
        </Button>
      </div>
    </section>
  )
}
