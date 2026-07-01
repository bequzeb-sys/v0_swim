"use client"

import { useState, useCallback, useEffect, useRef, useMemo } from "react"
import { useRouter } from "@/i18n/navigation"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { SlidersHorizontal, ChevronDown, Check } from "lucide-react"
import { CoachListingCard } from "@/components/coaches/coach-listing-card"
import { Input } from "@/components/ui/input"
import { RangeSlider } from "@/components/ui/range-slider"
import { Pill } from "@/components/ui/pill"
import { LanguageFlag } from "@/components/ui/language-flag"
import { Scrollbar } from "@/components/ui/scrollbar"
import type { Coach, CoachBadgeKey, LanguageCode, DayKey } from "@/lib/coaches"
import * as Flags from "country-flag-icons/react/3x2"
import { Popover } from "@base-ui/react/popover"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const COUNTRIES = [
  { code: "FR" },
  { code: "BE" },
  { code: "CH" },
  { code: "CA" },
  { code: "MA" },
  { code: "DZ" },
  { code: "TN" },
  { code: "ES" },
  { code: "DE" },
  { code: "IT" },
  { code: "PT" },
  { code: "LU" },
] as const

const ALL_BADGES: CoachBadgeKey[] = [
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

const ALL_LANGUAGES: LanguageCode[] = [
  "fr", "en", "es", "de", "it", "ar", "zh", "pt", "ru", "ja",
]

const ALL_DAYS: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]

interface Props {
  coaches: Coach[]
  translations: {
    badges: Record<string, string>
    reviewsSuffix: string
    priceUnit: string
    listingCta: string
                      cardCta: string
                      languagesTitle: string
    languages: Record<LanguageCode, string>
  }
  page: {
    title: string
    resultCountTemplate: string
    filters: {
      location: string
      locationPlaceholder: string
      country: string
      allCountries: string
      specialty: string
      allSpecialties: string
      language: string
      maxPrice: string
      minRating: string
      minExperience: string
      availability: string
      gender: string
      reset: string
      all: string
      female: string
      male: string
    }
    emptyTitle: string
    emptyReset: string
    mobileFilters: string
    close: string
  }
  badgeLabels: Record<CoachBadgeKey, string>
  dayLabels: Record<DayKey, string>
}

export function CoachesListingClient({
  coaches,
  translations: t,
  page,
  badgeLabels,
  dayLabels,
}: Props) {
  const router = useRouter()
  const tSearch = useTranslations("search")
  const searchParams = useSearchParams()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileClosing, setMobileClosing] = useState(false)
  const [specialtyOpen, setSpecialtyOpen] = useState(true)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const resetStripRef = useRef<HTMLDivElement>(null)
  const mobileScrollRef = useRef<HTMLDivElement>(null)
  const mobileResetRef = useRef<HTMLDivElement>(null)
  const [resetStripHeight, setResetStripHeight] = useState(0)

  const getParam = <T,>(key: string, defaultVal: T, parse?: (v: string) => T): T => {
    const val = searchParams.get(key)
    if (!val) return defaultVal
    if (parse) return parse(val)
    return val as unknown as T
  }

  const [location, setLocation] = useState(() => getParam("location", ""))
  const [country, setCountry] = useState<string>(() => searchParams.get("country") ?? "")
  const [selectedBadges, setSelectedBadges] = useState<Set<CoachBadgeKey>>(() => {
    const raw = searchParams.get("badges")
    const vals = raw ? raw.split(",").filter(Boolean) as CoachBadgeKey[] : []
    return new Set(vals)
  })
  const [selectedLanguages, setSelectedLanguages] = useState<Set<LanguageCode>>(() => {
    const raw = searchParams.get("language")
    const vals = raw ? raw.split(",").filter(Boolean) as LanguageCode[] : []
    return new Set(vals)
  })
  const [maxPrice, setMaxPrice] = useState(() => getParam("maxPrice", 80, Number))
  const [minRating, setMinRating] = useState(() => getParam("minRating", 4.0, parseFloat))
  const [minExperience, setMinExperience] = useState(() => getParam("minExperience", 0, Number))
  const [selectedDays, setSelectedDays] = useState<Set<DayKey>>(() => {
    const raw = searchParams.get("days")
    const vals = raw ? raw.split(",").filter(Boolean) as DayKey[] : []
    return new Set(vals)
  })
  const [gender, setGender] = useState<"" | "M" | "F">(() => getParam<"" | "M" | "F">("gender", ""))

  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const isFirstRender = useRef(true)

  const pushParams = useCallback(
    (newCountry: string, newLocation: string, newBadges: Set<CoachBadgeKey>, newLanguages: Set<LanguageCode>,
     newMaxPrice: number, newMinRating: number, newMinExperience: number,
     newDays: Set<DayKey>, newGender: "" | "M" | "F") => {
      const params = new URLSearchParams()
      if (newCountry) params.set("country", newCountry)
      if (newLocation) params.set("location", newLocation)
      if (newBadges.size > 0) params.set("badges", [...newBadges].join(","))
      if (newLanguages.size > 0) params.set("language", [...newLanguages].join(","))
      if (newMaxPrice < 80) params.set("maxPrice", String(newMaxPrice))
      if (newMinRating > 4.0) params.set("minRating", String(newMinRating))
      if (newMinExperience > 0) params.set("minExperience", String(newMinExperience))
      if (newDays.size > 0) params.set("days", [...newDays].join(","))
      if (newGender) params.set("gender", newGender)
      const qs = params.toString()
      router.replace(qs ? { pathname: "/coaches", query: Object.fromEntries(params) } : "/coaches", { scroll: false })
    },
    [router]
  )

  // Sync state → URL only after initial mount (prevents redundant replace on page load)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    pushParams(country, location, selectedBadges, selectedLanguages, maxPrice, minRating, minExperience, selectedDays, gender)
  }, [country, location, selectedBadges, selectedLanguages, maxPrice, minRating, minExperience, selectedDays, gender, pushParams])

  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach(clearTimeout)
    }
  }, [])

  const debouncedUpdate = useCallback(
    (key: string, value: number | null, urlKey: string) => {
      clearTimeout(debounceTimers.current[key])
      debounceTimers.current[key] = setTimeout(() => {
        const params = new URLSearchParams()
        if (country) params.set("country", country)
        if (location) params.set("location", location)
        if (selectedBadges.size > 0) params.set("badges", [...selectedBadges].join(","))
        if (selectedLanguages.size > 0) params.set("language", [...selectedLanguages].join(","))
        if (selectedDays.size > 0) params.set("days", [...selectedDays].join(","))
        if (gender) params.set("gender", gender)
        if (value !== null) params.set(urlKey, String(value))
        const qs = params.toString()
        router.replace(qs ? { pathname: "/coaches", query: Object.fromEntries(params) } : "/coaches", { scroll: false })
      }, 200)
    },
    [country, location, selectedBadges, selectedLanguages, selectedDays, gender, router]
  )

  const resetFilters = () => {
    setCountry("")
    setLocation("")
    setSelectedBadges(new Set())
    setSelectedLanguages(new Set())
    setMaxPrice(80)
    setMinRating(4.0)
    setMinExperience(0)
    setSelectedDays(new Set())
    setGender("")
    router.replace("/coaches", { scroll: false })
  }

  const hasActiveFilters =
    country ||
    location ||
    selectedBadges.size > 0 ||
    selectedLanguages.size > 0 ||
    maxPrice < 80 ||
    minRating > 4.0 ||
    minExperience > 0 ||
    selectedDays.size > 0 ||
    gender !== ""

  useEffect(() => {
    if (resetStripRef.current) {
      setResetStripHeight(resetStripRef.current.offsetHeight)
    }
  }, [hasActiveFilters])

  const filtered = coaches.filter((coach) => {
    if (country && coach.country !== country) return false
    if (location && !coach.city.toLowerCase().includes(location.toLowerCase())) return false
    if (selectedBadges.size > 0 && !coach.badgeKeys.some((b) => selectedBadges.has(b))) return false
    if (selectedLanguages.size > 0 && !coach.languages.some((l) => selectedLanguages.has(l))) return false
    if (maxPrice < 80 && parseInt(coach.price.replace("€", "")) > maxPrice) return false
    if (parseFloat(coach.rating) < minRating) return false
    if (coach.yearsExperience < minExperience) return false
    if (selectedDays.size > 0 && !coach.availability.some((d) => selectedDays.has(d))) return false
    if (gender && coach.gender !== gender) return false
    return true
  })

  const cardTranslations = useMemo(() => ({
    badges: t.badges,
    languages: t.languages as unknown as Record<string, string>,
    listingCta: t.listingCta,
    reviews: t.reviewsSuffix,
    priceUnit: t.priceUnit,
    languagesTitle: t.languagesTitle,
  }), [t.badges, t.languages, t.listingCta, t.reviewsSuffix, t.priceUnit, t.languagesTitle])

  const FilterContent = () => {
    const [countryOpen, setCountryOpen] = useState(false)
    return (
      <div className="flex flex-col gap-4">
      {/* Pays */}
      <fieldset>
        <legend className="mb-1.5 text-sm font-medium text-white/70">{page.filters.country}</legend>
        <Popover.Root open={countryOpen} onOpenChange={setCountryOpen}>
          <Popover.Trigger className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-blue-300/20 bg-blue-400/[8%] px-4 py-3 text-left text-sm font-medium text-white/70 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-teal-accent/60">
            {country ? (
              <span className="flex items-center gap-2 text-white">
                {(() => {
                  const F = (Flags as unknown as Record<string, React.ComponentType<{ style?: React.CSSProperties; className?: string }>>)[country]
                  return F ? <span aria-hidden="true"><F style={{ width: 20, height: 14 }} className="rounded-sm" /></span> : null
                })()}
                {tSearch(`countries.${country}`)}
              </span>
            ) : (
              <span>{page.filters.allCountries}</span>
            )}
            <ChevronDown className={cn("size-4 shrink-0 text-white/40 transition-transform duration-200", countryOpen && "rotate-180")} aria-hidden="true" />
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner sideOffset={8} align="start" className="z-50">
              <Popover.Popup className="min-w-[var(--anchor-width)] rounded-2xl border border-blue-300/20 bg-blue-400/[8%] py-1.5 shadow-xl shadow-black/20 backdrop-blur-md">
                <div className="relative">
                  <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10 h-6 rounded-t-2xl bg-gradient-to-b from-blue-400/[12%] to-transparent" />
                  <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6 rounded-b-2xl bg-gradient-to-t from-blue-400/[12%] to-transparent" />
                  <ul role="listbox" aria-label={page.filters.country} className="max-h-48 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <li role="option" aria-selected={country === ""}>
                      <button
                        type="button"
                        onClick={() => { setCountry(""); setCountryOpen(false) }}
                        className={cn(
                          "flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/10 hover:text-white focus-visible:bg-white/10 focus-visible:outline-none focus-visible:text-white",
                          country === "" ? "text-teal-accent" : "text-white/50"
                        )}
                      >
                        {page.filters.allCountries}
                      </button>
                    </li>
                    {COUNTRIES.map(({ code }) => {
                      const F = (Flags as unknown as Record<string, React.ComponentType<{ style?: React.CSSProperties; className?: string }>>)[code]
                      return (
                        <li key={code} role="option" aria-selected={country === code}>
                          <button
                            type="button"
                            onClick={() => { setCountry(code); setCountryOpen(false) }}
                            className={cn(
                              "flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/10 hover:text-white focus-visible:bg-white/10 focus-visible:outline-none focus-visible:text-white",
                              country === code ? "text-teal-accent" : "text-white/80"
                            )}
                          >
                            {F && <span aria-hidden="true"><F style={{ width: 20, height: 14 }} className="rounded-sm" /></span>}
                            {tSearch(`countries.${code}`)}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </fieldset>

      {/* Localisation */}
      <fieldset>
        <legend className="mb-1.5 text-sm font-medium text-white/70">{page.filters.location}</legend>
        <Input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder={page.filters.locationPlaceholder}
          className="w-full"
        />
      </fieldset>

      {/* Spécialité */}
      <fieldset>
        {/* Collapsible header */}
        <button
          type="button"
          onClick={() => setSpecialtyOpen((v) => !v)}
          className="mb-1.5 flex w-full cursor-pointer items-center justify-between text-sm font-medium text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
        >
          <span>{page.filters.specialty}</span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-white/40 transition-transform duration-200",
              specialtyOpen && "rotate-180"
            )}
            aria-hidden="true"
          />
        </button>

        {specialtyOpen && (
          <div className="flex flex-col gap-1.5">
            {/* Toutes spécialités — select/deselect all */}
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={selectedBadges.size === 0}
                onChange={() => {
                  if (selectedBadges.size > 0) {
                    setSelectedBadges(new Set())
                  }
                }}
                className="accent-teal-accent cursor-pointer"
              />
              <span className="text-sm text-white/70">{page.filters.allSpecialties}</span>
            </label>

            {/* Divider */}
            <div className="my-0.5 h-px bg-white/10" />

            {/* Individual specialty checkboxes */}
            {ALL_BADGES.map((badge) => (
              <label key={badge} className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={selectedBadges.has(badge)}
                  onChange={() => {
                    setSelectedBadges((prev) => {
                      const next = new Set(prev)
                      if (next.has(badge)) next.delete(badge)
                      else next.add(badge)
                      return next
                    })
                  }}
                  className="accent-teal-accent cursor-pointer"
                />
                <span className="text-sm text-white/70">{badgeLabels[badge]}</span>
              </label>
            ))}
          </div>
        )}
      </fieldset>

      {/* Langues */}
      <fieldset>
        <legend className="mb-1.5 text-sm font-medium text-white/70">{page.filters.language}</legend>
        <div className="flex flex-wrap gap-1.5">
          {ALL_LANGUAGES.map((code) => (
            <Pill
              key={code}
              selected={selectedLanguages.has(code)}
              ariaLabel={page.filters.language}
              className="rounded-md"
              onClick={() =>
                setSelectedLanguages((prev) => {
                  const next = new Set(prev)
                  next.has(code) ? next.delete(code) : next.add(code)
                  return next
                })
              }
              icon={<LanguageFlag code={code} size={16} />}
            />
          ))}
        </div>
      </fieldset>

      {/* Prix maximum */}
      <fieldset>
        <legend className="mb-1 text-sm font-medium text-white/70">
          {page.filters.maxPrice} — <span className="text-teal-accent">€{maxPrice}</span>
        </legend>
        <RangeSlider
          min={20}
          max={80}
          step={1}
          value={maxPrice}
          onChange={(v) => {
            setMaxPrice(v)
            debouncedUpdate("maxPrice", v, "maxPrice")
          }}
        />
        <div className="mt-0.5 flex justify-between text-xs text-white/30">
          <span>€20</span><span>€80</span>
        </div>
      </fieldset>

      {/* Note minimum */}
      <fieldset>
        <legend className="mb-1 text-sm font-medium text-white/70">
          {page.filters.minRating} — <span className="text-teal-accent">{minRating.toFixed(1)}</span>
        </legend>
        <RangeSlider
          min={4.0}
          max={5.0}
          step={0.1}
          value={minRating}
          onChange={(v) => {
            setMinRating(v)
            debouncedUpdate("minRating", v, "minRating")
          }}
        />
        <div className="mt-0.5 flex justify-between text-xs text-white/30">
          <span>4.0</span><span>5.0</span>
        </div>
      </fieldset>

      {/* Années d'expérience */}
      <fieldset>
        <legend className="mb-1 text-sm font-medium text-white/70">
          {page.filters.minExperience} — <span className="text-teal-accent">{minExperience}+</span>
        </legend>
        <RangeSlider
          min={0}
          max={20}
          step={1}
          value={minExperience}
          onChange={(v) => {
            setMinExperience(v)
            debouncedUpdate("minExperience", v, "minExperience")
          }}
        />
        <div className="mt-0.5 flex justify-between text-xs text-white/30">
          <span>0</span><span>20</span>
        </div>
      </fieldset>

      {/* Disponibilité */}
      <fieldset>
        <legend className="mb-1.5 text-sm font-medium text-white/70">{page.filters.availability}</legend>
        <div className="flex flex-wrap gap-1.5">
          {ALL_DAYS.map((day) => (
            <Pill
              key={day}
              selected={selectedDays.has(day)}
              className="rounded-md px-2.5 py-1"
              onClick={() =>
                setSelectedDays((prev) => {
                  const next = new Set(prev)
                  next.has(day) ? next.delete(day) : next.add(day)
                  return next
                })
              }
            >
              {dayLabels[day]}
            </Pill>
          ))}
        </div>
      </fieldset>

      {/* Genre */}
      <fieldset>
        <legend className="mb-1.5 text-sm font-medium text-white/70">{page.filters.gender}</legend>
        <div className="flex flex-col gap-1.5">
          {([
            ["", page.filters.all],
            ["F", page.filters.female],
            ["M", page.filters.male],
          ] as const).map(([val, label]) => (
            <label key={val} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="radio"
                name="gender"
                value={val}
                checked={gender === val}
                onChange={() => setGender(val)}
                className="accent-teal-accent"
              />
              <span className="text-sm text-white/70">{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      </div>
    )
  }

  return (
    <main className="relative z-10">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex items-start gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden w-80 shrink-0 self-start sticky top-28 lg:block">
            <div className="relative flex h-[calc(100vh-8rem)] flex-col rounded-3xl border border-blue-300/20 bg-blue-400/[15%] shadow-xl shadow-black/20">
              <div
                ref={sidebarRef}
                className="flex-1 overflow-y-auto pl-4 pr-7 pt-4 pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                <FilterContent />
              </div>
              <div ref={resetStripRef} className="px-4 py-3">
                <button
                  type="button"
                  onClick={resetFilters}
                  disabled={!hasActiveFilters}
                  className={cn(
                    "w-full rounded-xl border py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
                    hasActiveFilters
                      ? "cursor-pointer border-teal-accent/30 bg-teal-accent/10 text-teal-accent hover:bg-teal-accent/20"
                      : "cursor-not-allowed border-white/10 bg-white/5 text-white/30"
                  )}
                >
                  {page.filters.reset}
                </button>
              </div>
              <Scrollbar scrollRef={sidebarRef} offsetBottom={resetStripHeight} />
            </div>
          </aside>

          {/* Results */}
          <div className="min-w-0 flex-1 isolate">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white md:text-3xl">{page.title}</h1>
              <span className="text-sm text-white/50">
                {page.resultCountTemplate.replace("{count}", String(filtered.length))}
              </span>
            </div>
            {/* Mobile filter button */}
            <div className="mb-4 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
              >
                <SlidersHorizontal className="size-4" />
                {page.mobileFilters}
                {hasActiveFilters && (
                  <span className="ml-1 rounded-full bg-teal-accent px-1.5 py-0.5 text-xs text-white">!</span>
                )}
              </button>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-blue-300/20 bg-blue-400/[8%] py-20 text-center shadow-xl shadow-black/20 backdrop-blur-md">
                <p className="text-lg font-medium text-white/70">{page.emptyTitle}</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 cursor-pointer rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/70 transition-colors hover:border-white/25 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
                >
                  {page.emptyReset}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {filtered.map((coach) => (
                  <CoachListingCard
                    key={coach.id}
                    coach={coach}
                    t={cardTranslations}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter left drawer */}
      <DialogPrimitive.Root open={mobileOpen || mobileClosing} onOpenChange={(open) => {
            if (!open) {
              setMobileClosing(true)
              setTimeout(() => {
                setMobileOpen(false)
                setMobileClosing(false)
              }, 360)
            } else {
              setMobileOpen(true)
            }
          }}>
        <DialogPrimitive.Portal keepMounted>
          <AnimatePresence>
            {mobileOpen && (
              <>
                {/* Backdrop — plain fixed div, no Base UI wrapper */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                  onClick={() => {
                    setMobileClosing(true)
                    setTimeout(() => {
                      setMobileOpen(false)
                      setMobileClosing(false)
                    }, 360)
                  }}
                />

                {/* Left drawer panel — plain fixed div, no Base UI Popup wrapper */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%", transition: { duration: 0.35, ease: "easeIn" } }}
                  transition={{ type: "spring", stiffness: 380, damping: 38 }}
                  className="fixed inset-y-0 left-0 z-50 flex w-[min(20rem,85vw)] flex-col shadow-xl shadow-black/20 outline-none"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between rounded-t-3xl border border-b-0 border-blue-300/20 bg-blue-400/[15%] px-5 pt-5 pb-4">
                    <span className="text-base font-semibold text-white">{page.mobileFilters}</span>
                    <DialogPrimitive.Close
                      className={cn(
                        "inline-flex size-8 cursor-pointer items-center justify-center rounded-xl border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
                        hasActiveFilters
                          ? "border-teal-accent/30 bg-teal-accent/10 text-teal-accent hover:bg-teal-accent/20"
                          : "border-white/15 bg-white/5 text-white/50 hover:border-white/25 hover:text-white"
                      )}
                      aria-label={page.close}
                      onClick={(e) => {
                        e.preventDefault()
                        setMobileClosing(true)
                        setTimeout(() => {
                          setMobileOpen(false)
                          setMobileClosing(false)
                        }, 360)
                      }}
                    >
                      <Check className="size-4" aria-hidden="true" />
                    </DialogPrimitive.Close>
                  </div>

                  {/* Scrollable filter content */}
                  <div
                    ref={mobileScrollRef}
                    className="relative flex-1 overflow-y-auto border-x border-blue-300/20 bg-blue-400/[15%] px-5 py-4 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                  >
                    <FilterContent />
                  </div>

                  {/* Pinned reset button */}
                  <div ref={mobileResetRef} className="rounded-b-3xl border border-t-0 border-blue-300/20 bg-blue-400/[15%] px-5 py-4">
                    <button
                      type="button"
                      onClick={() => {
                        resetFilters()
                        setMobileClosing(true)
                        setTimeout(() => {
                          setMobileOpen(false)
                          setMobileClosing(false)
                        }, 360)
                      }}
                      disabled={!hasActiveFilters}
                      className={cn(
                        "w-full cursor-pointer rounded-xl border py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
                        hasActiveFilters
                          ? "border-teal-accent/30 bg-teal-accent/10 text-teal-accent hover:bg-teal-accent/20"
                          : "border-white/10 bg-white/5 text-white/30 cursor-not-allowed"
                      )}
                    >
                      {page.filters.reset}
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </main>
  )
}
