import { useTranslations } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { SecondaryPageHeader } from "@/components/secondary-page-header"

export async function generateMetadata() {
  const t = await getTranslations("siteFooter.legalPages.mentionsLegales")
  return { title: t("metaTitle") }
}

export default async function MentionsLegalesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return <MentionsLegalesContent />
}

function MentionsLegalesContent() {
  const t = useTranslations("siteFooter.legalPages.mentionsLegales")
  return (
    <>
      <SecondaryPageHeader />
      <main className="relative mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-white md:text-4xl">{t("title")}</h1>
      <p className="mt-2 text-sm text-white/50">{t("subtitle")}</p>

      <Section title={t("sections.editor.title")}>
        <p>{t("sections.editor.line1")}</p>
        <p>{t("sections.editor.line2")}</p>
        <p>{t("sections.editor.line3")}</p>
        <p>{t("sections.editor.line4")}</p>
      </Section>

      <Section title={t("sections.hosting.title")}>
        <p>{t("sections.hosting.line1")}</p>
        <p>{t("sections.hosting.line2")}</p>
        <p>{t("sections.hosting.line3")}</p>
      </Section>

      <Section title={t("sections.intellectual.title")}>
        <p>{t("sections.intellectual.p1")}</p>
        <p>{t("sections.intellectual.p2")}</p>
      </Section>

      <Section title={t("sections.contact.title")}>
        <p>{t("sections.contact.body")}</p>
      </Section>

      <p className="mt-12 text-xs text-white/40">{t("inDev")}</p>
    </main>
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
