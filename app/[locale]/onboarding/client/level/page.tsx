"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { ChevronLeft, Sprout, TrendingUp, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { OnboardingShell } from "@/components/onboarding/onboarding-shell"
import { useClientOnboardingStore } from "@/lib/stores/onboarding-client-store"
import type { ClientLevel } from "@/types/client"

const LEVELS: ClientLevel[] = ["beginner", "intermediate", "advanced"]

function LevelIcon({ level, className }: { level: ClientLevel; className?: string }) {
  switch (level) {
    case "beginner": return <Sprout className={className} aria-hidden="true" />
    case "intermediate": return <TrendingUp className={className} aria-hidden="true" />
    case "advanced": return <Trophy className={className} aria-hidden="true" />
  }
}

interface LevelCardProps {
  level: ClientLevel
  label: string
  description: string
  selected: boolean
  onClick: () => void
}

function LevelCard({ level, label, description, selected, onClick }: LevelCardProps) {
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
        <LevelIcon level={level} className={cn("size-5", selected ? "text-teal-accent" : "text-teal-accent/60")} />
      </div>
      <div className="flex-1">
        <p className={cn("text-sm font-semibold", selected ? "text-white" : "text-white/70")}>{label}</p>
        <p className="mt-0.5 text-xs text-white/40">{description}</p>
      </div>
      {selected && (
        <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-teal-accent">
          <svg className="size-3" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="#0a1f3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </button>
  )
}

export default function OnboardingClientStep4() {
  const t = useTranslations("onboarding.client.level")
  const tStep = useTranslations("onboarding.step")
  const router = useRouter()
  const { data, setStep4 } = useClientOnboardingStore()

  const [level, setLevel] = useState<ClientLevel | null>(data.level)

  function handleContinue() {
    if (!level) return
    setStep4(level)
    router.push("/onboarding/client/languages")
  }

  function handleBack() {
    router.push("/onboarding/client/location")
  }

  return (
    <OnboardingShell current={4} total={6}>
      <button
        type="button"
        onClick={handleBack}
        className="mb-4 inline-flex cursor-pointer items-center gap-1.5 text-sm text-white/40 transition-colors hover:text-white focus-visible:outline-none"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        {tStep("back")}
      </button>

      <div className="mb-6 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
          {tStep("of", { current: 4, total: 6 })}
        </p>
        <div className="mb-4 flex items-center justify-center gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === 3 ? "w-6 bg-teal-accent"
              : i < 3 ? "w-2 bg-teal-accent/40"
              : "w-2 bg-white/20"
            )} />
          ))}
        </div>
        <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
        <p className="mt-1 text-sm text-white/50">{t("subtitle")}</p>
      </div>

      <div className="flex flex-col gap-3">
        {LEVELS.map((lvl) => (
          <LevelCard
            key={lvl}
            level={lvl}
            label={t(`${lvl}Label`)}
            description={t(`${lvl}Desc`)}
            selected={level === lvl}
            onClick={() => setLevel(lvl)}
          />
        ))}
      </div>

      <Button
        variant="entry"
        onClick={handleContinue}
        disabled={!level}
        className="mt-6 w-full"
      >
        {t("continue")}
      </Button>
    </OnboardingShell>
  )
}
