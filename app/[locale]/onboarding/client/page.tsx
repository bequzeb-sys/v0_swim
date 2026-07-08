"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { OnboardingShell } from "@/components/onboarding/onboarding-shell"
import { useClientOnboardingStore } from "@/lib/stores/onboarding-client-store"
import { useAuth } from "@/lib/auth/auth-context"

export default function OnboardingClientStep1() {
  const t = useTranslations("onboarding.client.name")
  const tStep = useTranslations("onboarding.step")
  const router = useRouter()
  const { user } = useAuth()
  const { data, setStep1 } = useClientOnboardingStore()

  const [displayName, setDisplayName] = useState(
    data.displayName || user?.name || ""
  )

  const isValid = displayName.trim().length >= 2

  function handleContinue() {
    if (!isValid) return
    setStep1(displayName.trim())
    router.push("/onboarding/client/avatar")
  }

  return (
    <OnboardingShell current={1} total={5}>
      <div className="mb-6 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
          {tStep("of", { current: 1, total: 5 })}
        </p>
        <div className="mb-4 flex items-center justify-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === 0 ? "w-6 bg-teal-accent"
              : i < 0 ? "w-2 bg-teal-accent/40"
              : "w-2 bg-white/20"
            )} />
          ))}
        </div>
        <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
        <p className="mt-1 text-sm text-white/50">{t("subtitle")}</p>
      </div>

      <div className="mb-6">
        <label className="mb-1.5 block text-xs font-medium text-white/50">
          {t("label")} *
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30" aria-hidden="true" />
          <Input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={t("placeholder")}
            className="pl-9"
            autoFocus
            maxLength={50}
            onKeyDown={(e) => e.key === "Enter" && handleContinue()}
          />
        </div>
        {displayName.trim().length > 0 && displayName.trim().length < 2 && (
          <p className="mt-1.5 text-xs text-red-400/70">{t("minLength")}</p>
        )}
      </div>

      <Button
        variant="entry"
        onClick={handleContinue}
        disabled={!isValid}
        className="w-full"
      >
        {t("continue")}
      </Button>
    </OnboardingShell>
  )
}
