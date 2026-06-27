"use client"

import { useSearchParams } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { useAuth } from "@/lib/auth/auth-context"
import { StepIndicator } from "@/components/onboarding/step-indicator"
import { Button } from "@/components/ui/button"

export default function OnboardingClientDonePage() {
  const t = useTranslations("onboarding.client.done")
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleCta() {
    const redirectTo = searchParams.get("redirect")
    if (redirectTo) {
      router.push(redirectTo)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <OnboardingShell current={3} total={3}>
      <StepIndicator current={3} total={3} />
      <div className="mt-6 flex flex-col items-center text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-teal-accent/15">
          <CheckCircle2 className="size-8 text-teal-accent" />
        </div>
        <h1 className="text-xl font-bold text-white">{t("title")}</h1>
        <p className="mt-2 text-sm text-white/50">
          {t("subtitle", { name: user?.name ?? "" })}
        </p>
      </div>
      <Button
        type="button"
        onClick={handleCta}
        variant="primary"
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
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-white/10 bg-white/[4%] p-8 backdrop-blur-md shadow-2xl">
        {children}
      </div>
    </main>
  )
}
