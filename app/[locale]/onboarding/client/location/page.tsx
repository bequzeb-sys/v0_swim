"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { Check, MapPin } from "lucide-react"
import { Popover } from "@base-ui/react/popover"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { OnboardingShell } from "@/components/onboarding/onboarding-shell"
import { useClientOnboardingStore } from "@/lib/stores/onboarding-client-store"
import * as Flags from "country-flag-icons/react/3x2"

const COUNTRIES = [
  { code: "FR" },
  { code: "RE" },
  { code: "BE" },
  { code: "CH" },
  { code: "CA" },
  { code: "MA" },
  { code: "SN" },
  { code: "MU" },
]

export default function OnboardingClientStep3() {
  const t = useTranslations("onboarding.client.location")
  const tStep = useTranslations("onboarding.step")
  const tCountries = useTranslations("search.countries")
  const router = useRouter()
  const { data, setStep3 } = useClientOnboardingStore()

  const [location, setLocation] = useState(data.location)
  const [country, setCountry] = useState(data.country || "FR")
  const [countryOpen, setCountryOpen] = useState(false)

  const selectedFlag = (Flags as unknown as Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>>)[country]
  const SelectedFlag = selectedFlag

  function handleContinue() {
    if (!location.trim() || !country) return
    setStep3(location.trim(), country)
    router.push("/onboarding/client/level")
  }

  return (
    <OnboardingShell current={3} total={5}>
      <div className="mb-6 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
          {tStep("of", { current: 3, total: 5 })}
        </p>
        <div className="mb-4 flex items-center justify-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={cn(
              "h-2 rounded-full transition-all duration-300",
              i < 3 ? "w-6 bg-teal-accent"
              : i === 3 ? "w-2 bg-teal-accent/40"
              : "w-2 bg-white/20"
            )} />
          ))}
        </div>
        <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
        <p className="mt-1 text-sm text-white/50">{t("subtitle")}</p>
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-medium text-white/50">
          {t("countryLabel")} *
        </label>
        <Popover.Root open={countryOpen} onOpenChange={setCountryOpen}>
          <Popover.Trigger
            className={cn(
              "flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
              countryOpen
                ? "border-teal-accent/40 bg-teal-accent/10 text-white"
                : "border-white/10 bg-white/5 text-white/70 hover:border-teal-accent/20 hover:text-white"
            )}
          >
            <div className="flex items-center gap-2">
              {SelectedFlag && <SelectedFlag className="size-5 rounded-sm" />}
              <span>{tCountries(country as Parameters<typeof tCountries>[0])}</span>
            </div>
            <MapPin className="size-4 shrink-0 text-white/40" aria-hidden="true" />
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner sideOffset={8} align="start" className="z-50 w-[var(--anchor-width)]">
              <Popover.Popup className="rounded-2xl border border-white/10 bg-white/[8%] p-1.5 shadow-xl shadow-black/20 backdrop-blur-md text-white data-[state=open]:animate-in data-[state=closed]:animate-out">
                <div className="flex max-h-56 flex-col gap-0.5 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {COUNTRIES.map(({ code }) => {
                    const Flag = (Flags as unknown as Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>>)[code]
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => { setCountry(code); setCountryOpen(false) }}
                        className={cn(
                          "flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
                          country === code
                            ? "bg-teal-accent/10 text-teal-accent"
                            : "text-white/70 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        {Flag && <Flag className="size-5 rounded-sm" aria-hidden="true" />}
                        <span>{tCountries(code as Parameters<typeof tCountries>[0])}</span>
                        {country === code && (
                          <Check className="ml-auto size-4 text-teal-accent" aria-hidden="true" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </div>

      <div className="mb-6">
        <label className="mb-1.5 block text-xs font-medium text-white/50">{t("locationLabel")} *</label>
        <Input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder={t("locationPlaceholder")}
        />
      </div>

      <Button
        variant="entry"
        onClick={handleContinue}
        disabled={!location.trim() || !country}
        className="w-full"
      >
        {t("continue")}
      </Button>
    </OnboardingShell>
  )
}
