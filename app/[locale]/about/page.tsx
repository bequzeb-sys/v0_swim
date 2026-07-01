import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { useTranslations } from "next-intl"
import { UnderwaterBackground } from "@/components/underwater-background"
import { SecondaryPageHeader } from "@/components/secondary-page-header"
import { Footer } from "@/components/footer"
import { Waves, Target, Users, Zap } from "lucide-react"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "about" })
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "about" })

  return (
    <>
      <UnderwaterBackground />
      <SecondaryPageHeader />
      <main className="relative z-10 mx-auto max-w-3xl px-6 pb-24 pt-12">

        {/* Badge */}
        <div className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-accent/30 bg-teal-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-teal-accent">
            <Waves className="size-3.5" aria-hidden="true" />
            {t("badge")}
          </span>
        </div>

        {/* Hero */}
        <h1 className="mb-6 text-center text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl" style={{ whiteSpace: "pre-line" }}>
          {t("hero")}
        </h1>
        <p className="mx-auto mb-16 max-w-xl text-center text-base leading-relaxed text-white/60 md:text-lg">
          {t("heroSub")}
        </p>

        {/* Story sections */}
        <div className="flex flex-col gap-10">
          {[
            { title: t("section1Title"), body: t("section1Body") },
            { title: t("section2Title"), body: t("section2Body") },
            { title: t("section3Title"), body: t("section3Body") },
          ].map(({ title, body }) => (
            <div key={title} className="rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-8 shadow-xl shadow-black/20 backdrop-blur-md">
              <h2 className="mb-3 text-lg font-bold text-white">{title}</h2>
              <p className="text-sm leading-relaxed text-white/60">{body}</p>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="mt-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">{t("valuesTitle")}</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { icon: <Users className="size-5 text-teal-accent" aria-hidden="true" />, title: t("value1Title"), body: t("value1Body") },
              { icon: <Target className="size-5 text-teal-accent" aria-hidden="true" />, title: t("value2Title"), body: t("value2Body") },
              { icon: <Zap className="size-5 text-teal-accent" aria-hidden="true" />, title: t("value3Title"), body: t("value3Body") },
            ].map(({ icon, title, body }) => (
              <div key={title} className="rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-6 shadow-xl shadow-black/20 backdrop-blur-md">
                <div className="mb-3 flex size-10 items-center justify-center rounded-md bg-teal-accent/10">
                  {icon}
                </div>
                <h3 className="mb-2 text-sm font-bold text-white">{title}</h3>
                <p className="text-xs leading-relaxed text-white/50">{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Coming soon */}
        <div className="mt-16 rounded-3xl border border-teal-accent/30 bg-gradient-to-br from-teal-accent/10 via-teal-accent/5 to-transparent p-10 text-center shadow-xl shadow-black/20 backdrop-blur-md">
          <Waves className="mx-auto mb-4 size-8 text-teal-accent" aria-hidden="true" />
          <h2 className="mb-2 text-xl font-bold text-white">{t("comingSoonTitle")}</h2>
          <p className="mb-6 text-sm text-white/50">{t("comingSoonBody")}</p>
          <a
            href="mailto:hello@swimai.app"
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-teal-accent px-6 py-3 text-sm font-semibold text-navy-deep transition-opacity hover:opacity-90 active:scale-[0.98] active:opacity-90"
          >
            {t("comingSoonCta")}
          </a>
        </div>

      </main>
      <Footer />
    </>
  )
}
