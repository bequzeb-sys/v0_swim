"use client"

import { useRef, useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { OnboardingShell } from "@/components/onboarding/onboarding-shell"
import { useClientOnboardingStore } from "@/lib/stores/onboarding-client-store"
import type { ClientLevel } from "@/types/client"

const LEVELS: ClientLevel[] = ["beginner", "intermediate", "advanced"]

const TOTAL_SLIDES = 2

interface LevelCardProps {
  level: ClientLevel
  label: string
  description: string
  selected: boolean
  onClick: () => void
}

function LevelCard({ level, label, description, selected, onClick }: LevelCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-xl border p-4 text-left transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
        selected
          ? "border-teal-accent/40 bg-teal-accent/10"
          : "border-white/10 bg-white/[4%] hover:border-teal-accent/20 hover:bg-white/[6%]"
      )}
    >
      <p className={cn("text-sm font-semibold", selected ? "text-white" : "text-white/70")}>{label}</p>
      <p className="mt-0.5 text-xs text-white/40">{description}</p>
    </button>
  )
}

export default function OnboardingClientStep2() {
  const t = useTranslations("onboarding.client.location")
  const tStep = useTranslations("onboarding.step")
  const router = useRouter()
  const { data, setStep2 } = useClientOnboardingStore()

  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(1)
  const touchStartX = useRef<number | null>(null)

  const [location, setLocation] = useState(data.location)
  const [level, setLevel] = useState<ClientLevel | null>(data.level)

  const slideValid = [
    location.trim().length > 0,
    level !== null,
  ]

  const canGoNext = slideValid[currentSlide]
  const canGoBack = currentSlide > 0
  const isLastSlide = currentSlide === TOTAL_SLIDES - 1

  function goTo(index: number, dir: number) {
    setDirection(dir)
    setCurrentSlide(index)
  }

  function handleNext() {
    if (currentSlide < TOTAL_SLIDES - 1 && canGoNext) goTo(currentSlide + 1, 1)
  }

  function handleBack() {
    if (currentSlide > 0) goTo(currentSlide - 1, -1)
  }

  function handleContinue() {
    if (!level) return
    setStep2(location, level)
    router.push("/onboarding/client/done")
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > 50) {
      if (delta > 0 && canGoNext) handleNext()
      if (delta < 0 && canGoBack) handleBack()
    }
    touchStartX.current = null
  }

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  }

  const slides = [
    // Slide 0 — Location
    <motion.div key="location" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: "easeInOut" }}>
      <h2 className="mb-1 text-base font-semibold text-white">{t("locationLabel")}</h2>
      <p className="mb-4 text-xs text-white/40">{t("subtitle")}</p>
      <Input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder={t("locationPlaceholder")}
        autoFocus
      />
    </motion.div>,

    // Slide 1 — Level
    <motion.div key="level" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: "easeInOut" }}>
      <h2 className="mb-1 text-base font-semibold text-white">{t("levelLabel")}</h2>
      <p className="mb-4 text-xs text-white/40">{t("levelSubtitle")}</p>
      <div className="flex flex-col gap-3">
        {LEVELS.map((lvl) => (
          <LevelCard
            key={lvl}
            level={lvl}
            label={t(`level${lvl.charAt(0).toUpperCase() + lvl.slice(1)}` as any)}
            description={t(`level${lvl.charAt(0).toUpperCase() + lvl.slice(1)}Desc` as any)}
            selected={level === lvl}
            onClick={() => setLevel(lvl)}
          />
        ))}
      </div>
    </motion.div>,
  ]

  return (
    <OnboardingShell current={2} total={3}>
      {/* Step indicator */}
      <div className="mb-6 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
          {tStep("of", { current: 2, total: 3 })}
        </p>
        <div className="mb-4 flex items-center justify-center gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === 1 ? "w-6 bg-teal-accent"
                : i < 1 ? "w-2 bg-teal-accent/40"
                : "w-2 bg-white/20"
              )}
            />
          ))}
        </div>
        <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
      </div>

      {/* Slides */}
      <div
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait" custom={direction}>
          {slides[currentSlide]}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={handleBack}
          disabled={!canGoBack}
          className="inline-flex size-11 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition-colors hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>

        {isLastSlide ? (
          <Button variant="entry" onClick={handleContinue} disabled={!canGoNext} className="flex-1">
            {t("continue")}
          </Button>
        ) : (
          <Button variant="entry" onClick={handleNext} disabled={!canGoNext} className="flex-1">
            {t("next")}
          </Button>
        )}

        <button
          type="button"
          onClick={handleNext}
          disabled={!canGoNext || isLastSlide}
          className="inline-flex size-11 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition-colors hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
      </div>
    </OnboardingShell>
  )
}
