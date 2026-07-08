"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { OnboardingShell } from "@/components/onboarding/onboarding-shell"
import { useClientOnboardingStore } from "@/lib/stores/onboarding-client-store"
import type { ClientGender } from "@/types/client"

const GENDERS: { value: ClientGender; labelKey: string }[] = [
  { value: "male", labelKey: "gender.male" },
  { value: "female", labelKey: "gender.female" },
  { value: "neutral", labelKey: "gender.neutral" },
]

export default function OnboardingClientStep2() {
  const t = useTranslations("onboarding.client.avatar")
  const tStep = useTranslations("onboarding.step")
  const router = useRouter()
  const { data, setStep2 } = useClientOnboardingStore()

  const [avatarSeed, setAvatarSeed] = useState(data.avatarSeed)
  const [selectedGender, setSelectedGender] = useState<ClientGender>(
    data.avatarOptions.gender
  )

  function handleContinue() {
    if (!avatarSeed.trim()) return
    setStep2(
      "generated",
      avatarSeed,
      { ...data.avatarOptions, gender: selectedGender },
      ""
    )
    router.push("/onboarding/client/level")
  }

  const isValid = avatarSeed.trim().length >= 2

  return (
    <OnboardingShell current={2} total={5}>
      <div className="mb-6 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
          {tStep("of", { current: 2, total: 5 })}
        </p>
        <div className="mb-4 flex items-center justify-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={cn(
              "h-2 rounded-full transition-all duration-300",
              i < 2 ? "w-6 bg-teal-accent" : "w-2 bg-white/20"
            )} />
          ))}
        </div>
        <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
        <p className="mt-1 text-sm text-white/50">{t("subtitle")}</p>
      </div>

      {/* Avatar preview */}
      <div className="mb-6 flex justify-center">
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-teal-accent/30 to-blue-400/20">
            <User className="size-12 text-white/60" aria-hidden="true" />
          </div>
          {avatarSeed.trim() && (
            <p className="mt-2 text-center text-xs text-white/40">{avatarSeed}</p>
          )}
        </div>
      </div>

      {/* Seed input */}
      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-medium text-white/50">
          {t("seedLabel")} *
        </label>
        <input
          type="text"
          value={avatarSeed}
          onChange={(e) => setAvatarSeed(e.target.value)}
          placeholder={t("seedPlaceholder")}
          className={cn(
            "w-full rounded-xl border border-white/10 bg-white/[4%] px-4 py-2.5",
            "text-sm text-white placeholder:text-white/30",
            "focus:outline-none focus:ring-2 focus:ring-teal-accent/60"
          )}
          maxLength={50}
          autoFocus
        />
      </div>

      {/* Gender selection */}
      <div className="mb-6">
        <label className="mb-2 block text-xs font-medium text-white/50">
          {t("genderLabel")}
        </label>
        <div className="flex gap-2">
          {GENDERS.map(({ value, labelKey }) => (
            <button
              key={value}
              type="button"
              onClick={() => setSelectedGender(value)}
              className={cn(
                "flex-1 cursor-pointer rounded-xl border px-3 py-2 text-sm transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
                selectedGender === value
                  ? "border-teal-accent/40 bg-teal-accent/10 text-white"
                  : "border-white/10 bg-white/[4%] text-white/60 hover:border-white/20"
              )}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>
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
