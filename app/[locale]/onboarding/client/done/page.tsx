"use client"

import { Suspense, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { useAuth } from "@/lib/auth/auth-context"
import { OnboardingShell } from "@/components/onboarding/onboarding-shell"
import { Button } from "@/components/ui/button"
import { useClientOnboardingStore } from "@/lib/stores/onboarding-client-store"
import { cn } from "@/lib/utils"

function OnboardingClientDonePageInner() {
  const t = useTranslations("onboarding.client.done")
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { reset } = useClientOnboardingStore()

  useEffect(() => {
    reset()
  }, [reset])

  function handleCta() {
    const redirectTo = searchParams.get("redirect")
    if (redirectTo) {
      router.push(redirectTo as Parameters<typeof router.push>[0])
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <OnboardingShell current={5} total={5}>
      <div className="mb-6 flex items-center justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={cn(
            "h-2 rounded-full transition-all duration-300",
            "w-6 bg-teal-accent"
          )} />
        ))}
      </div>

      <div className="mt-4 flex flex-col items-center text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-md bg-teal-accent/15">
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

export default function OnboardingClientDonePage() {
  return (
    <Suspense fallback={null}>
      <OnboardingClientDonePageInner />
    </Suspense>
  )
}
