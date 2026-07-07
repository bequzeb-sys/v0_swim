"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { useCoachOnboardingStore } from "@/lib/stores/onboarding-coach-store"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { StepIndicator } from "@/components/onboarding/step-indicator"
import { LanguageFlag } from "@/components/ui/language-flag"
import { Pill } from "@/components/ui/pill"
import { Button } from "@/components/ui/button"
import type { LanguageCode } from "@/lib/coaches"
import * as Flags from "country-flag-icons/react/3x2"
import { Popover } from "@base-ui/react/popover"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const ALL_LANGUAGE_CODES: LanguageCode[] = [
  "fr",
  "en",
  "es",
  "de",
  "it",
  "ar",
  "zh",
  "pt",
  "ru",
  "ja",
]

const MAX_LANGUAGES = 4

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

export default function OnboardingCoachProfilePage() {
  const t = useTranslations("onboarding.coach.profile")
  const tSearch = useTranslations("search")
  const tl = useTranslations("languages")
  const router = useRouter()

  const { data, setStep2 } = useCoachOnboardingStore()

  const [bio, setBio] = useState(data.bio)
  const [city, setCity] = useState(data.city)
  const [country, setCountry] = useState(data.country)
  const [price, setPrice] = useState(data.price)
  const [certification, setCertification] = useState(data.certification)
  const [selectedLanguages, setSelectedLanguages] = useState<LanguageCode[]>(data.languages)
  const [countryOpen, setCountryOpen] = useState(false)

  function handleContinue() {
    setStep2({ bio, city, country, price, certification, languages: selectedLanguages })
    router.push("/onboarding/coach/availability")
  }

  return (
    <OnboardingShell current={2} total={4}>
      <StepIndicator current={2} total={4} />
      <h1 className="mt-6 text-xl font-bold text-white">{t("title")}</h1>
      <p className="mt-1 text-sm text-white/50">{t("subtitle")}</p>
      <div className="mt-6 flex flex-col gap-4">
        <Textarea
          label={t("bioLabel")}
          placeholder={t("bioPlaceholder")}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        {/* Country picker */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-white/70">
            {t("countryLabel")}
          </label>
          <Popover.Root open={countryOpen} onOpenChange={setCountryOpen}>
            <Popover.Trigger className={cn(
            "flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-teal-accent/60",
            countryOpen
              ? "border-teal-accent/40 bg-teal-accent/10 text-white"
              : "border-blue-300/20 bg-blue-400/[8%] text-white/70 hover:text-white"
          )}>
              {country ? (
                <span className="flex items-center gap-2 text-white">
                  {(() => {
                    const F = (Flags as unknown as Record<string, React.ComponentType<{ style?: React.CSSProperties; className?: string }>>)[country]
                    return F ? <span aria-hidden="true"><F style={{ width: 20, height: 14 }} className="rounded-sm" /></span> : null
                  })()}
                  {tSearch(`countries.${country}`)}
                </span>
              ) : (
                <span>{t("countryPlaceholder")}</span>
              )}
              <ChevronDown className={cn("size-4 shrink-0 text-white/40 transition-transform duration-200", countryOpen && "rotate-180")} aria-hidden="true" />
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Positioner sideOffset={8} align="start" className="z-50">
                <Popover.Popup className="min-w-[var(--anchor-width)] rounded-2xl border border-blue-300/20 bg-blue-400/[8%] py-1.5 shadow-xl shadow-black/20 backdrop-blur-md">
                  <div className="relative">
                    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10 h-6 rounded-t-2xl bg-gradient-to-b from-blue-400/[12%] to-transparent" />
                    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6 rounded-b-2xl bg-gradient-to-t from-blue-400/[12%] to-transparent" />
                    <ul role="listbox" aria-label={t("countryLabel")} className="max-h-48 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
        </div>

        <Input
          label={t("cityLabel")}
          placeholder={t("cityPlaceholder")}
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="coach-price"
            className="text-sm font-medium text-white/70"
          >
            {t("priceLabel")}
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-sm text-white/40">
              €
            </span>
            <input
              id="coach-price"
              type="number"
              min="1"
              placeholder="45"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-7 pr-3.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-teal-accent focus:bg-white/[7%] focus:ring-1 focus:ring-teal-accent/30"
            />
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-xs text-white/30">
              {t("priceUnit")}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-white/70">{t("certificationLabel")}</label>
          <Input
            type="text"
            placeholder={t("certificationPlaceholder")}
            value={certification}
            onChange={(e) => setCertification(e.target.value)}
          />
        </div>

        {/* Languages */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-white/70">
              {t("languagesLabel")}
            </label>
            <span className="text-xs text-white/30">{t("languagesHint")}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {ALL_LANGUAGE_CODES.map((code) => {
              const selected = selectedLanguages.includes(code)
              return (
                <Pill
                  key={code}
                  selected={selected}
                  className="gap-1.5 px-2.5 py-1.5"
                  icon={<LanguageFlag code={code} size={16} />}
                  onClick={() => {
                    if (selected) {
                      setSelectedLanguages((prev) =>
                        prev.filter((c) => c !== code)
                      )
                    } else if (selectedLanguages.length < MAX_LANGUAGES) {
                      setSelectedLanguages((prev) => [...prev, code])
                    }
                  }}
                >
                  {tl(code)}
                </Pill>
              )
            })}
          </div>
          {selectedLanguages.length === MAX_LANGUAGES && (
            <p className="text-xs text-white/30">{t("languagesMax")}</p>
          )}
        </div>
      </div>
      <Button
        type="button"
        onClick={handleContinue}
        variant="entry"
        className="mt-6 w-full text-sm active:scale-[0.98]"
      >
        {t("continue")}
      </Button>
    </OnboardingShell>
  )
}

function OnboardingShell({
  children,
  current,
  total,
}: {
  children: React.ReactNode
  current: number
  total: number
}) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-top bg-no-repeat"
          style={{ backgroundImage: "url('/underwater-hero.webp')" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(5,11,26,0.15) 0%, rgba(5,11,26,0.45) 35%, rgba(5,11,26,0.85) 62%, #050B1A 85%)",
          }}
        />
      </div>
      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-8 shadow-2xl shadow-black/20 backdrop-blur-md">
        {children}
      </div>
    </main>
  )
}
