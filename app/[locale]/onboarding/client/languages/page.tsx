"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { OnboardingShell } from "@/components/onboarding/onboarding-shell"
import { useClientOnboardingStore } from "@/lib/stores/onboarding-client-store"

const LANGUAGES = ["fr", "en", "es", "de", "it", "pt", "ar", "zh", "ru", "ja"] as const

export default function OnboardingClientStep5() {
  const t = useTranslations("onboarding.client.languages")
  const tLanguages = useTranslations("languages")
  const tStep = useTranslations("onboarding.step")
  const router = useRouter()
  const { data, setStep5 } = useClientOnboardingStore()
  const [languages, setLanguages] = useState<string[]>(
    data.languages.length > 0 ? data.languages : ["fr"]
  )

  function toggleLanguage(code: string) {
    setLanguages((prev) => {
      if (prev.includes(code)) return prev.filter((l) => l !== code)
      if (prev.length >= 4) return prev
      return [...prev, code]
    })
  }

  const isValid = languages.length > 0

  function handleContinue() {
    if (!isValid) return
    setStep5(languages)
    router.push("/onboarding/client/goal")
  }

  function handleBack() {
    router.push("/onboarding/client/level")
  }

  return (
    <OnboardingShell current={5} total={6}>
      <div className="mb-6 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
          {tStep("of", { current: 5, total: 6 })}
        </p>
        <div className="mb-4 flex items-center justify-center gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === 4
                  ? "w-6 bg-teal-accent"
                  : i < 4
                  ? "w-2 bg-teal-accent/40"
                  : "w-2 bg-white/20"
              )}
            />
          ))}
        </div>

        <h1 className="mb-1 text-2xl font-bold text-white">{t("title")}</h1>
        <p className="mb-2 text-sm text-white/50">{t("subtitle")}</p>
        <p className="mb-6 text-xs text-white/30">
          {languages.length}/4 {t("max")}
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {LANGUAGES.map((code) => {
          const isSelected = languages.includes(code)
          return (
            <button
              key={code}
              type="button"
              onClick={() => toggleLanguage(code)}
              className={cn(
                "cursor-pointer rounded-xl border px-4 py-2 text-sm font-medium transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
                isSelected
                  ? "border-teal-accent/40 bg-teal-accent/10 text-teal-accent"
                  : "border-white/10 bg-white/5 text-white/60 hover:border-teal-accent/20 hover:text-white"
              )}
            >
              {tLanguages(code)}
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex size-11 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition-colors hover:border-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>

        <Button
          variant="entry"
          onClick={handleContinue}
          disabled={!isValid}
          className="flex-1"
        >
          {t("continue")}
        </Button>

        <button
          type="button"
          onClick={handleContinue}
          disabled={!isValid}
          className="inline-flex size-11 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition-colors hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
      </div>
    </OnboardingShell>
  )
}
