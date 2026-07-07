"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { OnboardingShell } from "@/components/onboarding/onboarding-shell"
import { useClientOnboardingStore } from "@/lib/stores/onboarding-client-store"
import type { ClientGoal } from "@/types/client"

const GOALS: ClientGoal[] = ["learnToSwim", "improveTechnique", "trainCompetition", "fitness"]

// Goal icons mapping
const GOAL_ICONS: Record<ClientGoal, string> = {
  learnToSwim: "🏊",
  improveTechnique: "🎯",
  trainCompetition: "🏆",
  fitness: "💪",
}

interface GoalCardProps {
  goal: ClientGoal
  label: string
  selected: boolean
  onClick: () => void
}

function GoalCard({ goal, label, selected, onClick }: GoalCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex cursor-pointer items-center gap-4 rounded-xl border p-4 text-left transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
        selected
          ? "border-teal-accent/40 bg-teal-accent/10"
          : "border-white/10 bg-white/[4%] hover:border-teal-accent/20 hover:bg-white/[6%]"
      )}
    >
      <span className="text-2xl" aria-hidden="true">{GOAL_ICONS[goal]}</span>
      <span className={cn("text-sm font-medium", selected ? "text-white" : "text-white/70")}>
        {label}
      </span>
      {selected && (
        <div className="absolute right-4 flex size-5 items-center justify-center rounded-full bg-teal-accent">
          <Check className="size-3 text-navy-deep" aria-hidden="true" />
        </div>
      )}
    </button>
  )
}

export default function OnboardingClientStep1() {
  const t = useTranslations("onboarding.client.goals")
  const tStep = useTranslations("onboarding.step")
  const router = useRouter()
  const { data, setStep1 } = useClientOnboardingStore()
  const [selected, setSelected] = useState<ClientGoal | null>(data.goal)

  function handleContinue() {
    if (!selected) return
    setStep1(selected)
    router.push("/onboarding/client/location")
  }

  return (
    <OnboardingShell current={1} total={3}>
      {/* Step indicator */}
      <div className="mb-6 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
          {tStep("of", { current: 1, total: 3 })}
        </p>
        <div className="mb-4 flex items-center justify-center gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === 0 ? "w-6 bg-teal-accent" : "w-2 bg-white/20"
              )}
            />
          ))}
        </div>
        <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
        <p className="mt-1 text-sm text-white/50">{t("subtitle")}</p>
      </div>

      {/* Goal cards */}
      <div className="flex flex-col gap-3">
        {GOALS.map((goal) => (
          <GoalCard
            key={goal}
            goal={goal}
            label={t(goal)}
            selected={selected === goal}
            onClick={() => setSelected(goal)}
          />
        ))}
      </div>

      {/* Continue */}
      <Button
        variant="entry"
        onClick={handleContinue}
        disabled={!selected}
        className="mt-6 w-full"
      >
        {t("continue")}
      </Button>
    </OnboardingShell>
  )
}
