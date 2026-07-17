"use client"

import { useState, useRef } from "react"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { ChevronLeft, ChevronRight, User, MapPin, Euro, Award, Languages, ChevronDown, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useCoachOnboardingStore } from "@/lib/stores/onboarding-coach-store"
import type { LanguageCode } from "@/types/coach"
import * as Flags from "country-flag-icons/react/3x2"
import { OnboardingShell } from "@/components/onboarding/onboarding-shell"
import { Popover } from "@base-ui/react/popover"
import { COUNTRIES } from "@/lib/countries"

// Available languages — labels resolved via the existing `languages` namespace
// at runtime so we never hardcode user-visible strings.
const LANGUAGE_CODES: LanguageCode[] = [
  "fr",
  "en",
  "es",
  "de",
  "it",
  "pt",
  "ar",
  "zh",
  "ru",
  "ja",
]

// ISO codes for the flag icon library. These differ from LanguageCode in two
// cases (en → GB, ja → JP) because the language enum is the *language*, the
// flag shows a *country representative*.
const LANGUAGE_FLAG: Record<LanguageCode, string> = {
  fr: "FR",
  en: "GB",
  es: "ES",
  de: "DE",
  it: "IT",
  pt: "PT",
  ar: "SA",
  zh: "CN",
  ru: "RU",
  ja: "JP",
}

const TOTAL_SLIDES = 5

type FlagComponent = React.ComponentType<{
  className?: string
  style?: React.CSSProperties
}>

function getFlag(code: string): FlagComponent | null {
  const F = (Flags as unknown as Record<string, FlagComponent | undefined>)[code]
  return F ?? null
}

export default function CoachOnboardingStep2() {
  const t = useTranslations("onboarding.coach.profile")
  const tSearch = useTranslations("search")
  const tLanguages = useTranslations("languages")
  const tStep = useTranslations("onboarding.step")
  const router = useRouter()
  const { data, setStep2 } = useCoachOnboardingStore()

  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(1)
  const [countryOpen, setCountryOpen] = useState(false)
  const touchStartX = useRef<number | null>(null)

  // Field state — initialized from store
  const [bio, setBio] = useState(data.bio)
  const [city, setCity] = useState(data.city)
  const [country, setCountry] = useState(data.country || "FR")
  const [price, setPrice] = useState(data.price)
  const [certification, setCertification] = useState(data.certification)
  const [selectedLanguages, setSelectedLanguages] = useState<LanguageCode[]>(data.languages)

  // Validation per slide
  const slideValid = [
    bio.trim().length >= 20,
    city.trim().length > 0 && !!country,
    price.trim().length > 0 && !Number.isNaN(Number(price)) && Number(price) > 0,
    true, // certification is optional
    selectedLanguages.length > 0,
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
    setStep2({ bio, city, country, price, certification, languages: selectedLanguages })
    router.push("/onboarding/coach/availability")
  }

  function toggleLanguage(code: LanguageCode) {
    setSelectedLanguages((prev) =>
      prev.includes(code) ? prev.filter((l) => l !== code) : [...prev, code]
    )
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
    // Slide 0 — Bio
    <motion.div
      key="bio"
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="mb-2 flex items-center gap-2">
        <User className="size-4 text-teal-accent" aria-hidden="true" />
        <p className="text-sm font-semibold text-white">{t("bioTitle")}</p>
        <span className="ml-auto text-xs text-red-400" aria-label="required">*</span>
      </div>
      <p className="mb-4 text-xs text-white/40">{t("bioSubtitle")}</p>
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder={t("bioPlaceholder")}
        rows={6}
        className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none transition-colors placeholder:text-white/30 focus:border-teal-accent focus:ring-1 focus:ring-teal-accent/30"
      />
      <p
        className={cn(
          "mt-1 text-right text-xs",
          bio.trim().length >= 20 ? "text-white/30" : "text-red-400/60"
        )}
      >
        {bio.trim().length} / 20 {t("minChars")}
      </p>
    </motion.div>,

    // Slide 1 — Location
    <motion.div
      key="location"
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="mb-2 flex items-center gap-2">
        <MapPin className="size-4 text-teal-accent" aria-hidden="true" />
        <p className="text-sm font-semibold text-white">{t("locationTitle")}</p>
        <span className="ml-auto text-xs text-red-400" aria-label="required">*</span>
      </div>
      <p className="mb-4 text-xs text-white/40">{t("locationSubtitle")}</p>
      <div className="flex flex-col gap-3">
        <Input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder={t("cityPlaceholder")}
        />
        <div>
          <label className="mb-1.5 block text-xs font-medium text-white/50">
            {t("countryLabel")} *
          </label>
          <Popover.Root open={countryOpen} onOpenChange={setCountryOpen}>
            <Popover.Trigger className={cn(
              "flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
              countryOpen
                ? "border-teal-accent/40 bg-teal-accent/10 text-white"
                : "border-white/10 bg-white/5 text-white/70 hover:border-teal-accent/20 hover:text-white"
            )}>
              <div className="flex items-center gap-2">
                {(() => {
                  const Flag = getFlag(country)
                  return Flag ? <Flag className="size-5 rounded-sm" aria-hidden="true" /> : null
                })()}
                <span>{tSearch(`countries.${country}`)}</span>
              </div>
              <ChevronDown className={cn("size-4 shrink-0 text-white/40 transition-transform duration-200", countryOpen && "rotate-180")} aria-hidden="true" />
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Positioner sideOffset={8} align="start" className="z-50 w-[var(--anchor-width)]">
<Popover.Popup className="rounded-2xl border border-white/10 bg-white/[8%] p-1.5 shadow-xl shadow-black/20 backdrop-blur-md text-white data-[state=open]:animate-in data-[state=closed]:animate-out">
                  <div className="max-h-56 overflow-y-auto scrollbar-thin">
                    {COUNTRIES.map(({ code }) => {
                      const Flag = getFlag(code)
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => { setCountry(code); setCountryOpen(false) }}
                        className={cn(
                          "flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
                          country === code
                            ? "bg-teal-accent/10 text-teal-accent"
                            : "text-white/70 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        {Flag && <Flag className="size-5 rounded-sm" aria-hidden="true" />}
                        {tSearch(`countries.${code}`)}
                        {country === code && <Check className="ml-auto size-4 text-teal-accent" aria-hidden="true" />}
                      </button>
                    )
                  })}
                  </div>
                </Popover.Popup>
              </Popover.Positioner>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </div>
    </motion.div>,

    // Slide 2 — Price
    <motion.div
      key="price"
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="mb-2 flex items-center gap-2">
        <Euro className="size-4 text-teal-accent" aria-hidden="true" />
        <p className="text-sm font-semibold text-white">{t("priceTitle")}</p>
        <span className="ml-auto text-xs text-red-400" aria-label="required">*</span>
      </div>
      <p className="mb-4 text-xs text-white/40">{t("priceSubtitle")}</p>
      <div className="relative">
        <span
          aria-hidden="true"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/40"
        >
          €
        </span>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder={t("pricePlaceholder")}
          min={1}
          max={500}
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-8 pr-4 text-base text-white outline-none transition-colors placeholder:text-white/30 focus:border-teal-accent focus:ring-1 focus:ring-teal-accent/30"
        />
      </div>
      <p className="mt-2 text-xs text-white/30">{t("priceHint")}</p>
    </motion.div>,

    // Slide 3 — Certification (optional)
    <motion.div
      key="certification"
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="mb-2 flex items-center gap-2">
        <Award className="size-4 text-teal-accent" aria-hidden="true" />
        <p className="text-sm font-semibold text-white">{t("certificationTitle")}</p>
        <span className="ml-auto text-xs text-white/30">{t("optional")}</span>
      </div>
      <p className="mb-4 text-xs text-white/40">{t("certificationSubtitle")}</p>
      <Input
        type="text"
        value={certification}
        onChange={(e) => setCertification(e.target.value)}
        placeholder={t("certificationPlaceholder")}
      />
    </motion.div>,

    // Slide 4 — Languages
    <motion.div
      key="languages"
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="mb-2 flex items-center gap-2">
        <Languages className="size-4 text-teal-accent" aria-hidden="true" />
        <p className="text-sm font-semibold text-white">{t("languagesTitle")}</p>
        <span className="ml-auto text-xs text-red-400" aria-label="required">*</span>
      </div>
      <p className="mb-4 text-xs text-white/40">{t("languagesSubtitle")}</p>
      <div className="grid grid-cols-2 gap-2">
        {LANGUAGE_CODES.map((code) => {
          const Flag = getFlag(LANGUAGE_FLAG[code])
          const isSelected = selectedLanguages.includes(code)
          return (
            <button
              key={code}
              type="button"
              onClick={() => toggleLanguage(code)}
              aria-pressed={isSelected}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
                isSelected
                  ? "border-teal-accent/40 bg-teal-accent/10 text-white"
                  : "border-white/10 bg-white/5 text-white/60 hover:border-teal-accent/20 hover:text-white"
              )}
            >
              {Flag && <Flag className="size-4 rounded-sm" />}
              <span>{tLanguages(code)}</span>
            </button>
          )
        })}
      </div>
    </motion.div>,
  ]

  return (
    <OnboardingShell current={2} total={4}>
      <div className="mb-6 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
          {tStep("of", { current: 2, total: 4 })}
        </p>
        <div className="mb-4 flex items-center justify-center gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === 1
                  ? "w-6 bg-teal-accent"
                  : i < 1
                  ? "w-2 bg-teal-accent/40"
                  : "w-2 bg-white/20"
              )}
            />
          ))}
        </div>
        <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
        <p className="mt-1 text-sm text-white/50">{t("subtitle")}</p>
      </div>

        {/* Slide container — touch swipe surface */}
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
        <nav aria-label="Step navigation" className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            disabled={!canGoBack}
            aria-label={t("back")}
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition-colors hover:border-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60 disabled:cursor-not-allowed disabled:opacity-25"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>

          {isLastSlide ? (
            <Button
              type="button"
              variant="entry"
              onClick={handleContinue}
              disabled={!canGoNext}
              className="flex-1"
            >
              {t("continue")}
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

          <button
            type="button"
            onClick={handleNext}
            disabled={!canGoNext || isLastSlide}
            aria-label={t("forward")}
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition-colors hover:border-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60 disabled:cursor-not-allowed disabled:opacity-25"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </nav>

        {currentSlide === 3 && (
          <button
            type="button"
            onClick={handleNext}
            className="mt-3 w-full cursor-pointer text-center text-xs text-white/30 transition-colors hover:text-white/50"
          >
            {t("skipCertification")}
          </button>
        )}
    </OnboardingShell>
  )
}