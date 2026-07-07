"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { useCoachOnboardingStore } from "@/lib/stores/onboarding-coach-store"
import type { CoachBadgeKey } from "@/types/coach"
import { cn } from "@/lib/utils"
import { StepIndicator } from "@/components/onboarding/step-indicator"
import { Button } from "@/components/ui/button"

const ALL_BADGE_KEYS: CoachBadgeKey[] = [
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

function SpecialtyCard({
  specialty,
  selected,
  onClick,
}: {
  specialty: CoachBadgeKey
  selected: boolean
  onClick: () => void
}) {
  const t = useTranslations("onboarding.coach.specialty")
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[4%] p-4 text-left transition-all hover:border-blue-accent/40 hover:bg-white/[6%] active:scale-[0.98]"
    >
      <div
        className={`flex size-5 shrink-0 items-center justify-center rounded-md border transition-all ${
          selected
            ? "border-blue-accent bg-blue-accent"
            : "border-white/20 bg-transparent"
        }`}
      >
        {selected && (
          <svg className="size-3 text-white" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className={`text-sm font-medium ${selected ? "text-white" : "text-white/70"}`}>
        {t(specialty)}
      </span>
    </button>
  )
}

export default function OnboardingCoachPage() {
  const t = useTranslations("onboarding.coach.specialty")
  const router = useRouter()
  const { data, setStep1 } = useCoachOnboardingStore()

  const [selected, setSelected] = useState<Set<CoachBadgeKey>>(
    new Set(data.badgeKeys as CoachBadgeKey[])
  )
  const [featuredKeys, setFeaturedKeys] = useState<CoachBadgeKey[]>(data.featuredBadgeKeys)
  const [showFeatured, setShowFeatured] = useState(data.badgeKeys.length > 0)

  function toggle(s: CoachBadgeKey) {
    const next = new Set(selected)
    if (next.has(s)) {
      next.delete(s)
      setFeaturedKeys((prev) => prev.filter((k) => k !== s))
    } else {
      next.add(s)
    }
    setSelected(next)
    setShowFeatured(next.size > 0)
  }

  function handleContinue() {
    if (selected.size === 0) return
    setStep1(Array.from(selected), featuredKeys)
    router.push("/onboarding/coach/profile")
  }

  return (
    <OnboardingShell current={1} total={4}>
      <StepIndicator current={1} total={4} />
      <h1 className="mt-6 text-xl font-bold text-white">{t("title")}</h1>
      <p className="mt-1 text-sm text-white/50">{t("subtitle")}</p>
      <div className="mt-6 flex flex-col gap-2">
        {ALL_BADGE_KEYS.map((s) => (
          <SpecialtyCard
            key={s}
            specialty={s}
            selected={selected.has(s)}
            onClick={() => toggle(s)}
          />
        ))}
      </div>

      {selected.size > 0 && (
        <div className="mt-6 rounded-2xl border border-teal-accent/20 bg-teal-accent/5 p-4">
          <p className="mb-3 text-sm font-medium text-white/70">
            {t("featuredTitle")}{" "}
            <span className="text-teal-accent">({featuredKeys.length}/2)</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {Array.from(selected).map((key) => {
              const isFeatured = featuredKeys.includes(key)
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    if (isFeatured) {
                      setFeaturedKeys(featuredKeys.filter((k) => k !== key))
                    } else if (featuredKeys.length < 2) {
                      setFeaturedKeys([...featuredKeys, key])
                    }
                  }}
                  className={cn(
                    "cursor-pointer rounded-xl border px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
                    isFeatured
                      ? "border-teal-accent bg-teal-accent text-navy-deep"
                      : "border-white/20 bg-white/5 text-white/60 hover:border-teal-accent/40 hover:text-white"
                  )}
                >
                  {isFeatured ? "★ " : ""}{t(key)}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <Button
        type="button"
        onClick={handleContinue}
        disabled={selected.size === 0}
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
