"use client"

import { useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { Plus, ChevronDown, Check } from "lucide-react"
import { Popover } from "@base-ui/react/popover"
import { cn } from "@/lib/utils"

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

  const [openSlotId, setOpenSlotId] = useState<string | null>(null)

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
                <Popover.Root
                  open={openSlotId === `day-${slot.id}`}
                  onOpenChange={(open) => setOpenSlotId(open ? `day-${slot.id}` : null)}
                >
                  <Popover.Trigger className={cn(
                    "flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[6%] px-3 py-2.5 text-sm text-white transition-colors hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
                    openSlotId === `day-${slot.id}` && "border-teal-accent/40 bg-teal-accent/10"
                  )}>
                    <span>{slot.day}</span>
                    <ChevronDown className={cn("size-4 shrink-0 text-white/40 transition-transform duration-200", openSlotId === `day-${slot.id}` && "rotate-180")} aria-hidden="true" />
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Positioner sideOffset={4} align="start" className="z-50 w-[var(--anchor-width)]">
                      <Popover.Popup className="rounded-2xl border border-white/10 bg-white/[8%] p-1.5 shadow-xl shadow-black/20 backdrop-blur-md text-white data-[state=open]:animate-in data-[state=closed]:animate-out">
                        {days.map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => { updateSlot(slot.id, "day", d); setOpenSlotId(null) }}
                            className={cn(
                              "flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
                              slot.day === d ? "bg-teal-accent/10 text-teal-accent" : "text-white/70 hover:bg-white/10 hover:text-white"
                            )}
                          >
                            {d}
                            {slot.day === d && <Check className="ml-auto size-4 text-teal-accent" aria-hidden="true" />}
                          </button>
                        ))}
                      </Popover.Popup>
                    </Popover.Positioner>
                  </Popover.Portal>
                </Popover.Root>
              </div>

              {/* Time */}
              <div className="flex flex-col gap-1.5 sm:flex-1">
                <label className="text-xs text-white/40">{t("scheduleTimeLabel")}</label>
                <Popover.Root
                  open={openSlotId === `time-${slot.id}`}
                  onOpenChange={(open) => setOpenSlotId(open ? `time-${slot.id}` : null)}
                >
                  <Popover.Trigger className={cn(
                    "flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[6%] px-3 py-2.5 text-sm text-white transition-colors hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
                    openSlotId === `time-${slot.id}` && "border-teal-accent/40 bg-teal-accent/10"
                  )}>
                    <span>{slot.time}</span>
                    <ChevronDown className={cn("size-4 shrink-0 text-white/40 transition-transform duration-200", openSlotId === `time-${slot.id}` && "rotate-180")} aria-hidden="true" />
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Positioner sideOffset={4} align="start" className="z-50 w-[var(--anchor-width)]">
                      <Popover.Popup className="rounded-2xl border border-white/10 bg-white/[8%] p-1.5 shadow-xl shadow-black/20 backdrop-blur-md text-white data-[state=open]:animate-in data-[state=closed]:animate-out">
                        {timeSuggestions.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => { updateSlot(slot.id, "time", time); setOpenSlotId(null) }}
                            className={cn(
                              "flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
                              slot.time === time ? "bg-teal-accent/10 text-teal-accent" : "text-white/70 hover:bg-white/10 hover:text-white"
                            )}
                          >
                            {time}
                            {slot.time === time && <Check className="ml-auto size-4 text-teal-accent" aria-hidden="true" />}
                          </button>
                        ))}
                      </Popover.Popup>
                    </Popover.Positioner>
                  </Popover.Portal>
                </Popover.Root>
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
