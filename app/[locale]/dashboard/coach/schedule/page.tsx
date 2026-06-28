"use client"

import { useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { Plus } from "lucide-react"

interface TimeSlot {
  id: string
  day: string
  time: string
}

function formatTimeRange(startHour: number, endHour: number, locale: string): string {
  if (locale === "en") {
    const fmt = (h: number) => {
      const period = h >= 12 ? "PM" : "AM"
      const display = h % 12 === 0 ? 12 : h % 12
      return `${display}:00 ${period}`
    }
    return `${fmt(startHour)} – ${fmt(endHour)}`
  }
  const fmt = (h: number) => `${String(h).padStart(2, "0")}h00`
  return `${fmt(startHour)} – ${fmt(endHour)}`
}

const TIME_SLOTS: { start: number; end: number }[] = [
  { start: 8, end: 9 },
  { start: 9, end: 10 },
  { start: 10, end: 11 },
  { start: 14, end: 15 },
  { start: 15, end: 16 },
  { start: 17, end: 18 },
]

function formatTimeSuggestions(locale: string): string[] {
  return TIME_SLOTS.map((s) => formatTimeRange(s.start, s.end, locale))
}

function defaultSlotDay(locale: string): string {
  // Use the translation key for Monday — first day of availability by default
  return locale === "en" ? "Mon" : "Lun"
}

export default function CoachSchedulePage() {
  const locale = useLocale()
  const t = useTranslations("dashboardCoach")
  const tDays = useTranslations("coachProfile.days")

  const [slots, setSlots] = useState<TimeSlot[]>(() => {
    const initialDay = defaultSlotDay(locale)
    return [
      { id: "1", day: initialDay, time: formatTimeRange(10, 11, locale) },
      { id: "2", day: tDays("wed"), time: formatTimeRange(14, 15, locale) },
      { id: "3", day: tDays("fri"), time: formatTimeRange(16, 17, locale) },
    ]
  })

  function addSlot() {
    setSlots((prev) => [
      ...prev,
      { id: crypto.randomUUID(), day: defaultSlotDay(locale), time: formatTimeRange(9, 10, locale) },
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

  const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const
  const days = dayKeys.map((k) => tDays(k))
  const timeSuggestions = formatTimeSuggestions(locale)

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-white lg:text-3xl">
        {t("scheduleTitle")}
      </h1>

      {slots.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-10 text-center shadow-xl shadow-black/20 backdrop-blur-md">
          <p className="text-sm text-white/50">{t("scheduleNoSlots")}</p>
          <button
            type="button"
            onClick={addSlot}
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
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
              className="flex flex-col gap-3 rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-4 shadow-xl shadow-black/20 backdrop-blur-md sm:flex-row sm:items-center"
            >
              {/* Day */}
              <div className="flex flex-col gap-1.5 sm:w-40">
                <label className="text-xs text-white/40">{t("scheduleDayLabel")}</label>
                <select
                  value={slot.day}
                  onChange={(e) => updateSlot(slot.id, "day", e.target.value)}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-white/[6%] py-2.5 pl-3 pr-9 text-sm text-white"
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
                  className="w-full appearance-none rounded-xl border border-white/10 bg-white/[6%] py-2.5 pl-3 pr-9 text-sm text-white"
                >
                  {timeSuggestions.map((time) => (
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
                className="cursor-pointer self-end rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/40 transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60 sm:self-auto"
              >
                ✕
              </button>
            </div>
          ))}

          {/* Add slot */}
          <button
            type="button"
            onClick={addSlot}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 bg-white/[2%] p-4 text-sm font-medium text-white/40 transition-colors hover:border-teal-accent/30 hover:bg-teal-accent/5 hover:text-teal-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
          >
            <Plus className="size-4" />
            {t("scheduleAddSlot")}
          </button>
        </div>
      )}
    </div>
  )
}
