"use client"

import { Suspense, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { useAuth } from "@/lib/auth/auth-context"
import { useCoachOnboardingStore } from "@/lib/stores/onboarding-coach-store"
import { StepIndicator } from "@/components/onboarding/step-indicator"
import { Button } from "@/components/ui/button"

function OnboardingCoachDonePageInner() {
  const t = useTranslations("onboarding.coach.done")
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data, reset } = useCoachOnboardingStore()

  useEffect(() => {
    // TODO (database sprint): replace console.log with API call to save coach profile
    console.log("Coach onboarding complete:", data)
    // Reset store after logging (or after successful DB save)
    // reset() — called after DB confirms save
  }, [])

  function handleCta() {
    const redirectTo = searchParams.get("redirect")
    if (redirectTo) {
      router.push(redirectTo as Parameters<typeof router.push>[0])
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <OnboardingShell current={4} total={4}>
      <StepIndicator current={4} total={4} />
      <div className="mt-6 flex flex-col items-center text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-md bg-blue-accent/15">
          <CheckCircle2 className="size-8 text-blue-accent" />
        </div>
        <h1 className="text-xl font-bold text-white">{t("title")}</h1>
        <p className="mt-2 text-sm text-white/50">
          {t("subtitle", { name: user?.name ?? "" })}
        </p>
      </div>

      <div className="mt-4 rounded-2xl border border-blue-300/20 bg-blue-400/[8%] p-4 text-left">
        <p className="text-xs text-white/40 mb-2">{t("summaryTitle")}</p>
        <p className="text-sm text-white/70">{data.badgeKeys.length} {t("specialtiesSelected")}</p>
        <p className="text-sm text-white/70">{data.certification || t("noCertification")}</p>
      </div>

      <Button
        type="button"
        onClick={handleCta}
        variant="entry"
        className="mt-8 w-full text-sm active:scale-[0.98]"
      >
        {t("cta")}
      </Button>
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
      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-8 shadow-2xl shadow-black/20 backdrop-blur-md">
        {children}
      </div>
    </main>
  )
}

export default function OnboardingCoachDonePage() {
  return (
    <Suspense fallback={null}>
      <OnboardingCoachDonePageInner />
    </Suspense>
  )
}
