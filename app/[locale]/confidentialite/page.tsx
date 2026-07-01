import { useTranslations } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { SecondaryPageHeader } from "@/components/secondary-page-header"
import { Footer } from "@/components/footer"

export async function generateMetadata() {
  const t = await getTranslations("siteFooter.legalPages.confidentialite")
  return { title: t("metaTitle") }
}

export default async function ConfidentialitePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return <ConfidentialiteContent />
}

function ConfidentialiteContent() {
  const t = useTranslations("siteFooter.legalPages.confidentialite")
  return (
    <>
      <SecondaryPageHeader />
      <main className="relative mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-white md:text-4xl">{t("title")}</h1>
      <p className="mt-2 text-sm text-white/50">{t("subtitle")}</p>

      <Section title={t("sections.controller.title")}>
        <p>{t("sections.controller.line1")}</p>
        <p>{t("sections.controller.line2")}</p>
      </Section>

      <Section title={t("sections.dataCollected.title")}>
        <p>{t("sections.dataCollected.body")}</p>
      </Section>

      <Section title={t("sections.purpose.title")}>
        <p>{t("sections.purpose.body")}</p>
      </Section>

      <Section title={t("sections.hosting.title")}>
        <p>{t("sections.hosting.body")}</p>
      </Section>

      <Section title={t("sections.rights.title")}>
        <p>{t("sections.rights.body")}</p>
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
