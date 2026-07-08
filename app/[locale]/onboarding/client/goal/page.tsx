"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { Activity, Check, Target, Trophy, WavesLadder } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { OnboardingShell } from "@/components/onboarding/onboarding-shell"
import { useClientOnboardingStore } from "@/lib/stores/onboarding-client-store"
import type { ClientGoal } from "@/types/client"

const GOALS: ClientGoal[] = ["learnToSwim", "improveTechnique", "trainCompetition", "fitness"]

function GoalIcon({ goal, className }: { goal: ClientGoal; className?: string }) {
  switch (goal) {
    case "learnToSwim": return <WavesLadder className={className} aria-hidden="true" />
    case "improveTechnique": return <Target className={className} aria-hidden="true" />
    case "trainCompetition": return <Trophy className={className} aria-hidden="true" />
    case "fitness": return <Activity className={className} aria-hidden="true" />
  }
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
      <div className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors",
        selected ? "bg-teal-accent/20" : "bg-teal-accent/10"
      )}>
        <GoalIcon goal={goal} className={cn("size-5", selected ? "text-teal-accent" : "text-teal-accent/60")} />
      </div>
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

export default function OnboardingClientStep5() {
  const t = useTranslations("onboarding.client.goal")
  const tStep = useTranslations("onboarding.step")
  const router = useRouter()
  const { data, setStep5 } = useClientOnboardingStore()
  const [selected, setSelected] = useState<ClientGoal | null>(data.goal)

  function handleContinue() {
    if (!selected) return
    setStep5(selected)
    router.push("/onboarding/client/done")
  }

  return (
    <OnboardingShell current={5} total={5}>
      <div className="mb-6 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
          {tStep("of", { current: 5, total: 5 })}
        </p>
        <div className="mb-4 flex items-center justify-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={cn(
              "h-2 rounded-full transition-all duration-300",
              i < 5 ? "w-6 bg-teal-accent" : "w-2 bg-white/20"
            )} />
          ))}
        </div>
        <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
        <p className="mt-1 text-sm text-white/50">{t("subtitle")}</p>
      </div>

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
