import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { CoachesGrid } from "@/components/coaches-grid"
import { Testimonial } from "@/components/testimonial"
import { HowItWorks } from "@/components/how-it-works"
import { Pricing } from "@/components/pricing"
import { ForCoaches } from "@/components/for-coaches"
import { FooterCTA } from "@/components/footer-cta"
import { Footer } from "@/components/footer"
import { UnderwaterBackground } from "@/components/underwater-background"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "seo" })
  return {
    title: t("homeTitle"),
    description: t("homeDescription"),
  }
}

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background">
      <UnderwaterBackground />
      <Header />
      <main className="relative z-10">
        <Hero />
        <CoachesGrid />
        <Testimonial />
        <HowItWorks />
        <Pricing />
        <ForCoaches />
        <FooterCTA />
      </main>
      <Footer />
    </div>
  )
}
