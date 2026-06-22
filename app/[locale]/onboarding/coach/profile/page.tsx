"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { StepIndicator } from "@/components/onboarding/step-indicator"

export default function OnboardingCoachProfilePage() {
  const t = useTranslations("onboarding.coach.profile")
  const router = useRouter()

  const [bio, setBio] = useState("")
  const [city, setCity] = useState("")
  const [price, setPrice] = useState("")

  function handleContinue() {
    const params = new URLSearchParams({ step: "3" })
    router.push(`/onboarding/coach/availability?${params.toString()}`)
  }

  return (
    <OnboardingShell current={2} total={4}>
      <StepIndicator current={2} total={4} />
      <h1 className="mt-6 text-xl font-bold text-white">{t("title")}</h1>
      <p className="mt-1 text-sm text-white/50">{t("subtitle")}</p>
      <div className="mt-6 flex flex-col gap-4">
        <Textarea
          label={t("bioLabel")}
          placeholder={t("bioPlaceholder")}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <Input
          label={t("cityLabel")}
          placeholder={t("cityPlaceholder")}
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="coach-price"
            className="text-sm font-medium text-white/70"
          >
            {t("priceLabel")}
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-sm text-white/40">
              €
            </span>
            <input
              id="coach-price"
              type="number"
              min="1"
              placeholder="45"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-7 pr-3.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-teal-accent focus:bg-white/[7%] focus:ring-1 focus:ring-teal-accent/30"
            />
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-xs text-white/30">
              {t("priceUnit")}
            </span>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={handleContinue}
        className="mt-6 flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-accent to-blue-accent-dark text-sm font-bold text-white shadow-lg shadow-blue-accent/25 transition-all hover:opacity-90 active:scale-[0.98]"
      >
        {t("continue")}
      </button>
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
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-white/10 bg-white/[4%] p-8 backdrop-blur-md shadow-2xl">
        {children}
      </div>
    </main>
  )
}
