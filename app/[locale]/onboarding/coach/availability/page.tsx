"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { useCoachOnboardingStore } from "@/lib/stores/onboarding-coach-store"
import type { DayKey } from "@/types/coach"
import { StepIndicator } from "@/components/onboarding/step-indicator"
import { OnboardingShell } from "@/components/onboarding/onboarding-shell"
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
      className={`cursor-pointer rounded-xl border px-4 py-2 text-sm font-medium transition-all active:scale-[0.97] ${
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
  const { data, setStep3 } = useCoachOnboardingStore()
  const [selected, setSelected] = useState<Set<DayKey>>(
    new Set(data.availability as DayKey[])
  )

  function toggle(day: DayKey) {
    const next = new Set(selected)
    if (next.has(day)) next.delete(day)
    else next.add(day)
    setSelected(next)
  }

  function handleContinue() {
    setStep3(Array.from(selected))
    router.push("/onboarding/coach/done")
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
