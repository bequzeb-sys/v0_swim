"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Plus } from "lucide-react"

interface TimeSlot {
  id: string
  day: string
  time: string
}

const DAYS_FR = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]
const DAYS_EN = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const TIME_SUGGESTIONS = [
  "08h00 – 09h00",
  "09h00 – 10h00",
  "10h00 – 11h00",
  "14h00 – 15h00",
  "15h00 – 16h00",
  "17h00 – 18h00",
]

export default function CoachSchedulePage() {
  const t = useTranslations("dashboardCoach")

  const [slots, setSlots] = useState<TimeSlot[]>([
    { id: "1", day: "Lundi", time: "10h00 – 11h00" },
    { id: "2", day: "Mercredi", time: "14h00 – 15h00" },
    { id: "3", day: "Vendredi", time: "16h00 – 17h00" },
  ])

  function addSlot() {
    setSlots((prev) => [
      ...prev,
      { id: crypto.randomUUID(), day: "Lundi", time: "09h00 – 10h00" },
    ])
  }

  function updateSlot(id: string, field: "day" | "time", value: string) {
    setSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    )
  }

  function removeSlot(id: string) {
    setSlots((prev) => prev.filter((s) => s.id !== id))
  }

  const days = t.locale === "en" ? DAYS_EN : DAYS_FR

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-white lg:text-3xl">
        {t("scheduleTitle")}
      </h1>

      {slots.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[4%] p-10 text-center backdrop-blur-md">
          <p className="text-sm text-white/50">{t("scheduleNoSlots")}</p>
          <button
            type="button"
            onClick={addSlot}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Plus className="size-4" />
            {t("scheduleAddSlot")}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[4%] p-4 backdrop-blur-md sm:flex-row sm:items-center"
            >
              {/* Day */}
              <div className="flex flex-col gap-1.5 sm:w-40">
                <label className="text-xs text-white/40">{t("scheduleDayLabel")}</label>
                <select
                  value={slot.day}
                  onChange={(e) => updateSlot(slot.id, "day", e.target.value)}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-white/[6%] px-3 py-2.5 text-sm text-white"
                >
                  {days.map((d) => (
                    <option key={d} value={d} className="bg-[#050b1a]">
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time */}
              <div className="flex flex-col gap-1.5 sm:flex-1">
                <label className="text-xs text-white/40">{t("scheduleTimeLabel")}</label>
                <select
                  value={slot.time}
                  onChange={(e) => updateSlot(slot.id, "time", e.target.value)}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-white/[6%] px-3 py-2.5 text-sm text-white"
                >
                  {TIME_SUGGESTIONS.map((time) => (
                    <option key={time} value={time} className="bg-[#050b1a]">
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              {/* Remove */}
              <button
                type="button"
                onClick={() => removeSlot(slot.id)}
                className="self-end rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/40 transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 sm:self-auto"
              >
                ✕
              </button>
            </div>
          ))}

          {/* Add slot */}
          <button
            type="button"
            onClick={addSlot}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 bg-white/[2%] p-4 text-sm font-medium text-white/40 transition-colors hover:border-teal-accent/30 hover:bg-teal-accent/5 hover:text-teal-accent"
          >
            <Plus className="size-4" />
            {t("scheduleAddSlot")}
          </button>
        </div>
      )}
    </div>
  )
}
