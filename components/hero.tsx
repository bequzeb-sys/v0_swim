import { SearchBar } from "@/components/search-bar"
import { useTranslations } from "next-intl"

export function Hero() {
  const t = useTranslations("hero")

  return (
    <section className="relative px-6 pb-12 pt-36 md:pt-44">
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
      </div>

      <div className="mt-12">
        <SearchBar />
      </div>
    </section>
  )
}
