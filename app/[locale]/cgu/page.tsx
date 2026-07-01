import { useTranslations } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { SecondaryPageHeader } from "@/components/secondary-page-header"
import { Footer } from "@/components/footer"

export async function generateMetadata() {
  const t = await getTranslations("siteFooter.legalPages.cgu")
  return { title: t("metaTitle") }
}

export default async function CGUPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return <CGUContent />
}

function CGUContent() {
  const t = useTranslations("siteFooter.legalPages.cgu")
  return (
    <>
      <SecondaryPageHeader />
      <main className="relative mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-white md:text-4xl">{t("title")}</h1>
      <p className="mt-2 text-sm text-white/50">{t("subtitle")}</p>

      <Section title={t("sections.scope.title")}>
        <p>{t("sections.scope.body")}</p>
      </Section>

      <Section title={t("sections.services.title")}>
        <p>{t("sections.services.p1")}</p>
        <p>{t("sections.services.p2")}</p>
      </Section>

      <Section title={t("sections.account.title")}>
        <p>{t("sections.account.body")}</p>
      </Section>

      <Section title={t("sections.booking.title")}>
        <p>{t("sections.booking.body")}</p>
      </Section>

      <Section title={t("sections.ai.title")}>
        <p>{t("sections.ai.body")}</p>
      </Section>

      <Section title={t("sections.liability.title")}>
        <p>{t("sections.liability.body")}</p>
      </Section>

      <p className="mt-12 text-xs text-white/40">{t("inDev")}</p>
    </main>
    <Footer />
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-3 flex flex-col gap-3 text-sm leading-relaxed text-white/75">
        {children}
      </div>
    </section>
  )
}
