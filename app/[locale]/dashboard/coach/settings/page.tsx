"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useAuth } from "@/lib/auth/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check } from "lucide-react"

export default function CoachSettingsPage() {
  const t = useTranslations("dashboardCoach")
  const { user } = useAuth()
  const params = useParams()
  const locale = (params.locale as string) || "fr"

  const [name, setName] = useState(user?.name ?? "")
  const [email, setEmail] = useState(user?.email ?? "")
  const [saved, setSaved] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-white lg:text-3xl">
        {t("settingsTitle")}
      </h1>

      <form
        onSubmit={handleSave}
        className="flex max-w-lg flex-col gap-6"
      >
        {/* Name */}
        <fieldset className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-white/70">
            {t("settingsName")}
          </label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border-white/10 bg-white/[4%] text-white placeholder:text-white/25"
          />
        </fieldset>

        {/* Email */}
        <fieldset className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-white/70">
            {t("settingsEmail")}
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border-white/10 bg-white/[4%] text-white placeholder:text-white/25"
          />
        </fieldset>

        {/* Language */}
        <fieldset className="flex flex-col gap-2">
          <label className="text-sm font-medium text-white/70">
            {t("settingsLanguage")}
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60 ${
                locale === "fr"
                  ? "border-teal-accent/40 bg-teal-accent/10 text-teal-accent"
                  : "border-white/10 bg-white/[4%] text-white/50 hover:bg-white/[6%]"
              }`}
            >
              {locale === "fr" && (
                <span className="flex size-2 rounded-full bg-teal-accent" />
              )}
              {t("settingsLanguageFr")}
            </button>
            <button
              type="button"
              className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60 ${
                locale === "en"
                  ? "border-teal-accent/40 bg-teal-accent/10 text-teal-accent"
                  : "border-white/10 bg-white/[4%] text-white/50 hover:bg-white/[6%]"
              }`}
            >
              {locale === "en" && (
                <span className="flex size-2 rounded-full bg-teal-accent" />
              )}
              {t("settingsLanguageEn")}
            </button>
          </div>
        </fieldset>

        {/* Save */}
        <div className="flex items-center gap-3">
          <Button
            type="submit"
            variant="primary"
            className="active:scale-[0.98]"
          >
            {saved ? (
              <span className="flex items-center gap-2">
                <Check className="size-4" />
                {t("settingsSaved")}
              </span>
            ) : (
              t("settingsSave")
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
