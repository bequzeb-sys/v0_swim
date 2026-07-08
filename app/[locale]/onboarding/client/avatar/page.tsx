"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { ChevronLeft, ChevronRight, Upload, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { OnboardingShell } from "@/components/onboarding/onboarding-shell"
import { useClientOnboardingStore } from "@/lib/stores/onboarding-client-store"

export default function OnboardingClientStep2() {
  const t = useTranslations("onboarding.client.avatar")
  const tStep = useTranslations("onboarding.step")
  const router = useRouter()
  const { data, setStep2 } = useClientOnboardingStore()

  const [avatarType, setAvatarType] = useState<"default" | "upload">(
    data.avatarType === "upload" ? "upload" : "default"
  )
  const [uploadedUrl, setUploadedUrl] = useState(data.avatarUrl || "")

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setUploadedUrl(ev.target?.result as string)
      setAvatarType("upload")
    }
    reader.readAsDataURL(file)
  }

  function handleContinue() {
    const finalUrl = avatarType === "upload" ? uploadedUrl : ""
    setStep2(avatarType, finalUrl)
    router.push("/onboarding/client/location")
  }

  function handleBack() {
    router.push("/onboarding/client")
  }

  const initials = data.displayName
    ? data.displayName.slice(0, 2).toUpperCase()
    : "SW"

  return (
    <OnboardingShell current={2} total={6}>
      {/* Step indicator */}
      <div className="mb-6 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
          {tStep("of", { current: 2, total: 6 })}
        </p>
        <div className="mb-4 flex items-center justify-center gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === 1 ? "w-6 bg-teal-accent"
              : i < 1 ? "w-2 bg-teal-accent/40"
              : "w-2 bg-white/20"
            )} />
          ))}
        </div>
        <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
        <p className="mt-1 text-sm text-white/50">{t("subtitle")}</p>
      </div>

      {/* Avatar preview */}
      <div className="mb-6 flex justify-center">
        <div className="relative size-24 overflow-hidden rounded-2xl ring-2 ring-white/20">
          {avatarType === "upload" && uploadedUrl ? (
            <img
              src={uploadedUrl}
              alt="Avatar"
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-teal-accent/20">
              <span className="text-2xl font-bold text-teal-accent">{initials}</span>
            </div>
          )}
        </div>
      </div>

      {/* Options */}
      <div className="mb-6 flex flex-col gap-3">

        {/* Default avatar option */}
        <button
          type="button"
          onClick={() => setAvatarType("default")}
          className={cn(
            "flex cursor-pointer items-center gap-4 rounded-xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
            avatarType === "default"
              ? "border-teal-accent/40 bg-teal-accent/10"
              : "border-white/10 bg-white/5 hover:border-white/20"
          )}
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-accent/20">
            <User className="size-5 text-teal-accent" aria-hidden="true" />
          </div>
          <div>
            <p className={cn("text-sm font-medium", avatarType === "default" ? "text-white" : "text-white/70")}>
              {t("defaultLabel")}
            </p>
            <p className="text-xs text-white/40">{t("defaultHint")}</p>
          </div>
        </button>

        {/* Upload photo option */}
        <label className={cn(
          "flex cursor-pointer items-center gap-4 rounded-xl border p-4 text-left transition-all focus-within:ring-2 focus-within:ring-teal-accent/60",
          avatarType === "upload" && uploadedUrl
            ? "border-teal-accent/40 bg-teal-accent/10"
            : "border-white/10 bg-white/5 hover:border-white/20"
        )}>
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <Upload className="size-5 text-white/60" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium text-white/70">{t("uploadLabel")}</p>
            <p className="text-xs text-white/40">{t("uploadHint")}</p>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="sr-only"
          />
        </label>

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
          className="flex-1"
        >
          {t("continue")}
        </Button>

        <button
          type="button"
          onClick={handleContinue}
          className="inline-flex size-11 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition-colors hover:border-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
      </div>
    </OnboardingShell>
  )
}
