"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import {
  User, MapPin, Waves, Bell, Camera, Check, Phone, ChevronDown,
  WavesLadder, Trophy, Activity, Target
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useClientProfileStore } from "@/lib/stores/client-profile-store"
import { useClientOnboardingStore } from "@/lib/stores/onboarding-client-store"
import { useAuth } from "@/lib/auth/auth-context"
import * as Flags from "country-flag-icons/react/3x2"
import { Popover } from "@base-ui/react/popover"
import { COUNTRIES } from "@/lib/countries"
import type { ClientLevel, ClientGoal } from "@/types/client"

const LEVELS: ClientLevel[] = ["beginner", "intermediate", "advanced"]
const GOALS: ClientGoal[] = ["learnToSwim", "improveTechnique", "trainCompetition", "fitness"]
const LANGUAGES = ["fr", "en", "es", "de", "it", "pt", "ar", "zh", "ru", "ja"]

function GoalIcon({ goal, className }: { goal: ClientGoal; className?: string }) {
  switch (goal) {
    case "learnToSwim": return <WavesLadder className={className} aria-hidden="true" />
    case "improveTechnique": return <Target className={className} aria-hidden="true" />
    case "trainCompetition": return <Trophy className={className} aria-hidden="true" />
    case "fitness": return <Activity className={className} aria-hidden="true" />
  }
}

export default function ClientProfilePage() {
  const t = useTranslations("dashboardClient.profile")
  const tLevels = useTranslations("onboarding.client.level")
  const tGoals = useTranslations("onboarding.client.goal")
  const tLanguages = useTranslations("languages")
  const tCountries = useTranslations("search.countries")
  const { user } = useAuth()
  const { profile, setProfile, setFromOnboarding } = useClientProfileStore()
  const { data: onboardingData } = useClientOnboardingStore()

  const [saved, setSaved] = useState(false)
  const [countryOpen, setCountryOpen] = useState(false)

  // Seed profile from onboarding data on first load
  useEffect(() => {
    if (!profile.displayName && onboardingData.displayName) {
      setFromOnboarding(onboardingData)
    }
  }, [])

  // Local editable state
  const [displayName, setDisplayName] = useState(profile.displayName || user?.name || "")
  const [bio, setBio] = useState(profile.bio)
  const [location, setLocation] = useState(profile.location)
  const [country, setCountry] = useState(profile.country || "FR")
  const [level, setLevel] = useState<ClientLevel | null>(profile.level)
  const [languages, setLanguages] = useState<string[]>(profile.languages)
  const [goal, setGoal] = useState<ClientGoal | null>(profile.goal)
  const [phone, setPhone] = useState(profile.phone)
  const [notificationsEmail, setNotificationsEmail] = useState(profile.notificationsEmail)
  const [notificationsPush, setNotificationsPush] = useState(profile.notificationsPush)
  const [avatarType, setAvatarType] = useState(profile.avatarType)
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl)

  const initials = displayName ? displayName.slice(0, 2).toUpperCase() : "SW"

  const SelectedFlag = (Flags as unknown as Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>>)[country]

  function toggleLanguage(code: string) {
    setLanguages((prev) =>
      prev.includes(code)
        ? prev.filter((l) => l !== code)
        : prev.length < 4 ? [...prev, code] : prev
    )
  }

  function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setAvatarUrl(ev.target?.result as string)
      setAvatarType("upload")
    }
    reader.readAsDataURL(file)
  }

  function handleSave() {
    setProfile({
      displayName,
      bio,
      location,
      country,
      level,
      languages,
      goal,
      phone,
      notificationsEmail,
      notificationsPush,
      avatarType,
      avatarUrl,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">

      {/* Page title */}
      <h1 className="text-2xl font-bold text-white">{t("title")}</h1>

      {/* Avatar section */}
      <div className="rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-6 shadow-xl shadow-black/20 backdrop-blur-md">
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-white">
          <User className="size-4 text-teal-accent" aria-hidden="true" />
          {t("avatarSection")}
        </h2>
        <div className="flex items-center gap-5">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl ring-2 ring-white/20">
            {avatarType === "upload" && avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center bg-teal-accent/20">
                <span className="text-2xl font-bold text-teal-accent">{initials}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition-colors hover:border-teal-accent/30 hover:text-white focus-within:ring-2 focus-within:ring-teal-accent/60">
              <Camera className="size-4" aria-hidden="true" />
              {t("changePhoto")}
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="sr-only" />
            </label>
            {avatarType === "upload" && (
              <button
                type="button"
                onClick={() => { setAvatarType("default"); setAvatarUrl("") }}
                className="cursor-pointer text-xs text-white/30 transition-colors hover:text-white/60 focus-visible:outline-none"
              >
                {t("useDefault")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Identity section */}
      <div className="rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-6 shadow-xl shadow-black/20 backdrop-blur-md">
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-white">
          <User className="size-4 text-teal-accent" aria-hidden="true" />
          {t("identitySection")}
        </h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/50">{t("displayName")}</label>
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder={t("displayNamePlaceholder")} maxLength={50} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/50">{t("bio")}</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={t("bioPlaceholder")}
              rows={3}
              maxLength={200}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none resize-none transition-colors focus:border-teal-accent/40 focus:ring-1 focus:ring-teal-accent/20"
            />
            <p className="mt-1 text-right text-xs text-white/30">{bio.length}/200</p>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/50">{t("phone")}</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30" aria-hidden="true" />
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t("phonePlaceholder")} className="pl-9" type="tel" />
            </div>
          </div>
        </div>
      </div>

      {/* Location section */}
      <div className="rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-6 shadow-xl shadow-black/20 backdrop-blur-md">
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-white">
          <MapPin className="size-4 text-teal-accent" aria-hidden="true" />
          {t("locationSection")}
        </h2>
        <div className="flex flex-col gap-4">
          {/* Country dropdown */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/50">{t("country")}</label>
            <Popover.Root open={countryOpen} onOpenChange={setCountryOpen}>
              <Popover.Trigger className={cn(
                "flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
                countryOpen ? "border-teal-accent/40 bg-teal-accent/10 text-white" : "border-white/10 bg-white/5 text-white/70 hover:border-teal-accent/20 hover:text-white"
              )}>
                <div className="flex items-center gap-2">
                  {SelectedFlag && <SelectedFlag className="size-5 rounded-sm" aria-hidden="true" />}
                  <span>{tCountries(country)}</span>
                </div>
                <ChevronDown className={cn("size-4 shrink-0 text-white/40 transition-transform duration-200", countryOpen && "rotate-180")} aria-hidden="true" />
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Positioner sideOffset={8} align="start" className="z-50 w-[var(--anchor-width)]">
                  <Popover.Popup className="rounded-2xl border border-white/10 bg-white/[8%] p-1.5 shadow-xl shadow-black/20 backdrop-blur-md text-white data-[state=open]:animate-in data-[state=closed]:animate-out">
                    {COUNTRIES.map(({ code }) => {
                      const Flag = (Flags as unknown as Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>>)[code]
                      return (
                        <button key={code} type="button"
                          onClick={() => { setCountry(code); setCountryOpen(false) }}
                          className={cn(
                            "flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
                            country === code ? "bg-teal-accent/10 text-teal-accent" : "text-white/70 hover:bg-white/10 hover:text-white"
                          )}>
                          {Flag && <Flag className="size-5 rounded-sm" aria-hidden="true" />}
                          {tCountries(code)}
                          {country === code && <Check className="ml-auto size-4 text-teal-accent" aria-hidden="true" />}
                        </button>
                      )
                    })}
                  </Popover.Popup>
                </Popover.Positioner>
              </Popover.Portal>
            </Popover.Root>
          </div>
          {/* City */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/50">{t("city")}</label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder={t("cityPlaceholder")} />
          </div>
        </div>
      </div>

      {/* Swimming profile section */}
      <div className="rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-6 shadow-xl shadow-black/20 backdrop-blur-md">
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-white">
          <Waves className="size-4 text-teal-accent" aria-hidden="true" />
          {t("swimmingSection")}
        </h2>
        {/* Level */}
        <div className="mb-4">
          <label className="mb-2 block text-xs font-medium text-white/50">{t("level")}</label>
          <div className="flex gap-2">
            {LEVELS.map((lvl) => (
              <button key={lvl} type="button" onClick={() => setLevel(lvl)}
                className={cn(
                  "flex-1 cursor-pointer rounded-xl border py-2.5 text-sm font-medium transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
                  level === lvl ? "border-teal-accent/40 bg-teal-accent/10 text-white" : "border-white/10 bg-white/5 text-white/60 hover:border-teal-accent/20 hover:text-white"
                )}>
                {tLevels(`${lvl}Label`)}
              </button>
            ))}
          </div>
        </div>
        {/* Goal */}
        <div className="mb-4">
          <label className="mb-2 block text-xs font-medium text-white/50">{t("goal")}</label>
          <div className="grid grid-cols-2 gap-2">
            {GOALS.map((g) => (
              <button key={g} type="button" onClick={() => setGoal(g)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-left text-sm font-medium transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
                  goal === g ? "border-teal-accent/40 bg-teal-accent/10 text-white" : "border-white/10 bg-white/5 text-white/60 hover:border-teal-accent/20 hover:text-white"
                )}>
                <GoalIcon goal={g} className={cn("size-4 shrink-0", goal === g ? "text-teal-accent" : "text-white/30")} />
                {tGoals(g)}
              </button>
            ))}
          </div>
        </div>
        {/* Languages */}
        <div>
          <label className="mb-2 block text-xs font-medium text-white/50">
            {t("languages")} <span className="text-white/30">{languages.length}/4</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((code) => (
              <button key={code} type="button" onClick={() => toggleLanguage(code)}
                className={cn(
                  "cursor-pointer rounded-xl border px-3 py-1.5 text-sm font-medium transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
                  languages.includes(code) ? "border-teal-accent/40 bg-teal-accent/10 text-teal-accent" : "border-white/10 bg-white/5 text-white/60 hover:border-teal-accent/20 hover:text-white"
                )}>
                {tLanguages(code)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications section */}
      <div className="rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-6 shadow-xl shadow-black/20 backdrop-blur-md">
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-white">
          <Bell className="size-4 text-teal-accent" aria-hidden="true" />
          {t("notificationsSection")}
        </h2>
        <div className="flex flex-col gap-3">
          {([
            { key: "notificationsEmail", value: notificationsEmail, setter: setNotificationsEmail, label: t("notificationsEmailLabel"), hint: t("notificationsEmailHint") },
            { key: "notificationsPush", value: notificationsPush, setter: setNotificationsPush, label: t("notificationsPushLabel"), hint: t("notificationsPushHint") },
          ] as const).map(({ key, value, setter, label, hint }) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-white/40">{hint}</p>
              </div>
              <button
                type="button"
                onClick={() => setter(!value)}
                className={cn(
                  "relative h-6 w-10 shrink-0 cursor-pointer rounded-full border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
                  value ? "border-teal-accent bg-teal-accent" : "border-white/20 bg-white/10"
                )}
              >
                <span className={cn("absolute top-0.5 size-4 rounded-full bg-white shadow transition-all", value ? "left-5" : "left-0.5")} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save button */}
      <Button
        variant="primary"
        onClick={handleSave}
        className="w-full"
      >
        {saved ? (
          <span className="flex items-center gap-2">
            <Check className="size-4" aria-hidden="true" />
            {t("saved")}
          </span>
        ) : t("save")}
      </Button>

    </div>
  )
}
