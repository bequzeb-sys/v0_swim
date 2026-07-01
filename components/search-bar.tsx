"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Waves, Calendar, LocateFixed, Loader2, X, ChevronDown } from "lucide-react"
import { format } from "date-fns"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePickerField } from "@/components/date-picker-field"
import { fr, enUS } from "date-fns/locale"
import * as Flags from "country-flag-icons/react/3x2"
import { Popover } from "@base-ui/react/popover"
import { cn } from "@/lib/utils"

const specialtyKeys = [
  "all",
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
] as const

const LOCALE_MAP = { fr, en: enUS } as const

const COUNTRIES = [
  { code: "FR", includesRegions: ["RE"] },
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

type CountryCode = (typeof COUNTRIES)[number]["code"]

// Maps ISO 3166-1 alpha-2 country codes returned by geolocation APIs
// to our curated list. RE (Réunion) maps to FR.
const GEO_TO_COUNTRY: Record<string, CountryCode> = {
  FR: "FR", RE: "FR", BE: "BE", CH: "CH", CA: "CA",
  MA: "MA", DZ: "DZ", TN: "TN", ES: "ES", DE: "DE",
  IT: "IT", PT: "PT", LU: "LU",
}

export function SearchBar() {
  const t = useTranslations("search")
  const locale = useLocale()
  const router = useRouter()

  const [country, setCountry] = useState<CountryCode | null>(null)
  const [city, setCity] = useState("")
  const [locating, setLocating] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [countryOpen, setCountryOpen] = useState(false)
  const cityInputRef = useRef<HTMLInputElement>(null)
  const [specialty, setSpecialty] = useState("all")
  const [date, setDate] = useState<Date | undefined>(() => new Date())

  useEffect(() => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          )
          const data = await res.json()
          const code = data?.address?.country_code?.toUpperCase()
          const mapped = code ? GEO_TO_COUNTRY[code] ?? null : null
          if (mapped) setCountry(mapped)
        } catch {
          // silently ignore — geolocation is a nice-to-have
        } finally {
          setLocating(false)
        }
      },
      () => setLocating(false), // denied or unavailable
      { timeout: 5000 }
    )
  }, [])

  useEffect(() => {
    if (country) {
      setTimeout(() => cityInputRef.current?.focus(), 150)
    }
  }, [country])

  function handleSearch() {
    const params = new URLSearchParams()
    if (country) params.set("country", country)
    if (city.trim()) params.set("location", city.trim())
    if (specialty && specialty !== "all") params.set("badges", specialty)
    if (date) params.set("date", format(date, "yyyy-MM-dd"))
    const queryString = params.toString()
    router.push(
      queryString
        ? { pathname: "/coaches", query: Object.fromEntries(params) }
        : "/coaches"
    )
  }

  return (
    <div
      id="search"
      className="scroll-mt-28 mx-auto w-full max-w-5xl rounded-2xl border border-blue-300/20 bg-blue-400/[8%] p-2 shadow-2xl shadow-black/20 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
    >
      <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch lg:gap-0">
        {/* Localisation */}
        <div className="flex flex-1 items-center gap-3 px-5 py-3">
          <MapPin className="size-6 shrink-0 text-teal-accent" />
          <div className="flex w-full items-center">
            {/* Step 1 — Country selector */}
            {!country && (
              <div className="flex w-full items-center gap-2">
                <div className="flex-1 min-w-0">
                  <Popover.Root open={countryOpen} onOpenChange={setCountryOpen}>
                  <Popover.Trigger className="flex w-full cursor-pointer items-center justify-between gap-2 bg-transparent text-left text-lg font-medium text-white/70 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-teal-accent/60">
                    <span className={countryOpen ? "text-white" : undefined}>
                      {locating ? t("locating") : t("countryPlaceholder")}
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-4 shrink-0 text-white/40 transition-transform duration-200",
                        countryOpen && "rotate-180 text-white/70"
                      )}
                      aria-hidden="true"
                    />
                  </Popover.Trigger>

                  <Popover.Portal>
                    <Popover.Positioner sideOffset={8} align="start" className="z-50">
                      <Popover.Popup
                        className={cn(
                          "min-w-[var(--anchor-width)] rounded-2xl border border-blue-300/20 bg-blue-400/[8%] py-1.5 shadow-xl shadow-black/20 backdrop-blur-md",
                          "data-[state=open]:animate-in data-[state=closed]:animate-out"
                        )}
                      >
                        <div className="relative">
                          {/* Top fade */}
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-6 rounded-t-2xl bg-gradient-to-b from-blue-400/[12%] to-transparent"
                          />
                          {/* Bottom fade */}
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6 rounded-b-2xl bg-gradient-to-t from-blue-400/[12%] to-transparent"
                          />
                          <ul
                            role="listbox"
                            aria-label={t("countryLabel")}
                            className="max-h-64 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                          >
                            {COUNTRIES.map(({ code }) => {
                              const FlagComponent = (Flags as unknown as Record<string, React.ComponentType<{ style?: React.CSSProperties; className?: string }>>)[code]
                              return (
                                <li key={code} role="option" aria-selected={false}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCountry(code)
                                      setCountryOpen(false)
                                    }}
                                    className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:bg-white/10 focus-visible:outline-none focus-visible:text-white"
                                  >
                                    {FlagComponent && (
                                      <span aria-hidden="true" className="shrink-0">
                                        <FlagComponent
                                          style={{ width: 20, height: 14 }}
                                          className="rounded-sm"
                                        />
                                      </span>
                                    )}
                                    {t(`countries.${code}`)}
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
                </div>

                {/* Use my location icon button with tooltip */}
                <div className="relative shrink-0">
                  <button
                    type="button"
                    aria-label={t("useMyLocation")}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onFocus={() => setShowTooltip(true)}
                    onBlur={() => setShowTooltip(false)}
                    onClick={() => {
                      if (!navigator.geolocation) return
                      setLocating(true)
                      navigator.geolocation.getCurrentPosition(
                        async (pos) => {
                          try {
                            const { latitude, longitude } = pos.coords
                            const res = await fetch(
                              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                            )
                            const data = await res.json()
                            const code = data?.address?.country_code?.toUpperCase()
                            const mapped = code ? GEO_TO_COUNTRY[code] ?? null : null
                            if (mapped) setCountry(mapped)
                          } catch {
                            // ignore
                          } finally {
                            setLocating(false)
                          }
                        },
                        () => setLocating(false),
                        { timeout: 5000 }
                      )
                    }}
                    className="cursor-pointer inline-flex size-8 items-center justify-center rounded-lg border border-blue-300/20 bg-blue-400/[8%] text-white/50 transition-colors hover:border-teal-accent/40 hover:bg-teal-accent/10 hover:text-teal-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
                  >
                    {locating
                      ? <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      : <LocateFixed className="size-4" aria-hidden="true" />
                    }
                  </button>

                  {showTooltip && !locating && (
                    <div
                      role="tooltip"
                      className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-xl border border-blue-300/20 bg-blue-400/[8%] px-3 py-1.5 text-xs font-medium text-white shadow-xl shadow-black/20 backdrop-blur-md"
                    >
                      {t("useMyLocation")}
                      <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-blue-300/20" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2 — City input (slides in after country selected) */}
            {country && (
              <div className="flex items-center gap-2">
                {(() => {
                  const FlagComponent = (Flags as unknown as Record<string, React.ComponentType<{ style?: React.CSSProperties; className?: string }>>)[country]
                  return FlagComponent ? (
                    <span aria-hidden="true" className="shrink-0">
                      <FlagComponent
                        style={{ width: 20, height: 14 }}
                        className="rounded-sm"
                      />
                    </span>
                  ) : null
                })()}
                <input
                  ref={cityInputRef}
                  type="text"
                  placeholder={t(`cityPlaceholders.${country}`)}
                  className="w-full bg-transparent text-lg font-medium text-white placeholder:text-white/50 focus:outline-none"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                  type="button"
                  onClick={() => { setCountry(null); setCity("") }}
                  className="cursor-pointer shrink-0 inline-flex size-6 items-center justify-center rounded-md text-white/30 transition-colors hover:text-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
                  aria-label={t("countryLabel")}
                >
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="hidden w-px self-stretch bg-white/10 lg:block" />

        {/* Spécialité */}
        <div className="flex flex-1 items-center gap-3 px-5 py-3">
          <Waves className="size-6 shrink-0 text-teal-accent" />
          <div className="flex w-full items-center">
            <Select value={specialty} onValueChange={(v) => setSpecialty(v ?? "all")}>
              <SelectTrigger className={cn(
                "h-auto w-full gap-2 rounded-none border-0 p-0 text-lg font-medium shadow-none outline-none",
                "bg-transparent hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent",
                "focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0",
                "data-[size=default]:h-auto [&_svg]:text-white [&_svg:not([class*='size-'])]:size-4",
                "dark:data-[state=open]:bg-transparent",
                specialty !== "all"
                  ? "text-teal-accent [&_svg]:text-teal-accent"
                  : "text-white data-[state=open]:text-teal-accent data-[state=open]:[&_svg]:text-teal-accent"
              )}>
                <SelectValue placeholder={t("specialtyPlaceholder")}>
                  {(value: string | null) =>
                    value && value !== "all"
                      ? t(`specialtyOptions.${value}`)
                      : t("specialtyPlaceholder")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent
                alignItemWithTrigger={false}
                className="min-w-[var(--anchor-width)] rounded-2xl border border-blue-300/20 bg-blue-400/[8%] text-white shadow-xl shadow-black/20 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] [&_[data-slot=select-item]]:text-white [&_[data-slot=select-item]]:focus:bg-white/10 [&_[data-slot=select-item]]:focus:text-white"
              >
                {specialtyKeys.map((key) => (
                  <SelectItem key={key} value={key}>
                    {t(`specialtyOptions.${key}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="hidden w-px self-stretch bg-white/10 lg:block" />

        {/* Date */}
        <div className="flex flex-1 items-center gap-3 px-5 py-3">
          <Calendar className="size-6 shrink-0 text-teal-accent" />
          <div className="flex items-center">
            <DatePickerField
              value={date}
              onChange={setDate}
              placeholder={t("datePlaceholder")}
              locale={locale}
              ariaLabel={t("dateLabel")}
            />
          </div>
        </div>

        {/* CTA */}
        <div className="flex shrink-0 items-stretch lg:pl-3">
          <Button
            variant="entry"
            type="button"
            className="h-full w-full rounded-xl lg:w-auto"
            onClick={handleSearch}
          >
            {t("cta")}
          </Button>
        </div>
      </div>
    </div>
  )
}