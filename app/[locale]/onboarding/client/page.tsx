"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { StepIndicator } from "@/components/onboarding/step-indicator"
import { OnboardingShell } from "@/components/onboarding/onboarding-shell"
import { Button } from "@/components/ui/button"

const GOALS = ["learnToSwim", "improveTechnique", "trainCompetition", "fitness"] as const
type Goal = (typeof GOALS)[number]

function GoalCard({
  goal,
  selected,
  onClick,
}: {
  goal: Goal
  selected: boolean
  onClick: () => void
}) {
  const t = useTranslations(`onboarding.client.goals`)
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[4%] p-4 text-left transition-all hover:border-teal-accent/40 hover:bg-white/[6%] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60 active:scale-[0.98]"
    >
      <div
        className={`flex size-5 shrink-0 items-center justify-center rounded-md border transition-all ${
          selected
            ? "border-teal-accent bg-teal-accent"
            : "border-white/20 bg-transparent"
        }`}
      >
        {selected && (
          <svg className="size-3 text-deep" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className={`text-sm font-medium ${selected ? "text-white" : "text-white/70"}`}>
        {t(goal)}
      </span>
    </button>
  )
}

export default function OnboardingClientPage() {
  const t = useTranslations("onboarding.client.goals")
  const tLocation = useTranslations("onboarding.client.location")
  const router = useRouter()
  const [selected, setSelected] = useState<Goal | null>(null)

  function handleContinue() {
    const params = new URLSearchParams({ step: "2" })
    router.push({
      pathname: "/onboarding/client/location",
      query: Object.fromEntries(params),
    })
  }

  return (
    <OnboardingShell current={1} total={3}>
      <StepIndicator current={1} total={3} />
      <h1 className="mt-6 text-xl font-bold text-white">{t("title")}</h1>
      <p className="mt-1 text-sm text-white/50">{t("subtitle")}</p>
      <div className="mt-6 flex flex-col gap-2">
        {GOALS.map((goal) => (
          <GoalCard
            key={goal}
            goal={goal}
            selected={selected === goal}
            onClick={() => setSelected(goal)}
          />
        ))}
      </div>
      <Button
        type="button"
        onClick={handleContinue}
        disabled={!selected}
        variant="entry"
        className="mt-6 w-full text-sm active:scale-[0.98]"
      >
        {tLocation("continue")}
      </Button>
    </OnboardingShell>
  )
}
