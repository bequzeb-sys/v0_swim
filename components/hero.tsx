import { Star } from "lucide-react"
import { SearchBar } from "@/components/search-bar"
import { useTranslations } from "next-intl"

export function Hero() {
  const t = useTranslations("hero")

  return (
    <section className="relative px-6 pb-12 pt-8 md:pt-10">
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="text-balance text-5xl font-extrabold leading-[0.98] tracking-tight text-white sm:text-6xl md:text-7xl">
          {t("title1")}
          <br />
          {t("title2")}
        </h1>
        <p className="mx-auto mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-text-secondary md:text-xl">
          {t("subtitle1")}
          <br />
          {t("subtitle2")}
        </p>

        {/* Trust strip — single line, centered, small muted text, real Star icon */}
        <p className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-text-secondary">
          <span>{t("trust.launch")}</span>
          <span aria-hidden="true">·</span>
          <span>{t("trust.certified")}</span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1.5">
            {t("trust.rating")}
            <span className="inline-flex items-center gap-0.5 text-white">
              <Star
                className="size-3.5 shrink-0 fill-star-gold text-star-gold"
                aria-hidden="true"
              />
              {t("trust.ratingValue")}
            </span>
          </span>
        </p>
      </div>

      <div className="mt-10">
        <SearchBar />
      </div>
    </section>
  )
}