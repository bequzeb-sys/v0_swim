import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { CoachesGrid } from "@/components/coaches-grid"
import { Testimonial } from "@/components/testimonial"
import { HowItWorks } from "@/components/how-it-works"
import { Pricing } from "@/components/pricing"
import { ForCoaches } from "@/components/for-coaches"
import { FooterCTA } from "@/components/footer-cta"
import { UnderwaterBackground } from "@/components/underwater-background"

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
    </div>
  )
}
