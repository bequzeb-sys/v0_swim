"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { StepIndicator } from "@/components/onboarding/step-indicator"
import { Button } from "@/components/ui/button"

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const
type Day = (typeof DAYS)[number]

function DayPill({
  day,
  selected,
  onClick,
}: {
  day: Day
  selected: boolean
  onClick: () => void
}) {
  const t = useTranslations("onboarding.coach.availability")
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-2 text-sm font-medium transition-all active:scale-[0.97] ${
        selected
          ? "border-blue-accent bg-blue-accent/15 text-blue-accent"
          : "border-white/10 bg-white/[4%] text-white/60 hover:border-white/20 hover:text-white/80"
      }`}
    >
      {t(day)}
    </button>
  )
}

export default function OnboardingCoachAvailabilityPage() {
  const t = useTranslations("onboarding.coach.availability")
  const router = useRouter()
  const [selected, setSelected] = useState<Set<Day>>(new Set())

  function toggle(day: Day) {
    const next = new Set(selected)
    if (next.has(day)) next.delete(day)
    else next.add(day)
    setSelected(next)
  }

  function handleContinue() {
    const params = new URLSearchParams({ step: "4" })
    router.push({
      pathname: "/onboarding/coach/done",
      query: Object.fromEntries(params),
    })
  }

  return (
    <OnboardingShell current={3} total={4}>
      <StepIndicator current={3} total={4} />
      <h1 className="mt-6 text-xl font-bold text-white">{t("title")}</h1>
      <p className="mt-1 text-sm text-white/50">{t("subtitle")}</p>
      <div className="mt-6 grid grid-cols-4 gap-2">
        {DAYS.map((day) => (
          <DayPill
            key={day}
            day={day}
            selected={selected.has(day)}
            onClick={() => toggle(day)}
          />
        ))}
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
