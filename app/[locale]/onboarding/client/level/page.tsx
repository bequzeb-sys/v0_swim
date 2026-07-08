"use client"

import { useState, useRef } from "react"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, Sprout, TrendingUp, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { OnboardingShell } from "@/components/onboarding/onboarding-shell"
import { useClientOnboardingStore } from "@/lib/stores/onboarding-client-store"
import type { ClientLevel } from "@/types/client"
import * as Flags from "country-flag-icons/react/3x2"

const LEVELS: ClientLevel[] = ["beginner", "intermediate", "advanced"]

const LANGUAGES = ["fr", "en", "es", "de", "it", "pt", "ar", "zh", "ru", "ja"]

const TOTAL_SLIDES = 2

function LevelIcon({ level, className }: { level: ClientLevel; className?: string }) {
  switch (level) {
    case "beginner": return <Sprout className={className} aria-hidden="true" />
    case "intermediate": return <TrendingUp className={className} aria-hidden="true" />
    case "advanced": return <Trophy className={className} aria-hidden="true" />
  }
}

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
        "relative flex cursor-pointer items-center gap-4 rounded-xl border p-4 text-left transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
        selected
          ? "border-teal-accent/40 bg-teal-accent/10"
          : "border-white/10 bg-white/[4%] hover:border-teal-accent/20 hover:bg-white/[6%]"
      )}
    >
      <div className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors",
        selected ? "bg-teal-accent/20" : "bg-teal-accent/10"
      )}>
        <LevelIcon level={level} className={cn("size-5", selected ? "text-teal-accent" : "text-teal-accent/60")} />
      </div>
      <div className="flex-1">
        <p className={cn("text-sm font-semibold", selected ? "text-white" : "text-white/70")}>{label}</p>
        <p className="mt-0.5 text-xs text-white/40">{description}</p>
      </div>
      {selected && (
        <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-teal-accent">
          <svg className="size-3" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="#0a1f3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </button>
  )
}

export default function OnboardingClientStep4() {
  const t = useTranslations("onboarding.client.level")
  const tStep = useTranslations("onboarding.step")
  const tLanguages = useTranslations("languages")
  const router = useRouter()
  const { data, setStep4 } = useClientOnboardingStore()

  const [slide, setSlide] = useState(0)
  const [direction, setDirection] = useState(1)
  const [level, setLevel] = useState<ClientLevel | null>(data.level)
  const [languages, setLanguages] = useState<string[]>(data.languages?.length ? data.languages : ["fr"])

  const touchStartX = useRef<number | null>(null)

  function toggleLanguage(lang: string) {
    setLanguages((prev) => {
      if (prev.includes(lang)) return prev.filter((l) => l !== lang)
      if (prev.length >= 4) return prev
      return [...prev, lang]
    })
  }

  const slideValid = [
    level !== null,
    languages.length > 0,
  ]

  function handleNext() {
    if (slide < TOTAL_SLIDES - 1 && slideValid[slide]) {
      setDirection(1)
      setSlide((s) => s + 1)
    } else if (slide === TOTAL_SLIDES - 1 && slideValid[slide]) {
      setStep4(level!, languages)
      router.push("/onboarding/client/goal")
    }
  }

  function handleBack() {
    if (slide > 0) {
      setDirection(-1)
      setSlide((s) => s - 1)
    } else {
      router.push("/onboarding/client/location")
    }
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) > 50) {
      if (delta < 0 && slideValid[slide]) handleNext()
      else if (delta > 0) handleBack()
    }
    touchStartX.current = null
  }

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%" }),
    center: { x: 0 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%" }),
  }

  return (
    <OnboardingShell current={4} total={5}>
      <div className="mb-6 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
          {tStep("of", { current: 4, total: 5 })}
        </p>
        <div className="mb-4 flex items-center justify-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={cn(
              "h-2 rounded-full transition-all duration-300",
              i < 4 ? "w-6 bg-teal-accent"
              : "w-2 bg-white/20"
            )} />
          ))}
        </div>
        <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
        <p className="mt-1 text-sm text-white/50">{t("subtitle")}</p>
      </div>

      {/* Carousel */}
      <div
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {slide === 0 && (
              <div className="flex flex-col gap-3">
                {LEVELS.map((lvl) => (
                  <LevelCard
                    key={lvl}
                    level={lvl}
                    label={t(`${lvl}Label`)}
                    description={t(`${lvl}Desc`)}
                    selected={level === lvl}
                    onClick={() => setLevel(lvl)}
                  />
                ))}
              </div>
            )}

            {slide === 1 && (
              <div>
                <p className="mb-1 text-xs font-medium text-white/50">{t("languagesTitle")}</p>
                <p className="mb-4 text-xs text-white/40">
                  {t("languagesSubtitle")} <span className={cn("font-medium", languages.length >= 4 ? "text-teal-accent" : "text-white/30")}>{languages.length}/4</span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map((lang) => {
                    const Flag = (Flags as unknown as Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>>)[lang.toUpperCase()]
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleLanguage(lang)}
                        className={cn(
                          "flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
                          languages.includes(lang)
                            ? "border-teal-accent/40 bg-teal-accent/10 text-white"
                            : "border-white/10 bg-white/[4%] text-white/50 hover:border-white/20 hover:text-white"
                        )}
                      >
                        {Flag && <Flag className="size-4 shrink-0 rounded-sm" aria-hidden="true" />}
                        <span>{tLanguages(lang as Parameters<typeof tLanguages>[0])}</span>
                        {languages.includes(lang) && (
                          <svg className="ml-auto size-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={handleBack}
          className="flex cursor-pointer items-center gap-1 text-sm text-white/50 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </button>
        <Button
          variant="entry"
          onClick={handleNext}
          disabled={!slideValid[slide]}
          className="flex-1"
        >
          {slide === TOTAL_SLIDES - 1 ? t("continue") : t("next")}
        </Button>
      </div>
    </OnboardingShell>
  )
}
