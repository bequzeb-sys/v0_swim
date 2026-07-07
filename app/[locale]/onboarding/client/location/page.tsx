"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { Input } from "@/components/ui/input"
import { StepIndicator } from "@/components/onboarding/step-indicator"
import { OnboardingShell } from "@/components/onboarding/onboarding-shell"
import { Button } from "@/components/ui/button"

const LEVELS = ["beginner", "intermediate", "advanced"] as const
type Level = (typeof LEVELS)[number]

function LevelPill({
  level,
  selected,
  onClick,
}: {
  level: Level
  selected: boolean
  onClick: () => void
}) {
  const t = useTranslations("onboarding.client.location")
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-xl border px-4 py-2 text-sm font-medium transition-all active:scale-[0.97] ${
        selected
          ? "border-teal-accent bg-teal-accent/15 text-teal-accent"
          : "border-white/10 bg-white/[4%] text-white/60 hover:border-white/20 hover:text-white/80"
      }`}
    >
      {t(`level${level.charAt(0).toUpperCase() + level.slice(1)}`)}
    </button>
  )
}

export default function OnboardingClientLocationPage() {
  return (
    <Suspense fallback={null}>
      <OnboardingClientLocationPageInner />
    </Suspense>
  )
}

function OnboardingClientLocationPageInner() {
  const t = useTranslations("onboarding.client.location")
  const router = useRouter()

  const [location, setLocation] = useState("")
  const [level, setLevel] = useState<Level | null>(null)

  function handleContinue() {
    const params = new URLSearchParams({ step: "3" })
    router.push({
      pathname: "/onboarding/client/done",
      query: Object.fromEntries(params),
    })
  }

  return (
    <OnboardingShell current={2} total={3}>
      <StepIndicator current={2} total={3} />
      <h1 className="mt-6 text-xl font-bold text-white">{t("title")}</h1>
      <p className="mt-1 text-sm text-white/50">{t("subtitle")}</p>
      <div className="mt-6 flex flex-col gap-4">
        <Input
          label={t("locationLabel")}
          placeholder={t("locationPlaceholder")}
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-white/70">{t("levelLabel")}</p>
          <div className="flex gap-2">
            {LEVELS.map((l) => (
              <LevelPill
                key={l}
                level={l}
                selected={level === l}
                onClick={() => setLevel(l)}
              />
            ))}
          </div>
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
