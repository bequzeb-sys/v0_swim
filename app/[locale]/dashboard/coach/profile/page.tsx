"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useAuth } from "@/lib/auth/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Check, MapPin } from "lucide-react"

export default function CoachProfilePage() {
  const t = useTranslations("dashboardCoach")
  const { user } = useAuth()

  const [name, setName] = useState(user?.name ?? "")
  const [city, setCity] = useState("")
  const [bio, setBio] = useState("")
  const [experience, setExperience] = useState("")
  const [saved, setSaved] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-white lg:text-3xl">
        {t("profileTitle")}
      </h1>

      <form
        onSubmit={handleSave}
        className="flex max-w-xl flex-col gap-5"
      >
        {/* Avatar placeholder */}
        <div className="flex items-center gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-teal-accent/15 text-xl font-bold text-teal-accent">
            {user?.name?.charAt(0) ?? "C"}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-white/40">{user?.email}</p>
          </div>
        </div>

        {/* Name */}
        <fieldset className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-white/70">
            {t("profileTitle")}
          </label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border-white/10 bg-white/[4%] text-white placeholder:text-white/25"
          />
        </fieldset>

        {/* City */}
        <fieldset className="flex flex-col gap-2">
          <label htmlFor="city" className="text-sm font-medium text-white/70">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              {t("profileCity")}
            </span>
          </label>
          <Input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-xl border-white/10 bg-white/[4%] text-white placeholder:text-white/25"
          />
        </fieldset>

        {/* Experience */}
        <fieldset className="flex flex-col gap-2">
          <label htmlFor="experience" className="text-sm font-medium text-white/70">
            {t("profileExperience")}
          </label>
          <Input
            id="experience"
            type="number"
            min="0"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-32 rounded-xl border-white/10 bg-white/[4%] text-white placeholder:text-white/25"
          />
        </fieldset>

        {/* Bio */}
        <fieldset className="flex flex-col gap-2">
          <label htmlFor="bio" className="text-sm font-medium text-white/70">
            {t("profileBio")}
          </label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="resize-none rounded-xl border-white/10 bg-white/[4%] text-white placeholder:text-white/25"
          />
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
                {t("profileSaved")}
              </span>
            ) : (
              t("profileSave")
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
