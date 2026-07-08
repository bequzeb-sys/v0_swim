"use client"

import { useState, useMemo } from "react"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { Upload, Shuffle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { OnboardingShell } from "@/components/onboarding/onboarding-shell"
import { useClientOnboardingStore } from "@/lib/stores/onboarding-client-store"
import type { ClientAvatarOptions } from "@/types/client"

const SKIN_COLORS = [
  { id: "ffdbb4", label: "Light" },
  { id: "edb98a", label: "Medium Light" },
  { id: "d08b5b", label: "Medium" },
  { id: "ae5d29", label: "Medium Dark" },
  { id: "614335", label: "Dark" },
  { id: "3b1f1a", label: "Deep" },
]

const HAIR_STYLES = [
  { id: "short01", label: "Short" },
  { id: "short02", label: "Curly Short" },
  { id: "long01", label: "Long" },
  { id: "long02", label: "Wavy" },
  { id: "bun", label: "Bun" },
  { id: "hijab", label: "Hijab" },
]

function buildAvatarUrl(seed: string, options: ClientAvatarOptions): string {
  const params = new URLSearchParams({
    seed,
    skinColor: options.skinColor,
    hair: options.hair,
    glassesProbability: options.glasses ? "100" : "0",
  })
  return `https://api.dicebear.com/10.x/lorelei/svg?${params.toString()}`
}

export default function OnboardingClientStep2() {
  const t = useTranslations("onboarding.client.avatar")
  const tStep = useTranslations("onboarding.step")
  const router = useRouter()
  const { data, setStep2 } = useClientOnboardingStore()

  const [avatarType, setAvatarType] = useState<"generated" | "upload">(
    data.avatarType
  )
  const [options, setOptions] = useState<ClientAvatarOptions>(
    data.avatarOptions
  )
  const [seed, setSeed] = useState(data.avatarSeed || data.displayName || "swimmer")
  const [uploadedUrl, setUploadedUrl] = useState(data.avatarUrl)

  const avatarUrl = useMemo(() => buildAvatarUrl(seed, options), [seed, options])

  function randomizeSeed() {
    setSeed(Math.random().toString(36).slice(2, 8))
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setUploadedUrl(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  function handleContinue() {
    const finalUrl = avatarType === "upload" ? uploadedUrl : avatarUrl
    setStep2(avatarType, seed, options, finalUrl)
    router.push("/onboarding/client/location")
  }

  const canContinue = avatarType === "generated" || (avatarType === "upload" && uploadedUrl)

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
              i === 1 ? "w-6 bg-teal-accent"
              : i < 1 ? "w-2 bg-teal-accent/40"
              : "w-2 bg-white/20"
            )} />
          ))}
        </div>
        <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
        <p className="mt-1 text-sm text-white/50">
          {data.displayName ? t("subtitleNamed", { name: data.displayName }) : t("subtitle")}
        </p>
      </div>

      {/* Tab selector */}
      <div className="mb-5 flex gap-2">
        <button
          type="button"
          onClick={() => setAvatarType("generated")}
          className={cn(
            "flex-1 cursor-pointer rounded-xl border py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
            avatarType === "generated"
              ? "border-teal-accent/40 bg-teal-accent/10 text-white"
              : "border-white/10 bg-white/5 text-white/50 hover:text-white"
          )}
        >
          {t("tabGenerate")}
        </button>
        <button
          type="button"
          onClick={() => setAvatarType("upload")}
          className={cn(
            "flex-1 cursor-pointer rounded-xl border py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
            avatarType === "upload"
              ? "border-teal-accent/40 bg-teal-accent/10 text-white"
              : "border-white/10 bg-white/5 text-white/50 hover:text-white"
          )}
        >
          {t("tabUpload")}
        </button>
      </div>

      {avatarType === "generated" ? (
        <>
          {/* Avatar preview */}
          <div className="mb-5 flex flex-col items-center gap-3">
            <div className="relative size-24 overflow-hidden rounded-2xl ring-2 ring-white/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarUrl}
                alt="Avatar preview"
                className="size-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={randomizeSeed}
              className="flex cursor-pointer items-center gap-1.5 text-xs text-white/40 transition-colors hover:text-teal-accent focus-visible:outline-none"
            >
              <Shuffle className="size-3" aria-hidden="true" />
              {t("randomize")}
            </button>
          </div>

          {/* Skin color */}
          <div className="mb-4">
            <p className="mb-2 text-xs font-medium text-white/50">{t("skinColor")}</p>
            <div className="flex gap-2">
              {SKIN_COLORS.map((skin) => (
                <button
                  key={skin.id}
                  type="button"
                  onClick={() => setOptions({ ...options, skinColor: skin.id })}
                  className={cn(
                    "size-8 cursor-pointer rounded-full border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
                    options.skinColor === skin.id
                      ? "border-teal-accent scale-110"
                      : "border-transparent hover:scale-105"
                  )}
                  style={{ backgroundColor: `#${skin.id}` }}
                  aria-label={skin.label}
                />
              ))}
            </div>
          </div>

          {/* Hair style */}
          <div className="mb-4">
            <p className="mb-2 text-xs font-medium text-white/50">{t("hairStyle")}</p>
            <div className="grid grid-cols-3 gap-2">
              {HAIR_STYLES.map((hair) => (
                <button
                  key={hair.id}
                  type="button"
                  onClick={() => setOptions({ ...options, hair: hair.id })}
                  className={cn(
                    "cursor-pointer rounded-xl border py-2 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
                    options.hair === hair.id
                      ? "border-teal-accent/40 bg-teal-accent/10 text-white"
                      : "border-white/10 bg-white/5 text-white/50 hover:text-white"
                  )}
                >
                  {t(`hair_${hair.id}`) || hair.label}
                </button>
              ))}
            </div>
          </div>

          {/* Glasses toggle */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-medium text-white/50">{t("glasses")}</p>
            <button
              type="button"
              onClick={() => setOptions({ ...options, glasses: !options.glasses })}
              className={cn(
                "relative h-6 w-10 cursor-pointer rounded-full border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
                options.glasses
                  ? "border-teal-accent bg-teal-accent"
                  : "border-white/20 bg-white/10"
              )}
            >
              <span className={cn(
                "absolute top-0.5 size-4 rounded-full bg-white shadow transition-all",
                options.glasses ? "left-5" : "left-0.5"
              )} />
            </button>
          </div>
        </>
      ) : (
        /* Upload tab */
        <div className="mb-5">
          <label className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-dashed border-white/20 bg-white/5 p-8 transition-colors hover:border-teal-accent/40 hover:bg-teal-accent/5">
            {uploadedUrl ? (
              <div className="size-24 overflow-hidden rounded-2xl ring-2 ring-white/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={uploadedUrl} alt="Uploaded avatar" className="size-full object-cover" />
              </div>
            ) : (
              <div className="flex size-16 items-center justify-center rounded-2xl bg-white/10">
                <Upload className="size-6 text-white/40" aria-hidden="true" />
              </div>
            )}
            <div className="text-center">
              <p className="text-sm font-medium text-white/70">{t("uploadLabel")}</p>
              <p className="mt-0.5 text-xs text-white/30">{t("uploadHint")}</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      )}

      <Button
        variant="entry"
        onClick={handleContinue}
        disabled={!canContinue}
        className="w-full"
      >
        {t("continue")}
      </Button>
    </OnboardingShell>
  )
}
