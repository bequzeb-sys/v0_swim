"use client"

import { useState, useMemo } from "react"
import { DayPicker, useDayPicker } from "react-day-picker"
import { fr as frLocale, enUS as enLocale } from "date-fns/locale"
import { useRouter } from "@/i18n/navigation"
import { Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Coach, DayKey } from "@/lib/coaches"
import { useTranslations } from "next-intl"
import { useAuth } from "@/lib/auth/auth-context"

// Map DayKey to JS day-of-week index (0=Sun, 1=Mon, ...)
const DAY_KEY_TO_INDEX: Record<DayKey, number> = {
  sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6,
}

// Generate time slots — mock slots per available day
const TIME_SLOTS = ["09:00", "11:00", "14:00", "16:00"]

function CalendarNav() {
  const { previousMonth, nextMonth, goToMonth } = useDayPicker()
  return (
    <nav className="flex items-center justify-between py-2 px-1">
      <button
        type="button"
        onClick={() => previousMonth && goToMonth(previousMonth)}
        disabled={!previousMonth}
        className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60 disabled:opacity-25 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
      </button>
      <span className="text-sm font-semibold text-white" />
      <button
        type="button"
        onClick={() => nextMonth && goToMonth(nextMonth)}
        disabled={!nextMonth}
        className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60 disabled:opacity-25 disabled:cursor-not-allowed"
      >
        <ChevronRight className="size-4" aria-hidden="true" />
      </button>
    </nav>
  )
}

interface BookingPanelProps {
  coach: Coach
  locale: string
}

export function BookingPanel({ coach, locale }: BookingPanelProps) {
  const t = useTranslations("coachProfile")
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)
  const [confirming, setConfirming] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date())
  const [needsLogin, setNeedsLogin] = useState(false)
  const { user } = useAuth()

  // Available days of week from coach availability
  const availableDayIndexes = useMemo(() => {
    return coach.availability.map((day) => DAY_KEY_TO_INDEX[day])
  }, [coach.availability])

  // Disable days not in coach availability
  const isDisabled = (date: Date) => {
    const dayIndex = date.getDay()
    return !availableDayIndexes.includes(dayIndex)
  }

  // Today as minimum date
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  async function handleConfirm() {
    if (!selectedDate || !selectedTime) return
    if (!user) {
      setNeedsLogin(true)
      return
    }
    setConfirming(true)
    await new Promise((r) => setTimeout(r, 800))
    setConfirmed(true)
    setTimeout(() => {
      router.push("/dashboard/client")
    }, 1500)
  }

  const canConfirm = selectedDate && selectedTime

  return (
    <div className="flex flex-col gap-5 w-full max-w-sm mx-auto lg:max-w-none lg:mx-0">

      {/* Price */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-4xl font-extrabold text-white">{coach.price}</span>
        <span className="text-sm text-white/50">/{t("priceUnit")}</span>
      </div>

      {/* Calendar */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-white/70">
          <Clock className="size-4 text-teal-accent" aria-hidden="true" />
          {t("chooseDate")}
        </div>
        <div>
          {/* Custom calendar header */}
          <div className="flex items-center justify-between px-1 py-2">
            <button
              type="button"
              onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}
              className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
              aria-label={t("prevMonth")}
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <span className="text-sm font-semibold text-white capitalize">
              {calendarMonth.toLocaleDateString(locale, { month: "long", year: "numeric" })}
            </span>
            <button
              type="button"
              onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}
              className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
              aria-label={t("nextMonth")}
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>

          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date)
              setSelectedTime(undefined)
            }}
            month={calendarMonth}
            onMonthChange={setCalendarMonth}
            hideNavigation
            disabled={[{ before: today }, isDisabled]}
            classNames={{
              root: "w-full",
              months: "w-full",
              month: "w-full",
              month_caption: "hidden",
              month_grid: "w-full border-collapse mt-1",
              weekdays: "flex",
              weekday: "flex-1 text-center text-xs font-medium text-white/30 pb-1",
              week: "flex mt-1",
              day: "flex-1 flex items-center justify-center p-0",
              day_button: cn(
                "w-8 h-8 rounded-lg text-sm font-medium transition-all cursor-pointer",
                "text-white/70 hover:bg-white/10 hover:text-white",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
              ),
              selected: "[&>button]:!bg-teal-accent [&>button]:!text-navy-deep [&>button]:!rounded-lg [&>button]:font-bold",
              today: "text-teal-accent font-semibold",
              disabled: "opacity-25 cursor-not-allowed pointer-events-none",
              outside: "opacity-25",
              hidden: "invisible",
            }}
          />
        </div>
      </div>

      {/* Time slots — only shown when date selected */}
      {selectedDate && (
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-white/70">
            <Clock className="size-4 text-teal-accent" aria-hidden="true" />
            {t("chooseTime")}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedTime(slot)}
                className={cn(
                  "cursor-pointer rounded-xl border py-2 text-sm font-medium transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
                  selectedTime === slot
                    ? "border-teal-accent bg-teal-accent text-navy-deep"
                    : "border-white/10 bg-white/5 text-white/70 hover:border-teal-accent/30 hover:text-white"
                )}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Confirm button */}
      {needsLogin ? (
        <div className="flex flex-col gap-3">
          <p className="text-center text-sm text-white/60">{t("loginRequired")}</p>
          <button
            type="button"
            onClick={() => router.push(`/login?redirect=/coaches/${coach.id}` as Parameters<typeof router.push>[0])}
            className="w-full cursor-pointer rounded-xl bg-blue-accent py-3 text-sm font-semibold text-white transition-all hover:bg-blue-accent-dark active:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
          >
            {t("loginCta")}
          </button>
          <button
            type="button"
            onClick={() => setNeedsLogin(false)}
            className="w-full cursor-pointer rounded-xl border border-white/10 py-2.5 text-sm text-white/50 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
          >
            {t("backButton")}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!canConfirm || confirming || confirmed}
          className={cn(
            "w-full cursor-pointer rounded-xl py-3 text-sm font-semibold transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
            confirmed
              ? "border border-teal-accent/30 bg-teal-accent/10 text-teal-accent"
              : canConfirm
              ? "bg-blue-accent text-white hover:bg-blue-accent-dark active:opacity-90 shadow-lg shadow-blue-accent/20"
              : "cursor-not-allowed bg-white/5 text-white/30 border border-white/10"
          )}
        >
          {confirmed
            ? t("bookingConfirmed")
            : confirming
            ? t("bookingConfirming")
            : t("bookSession")}
        </button>
      )}

      {/* Cancellation note */}
      {canConfirm && !confirmed && (
        <p className="text-center text-xs text-white/30">{t("cancellationNote")}</p>
      )}

    </div>
  )
}