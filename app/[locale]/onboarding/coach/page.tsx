"use client"

import { useState, useRef } from "react"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useCoachOnboardingStore } from "@/lib/stores/onboarding-coach-store"
import type { CoachBadgeKey } from "@/types/coach"
import { OnboardingShell } from "@/components/onboarding/onboarding-shell"
import { Button } from "@/components/ui/button"

const SPECIALTIES: CoachBadgeKey[] = [
  "apprentissage",
  "aquagym",
  "aquaphobie",
  "bebeNageur",
  "competition",
  "eauLibre",
  "natationAdaptee",
  "natationPalmes",
  "perfectionnement",
  "sauvetageAquatique",
  "triathlon",
]

// 4 specialties per slide — 3 slides of content
const SLIDES: CoachBadgeKey[][] = [
  SPECIALTIES.slice(0, 4),
  SPECIALTIES.slice(4, 8),
  SPECIALTIES.slice(8, 11),
]
const FEATURED_SLIDE_INDEX = SLIDES.length // index 3

export default function CoachOnboardingStep1() {
  const t = useTranslations("onboarding.coach")
  const tSpecialty = useTranslations("onboarding.coach.specialty")
  const tStep = useTranslations("onboarding.step")
  const router = useRouter()
  const { data, setStep1 } = useCoachOnboardingStore()

  const [selected, setSelected] = useState<Set<CoachBadgeKey>>(
    new Set(data.badgeKeys as CoachBadgeKey[])
  )
  const [featuredKeys, setFeaturedKeys] = useState<CoachBadgeKey[]>(data.featuredBadgeKeys)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(1)
  const touchStartX = useRef<number | null>(null)

  const totalSlides = SLIDES.length + 1 // content slides + featured slide
  const isFeaturedSlide = currentSlide === FEATURED_SLIDE_INDEX
  const canGoToFeatured = selected.size > 0
  const canGoNext = currentSlide < FEATURED_SLIDE_INDEX - 1 ||
    (currentSlide === FEATURED_SLIDE_INDEX - 1 && canGoToFeatured)
  const canGoBack = currentSlide > 0

  function goTo(index: number, dir: number) {
    setDirection(dir)
    setCurrentSlide(index)
  }

  function handleNext() {
    if (currentSlide < FEATURED_SLIDE_INDEX) goTo(currentSlide + 1, 1)
  }

  function handleBack() {
    if (currentSlide > 0) goTo(currentSlide - 1, -1)
  }

  function toggleSpecialty(key: CoachBadgeKey) {
    const next = new Set(selected)
    if (next.has(key)) {
      next.delete(key)
      setFeaturedKeys(featuredKeys.filter((k) => k !== key))
    } else {
      next.add(key)
    }
    setSelected(next)
  }

  function toggleFeatured(key: CoachBadgeKey) {
    if (featuredKeys.includes(key)) {
      setFeaturedKeys(featuredKeys.filter((k) => k !== key))
    } else if (featuredKeys.length < 2) {
      setFeaturedKeys([...featuredKeys, key])
    }
  }

  function handleContinue() {
    if (selected.size === 0) return
    setStep1(Array.from(selected), featuredKeys)
    router.push("/onboarding/coach/profile")
  }

  // Touch swipe handlers
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

  return (
    <OnboardingShell current={1} total={4}>
      <div className="mb-6 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
          {tStep("of", { current: 1, total: 4 })}
        </p>
        <div className="mb-4 flex items-center justify-center gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 w-2 rounded-full transition-all duration-300",
                i === 0 ? "w-6 bg-teal-accent" : "bg-white/20"
              )}
            />
          ))}
        </div>
        <h1 className="text-2xl font-bold text-white">{t("step1Title")}</h1>
        <p className="mt-1 text-sm text-white/50">{t("step1Subtitle")}</p>
      </div>

        {/* Slide container */}
        <div
          className="overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait" custom={direction}>
            {!isFeaturedSlide ? (
              <motion.div
                key={`slide-${currentSlide}`}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {/* Slide label */}
                <p className="mb-4 text-xs font-medium uppercase tracking-widest text-white/30">
                  {currentSlide + 1} / {SLIDES.length}
                </p>

                {/* Specialty cards grid */}
                <div className="grid grid-cols-2 gap-3">
                  {SLIDES[currentSlide].map((key) => {
                    const isSelected = selected.has(key)
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleSpecialty(key)}
                        className={cn(
                          "relative cursor-pointer rounded-xl border p-4 text-left transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
                          isSelected
                            ? "border-teal-accent/40 bg-teal-accent/10"
                            : "border-white/10 bg-white/5 hover:border-teal-accent/20 hover:bg-teal-accent/5"
                        )}
                      >
                        {isSelected && (
                          <div className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-teal-accent">
                            <Check className="size-3 text-navy-deep" aria-hidden="true" />
                          </div>
                        )}
                        <p className={cn(
                          "text-sm font-medium",
                          isSelected ? "text-teal-accent" : "text-white/70"
                        )}>
                          {tSpecialty(key)}
                        </p>
                      </button>
                    )
                  })}
                </div>

                {/* Selected count */}
                {selected.size > 0 && (
                  <p className="mt-4 text-center text-xs text-white/40">
                    {selected.size} {t("selectedCount")}
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="featured"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {/* Featured slide */}
                <p className="mb-1 text-base font-semibold text-white">{t("featuredTitle")}</p>
                <p className="mb-4 text-xs text-white/40">
                  {t("featuredSubtitle")} ({featuredKeys.length}/2)
                </p>

                <div className="flex flex-wrap gap-2">
                  {Array.from(selected).map((key) => {
                    const isFeatured = featuredKeys.includes(key)
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleFeatured(key)}
                        className={cn(
                          "cursor-pointer rounded-xl border px-3 py-2 text-sm font-medium transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
                          isFeatured
                            ? "border-teal-accent bg-teal-accent text-navy-deep"
                            : "border-white/20 bg-white/5 text-white/60 hover:border-teal-accent/40 hover:text-white"
                        )}
                      >
                        {isFeatured && "★ "}{tSpecialty(key)}
                      </button>
                    )
                  })}
                </div>

                {featuredKeys.length === 0 && (
                  <p className="mt-4 text-xs text-white/30">{t("featuredHint")}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation arrows + Continue */}
        <div className="mt-6 flex items-center gap-3">
          {/* Back arrow */}
          <button
            type="button"
            onClick={handleBack}
            disabled={!canGoBack}
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition-colors hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>

          {/* Continue or Next */}
          {isFeaturedSlide ? (
            <Button
              type="button"
              variant="entry"
              onClick={handleContinue}
              disabled={selected.size === 0}
              className="flex-1"
            >
              {tSpecialty("continue")}
            </Button>
          ) : (
            <Button
              type="button"
              variant="entry"
              onClick={handleNext}
              disabled={!canGoNext}
              className="flex-1"
            >
              {t("next")}
            </Button>
          )}

          {/* Next arrow */}
          <button
            type="button"
            onClick={handleNext}
            disabled={!canGoNext || isFeaturedSlide}
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition-colors hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>
    </OnboardingShell>
  )
}
