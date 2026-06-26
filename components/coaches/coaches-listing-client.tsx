"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useRouter, Link } from "@/i18n/navigation"
import { useSearchParams } from "next/navigation"
import { SlidersHorizontal } from "lucide-react"
import { CoachCard } from "@/components/coach-card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "@/components/ui/dialog"
import { LanguageFlag } from "@/components/ui/language-flag"
import type { Coach, CoachBadgeKey, LanguageCode, DayKey } from "@/lib/coaches"
import { cn } from "@/lib/utils"

const ALL_BADGES: CoachBadgeKey[] = [
  "freestyle",
  "competition",
  "openWater",
  "allLevels",
  "butterfly",
  "advanced",
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
    cardCta: string
    languages: Record<LanguageCode, string>
  }
  page: {
    title: string
    resultCountTemplate: string
    filters: {
      location: string
      locationPlaceholder: string
      specialty: string
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
  const searchParams = useSearchParams()

  const [mobileOpen, setMobileOpen] = useState(false)

  const getParam = <T,>(key: string, defaultVal: T, parse?: (v: string) => T): T => {
    const val = searchParams.get(key)
    if (!val) return defaultVal
    if (parse) return parse(val)
    return val as unknown as T
  }

  const [location, setLocation] = useState(() => getParam("location", ""))
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
    (newLocation: string, newBadges: Set<CoachBadgeKey>, newLanguages: Set<LanguageCode>,
     newMaxPrice: number, newMinRating: number, newMinExperience: number,
     newDays: Set<DayKey>, newGender: "" | "M" | "F") => {
      const params = new URLSearchParams()
      if (newLocation) params.set("location", newLocation)
      if (newBadges.size > 0) params.set("badges", [...newBadges].join(","))
      if (newLanguages.size > 0) params.set("language", [...newLanguages].join(","))
      if (newMaxPrice < 80) params.set("maxPrice", String(newMaxPrice))
      if (newMinRating > 4.0) params.set("minRating", String(newMinRating))
      if (newMinExperience > 0) params.set("minExperience", String(newMinExperience))
      if (newDays.size > 0) params.set("days", [...newDays].join(","))
      if (newGender) params.set("gender", newGender)
      const qs = params.toString()
      router.replace(qs ? `/coaches?${qs}` : "/coaches", { scroll: false })
    },
    [router]
  )

  // Sync state → URL only after initial mount (prevents redundant replace on page load)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    pushParams(location, selectedBadges, selectedLanguages, maxPrice, minRating, minExperience, selectedDays, gender)
  }, [location, selectedBadges, selectedLanguages, maxPrice, minRating, minExperience, selectedDays, gender, pushParams])

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
        if (location) params.set("location", location)
        if (selectedBadges.size > 0) params.set("badges", [...selectedBadges].join(","))
        if (selectedLanguages.size > 0) params.set("language", [...selectedLanguages].join(","))
        if (selectedDays.size > 0) params.set("days", [...selectedDays].join(","))
        if (gender) params.set("gender", gender)
        if (value !== null) params.set(urlKey, String(value))
        const qs = params.toString()
        router.replace(qs ? `/coaches?${qs}` : "/coaches", { scroll: false })
      }, 200)
    },
    [location, selectedBadges, selectedLanguages, selectedDays, gender, router]
  )

  const resetFilters = () => {
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
    location ||
    selectedBadges.size > 0 ||
    selectedLanguages.size > 0 ||
    maxPrice < 80 ||
    minRating > 4.0 ||
    minExperience > 0 ||
    selectedDays.size > 0 ||
    gender !== ""

  const filtered = coaches.filter((coach) => {
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

  const FilterContent = () => (
    <div className="flex flex-col gap-6">
      {/* Localisation */}
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-white/70">{page.filters.location}</legend>
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
        <legend className="mb-2 text-sm font-medium text-white/70">{page.filters.specialty}</legend>
        <div className="flex flex-col gap-1.5">
          {ALL_BADGES.map((badge) => (
            <label key={badge} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={selectedBadges.has(badge)}
                onChange={() =>
                  setSelectedBadges((prev) => {
                    const next = new Set(prev)
                    next.has(badge) ? next.delete(badge) : next.add(badge)
                    return next
                  })
                }
                className="accent-teal-accent"
              />
              <span className="text-sm text-white/70">{badgeLabels[badge]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Langues */}
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-white/70">{page.filters.language}</legend>
        <div className="flex flex-wrap gap-1.5">
          {ALL_LANGUAGES.map((code) => {
            const selected = selectedLanguages.has(code)
            return (
              <button
                key={code}
                type="button"
                onClick={() =>
                  setSelectedLanguages((prev) => {
                    const next = new Set(prev)
                    next.has(code) ? next.delete(code) : next.add(code)
                    return next
                  })
                }
                className={cn(
                  "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm transition-all",
                  selected
                    ? "border-teal-accent bg-teal-accent/15 text-teal-accent-light"
                    : "border-white/15 bg-white/5 text-white/70 hover:border-white/30"
                )}
              >
                <LanguageFlag code={code} size={16} />
              </button>
            )
          })}
        </div>
      </fieldset>

      {/* Prix maximum */}
      <fieldset>
        <legend className="mb-1 text-sm font-medium text-white/70">
          {page.filters.maxPrice} — <span className="text-teal-accent">€{maxPrice}</span>
        </legend>
        <input
          type="range"
          min={30}
          max={80}
          step={5}
          value={maxPrice}
          onChange={(e) =>
            debouncedUpdate("maxPrice", Number(e.target.value), "maxPrice")
          }
          className="w-full accent-teal-accent"
        />
        <div className="mt-0.5 flex justify-between text-xs text-white/30">
          <span>€30</span><span>€80</span>
        </div>
      </fieldset>

      {/* Note minimum */}
      <fieldset>
        <legend className="mb-1 text-sm font-medium text-white/70">
          {page.filters.minRating} — <span className="text-teal-accent">{minRating.toFixed(1)}</span>
        </legend>
        <input
          type="range"
          min={4.0}
          max={5.0}
          step={0.1}
          value={minRating}
          onChange={(e) =>
            debouncedUpdate("minRating", parseFloat(e.target.value), "minRating")
          }
          className="w-full accent-teal-accent"
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
        <input
          type="range"
          min={0}
          max={20}
          step={1}
          value={minExperience}
          onChange={(e) =>
            debouncedUpdate("minExperience", Number(e.target.value), "minExperience")
          }
          className="w-full accent-teal-accent"
        />
        <div className="mt-0.5 flex justify-between text-xs text-white/30">
          <span>0</span><span>20</span>
        </div>
      </fieldset>

      {/* Disponibilité */}
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-white/70">{page.filters.availability}</legend>
        <div className="flex flex-wrap gap-1.5">
          {ALL_DAYS.map((day) => {
            const selected = selectedDays.has(day)
            return (
              <button
                key={day}
                type="button"
                onClick={() =>
                  setSelectedDays((prev) => {
                    const next = new Set(prev)
                    next.has(day) ? next.delete(day) : next.add(day)
                    return next
                  })
                }
                className={cn(
                  "rounded-md border px-2.5 py-1 text-sm transition-all",
                  selected
                    ? "border-teal-accent bg-teal-accent/15 text-teal-accent-light"
                    : "border-white/15 bg-white/5 text-white/70 hover:border-white/30"
                )}
              >
                {dayLabels[day]}
              </button>
            )
          })}
        </div>
      </fieldset>

      {/* Genre */}
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-white/70">{page.filters.gender}</legend>
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

      {/* Reset */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={resetFilters}
          className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 py-2 text-sm text-white/60 transition-colors hover:border-white/20 hover:text-white/80"
        >
          {page.filters.reset}
        </button>
      )}
    </div>
  )

  return (
    <main className="min-h-screen bg-background">
      {/* Back + page heading (matches /coaches/[id] back-button pattern) */}
      <div className="mx-auto max-w-7xl px-4 pt-6">
        <Link
          href="/#coaches"
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white/80"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="size-4"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t.cardCta.replace("Voir le profil & ", "")}
        </Link>

        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white md:text-3xl">{page.title}</h1>
          <span className="text-sm text-white/50">{page.resultCountTemplate.replace("{count}", String(filtered.length))}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-6">
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden w-80 shrink-0 lg:block">
            <div className="sticky top-28 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-white/10 bg-white/[4%] p-5 backdrop-blur-md">
              <FilterContent />
            </div>
          </aside>

          {/* Results */}
          <div className="min-w-0 flex-1">
            {/* Mobile filter button */}
            <div className="mb-4 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:border-white/25"
              >
                <SlidersHorizontal className="size-4" />
                {page.mobileFilters}
                {hasActiveFilters && (
                  <span className="ml-1 rounded-full bg-teal-accent px-1.5 py-0.5 text-xs text-white">!</span>
                )}
              </button>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[4%] py-20 text-center backdrop-blur-md">
                <p className="text-lg font-medium text-white/70">{page.emptyTitle}</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/70 transition-colors hover:border-white/25 hover:text-white"
                >
                  {page.emptyReset}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((coach) => (
                  <CoachCard
                    key={coach.id}
                    coach={coach}
                    translations={{
                      badges: t.badges,
                      reviewsSuffix: t.reviewsSuffix,
                      priceUnit: t.priceUnit,
                      cardCta: t.cardCta,
                      languages: t.languages,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{page.mobileFilters}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <FilterContent />
          </DialogBody>
        </DialogContent>
      </Dialog>
    </main>
  )
}
