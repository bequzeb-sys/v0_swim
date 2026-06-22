import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { CoachesGrid } from "@/components/coaches-grid"
import { FooterCTA } from "@/components/footer-cta"
import { UnderwaterBackground } from "@/components/underwater-background"

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <UnderwaterBackground />
      <Header />
      <main className="relative z-10">
        <Hero />
        <CoachesGrid />
        <FooterCTA />
      </main>
    </div>
  )
}
