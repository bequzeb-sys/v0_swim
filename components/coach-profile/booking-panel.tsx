"use client"

import { useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth/auth-context"
import { useRouter } from "@/i18n/navigation"
import type { Coach, DayKey } from "@/lib/coaches"
import { cn } from "@/lib/utils"

const DAY_ORDER: DayKey[] = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
]

interface BookingPanelProps {
  coach: Coach
  locale: string
}

export function BookingPanel({ coach, locale }: BookingPanelProps) {
  const t = useTranslations("booking")
  const tp = useTranslations("coachProfile")
  const { user } = useAuth()
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [needsLogin, setNeedsLogin] = useState(false)

  const upcomingSlots = useMemo(() => {
    const slots: { date: Date; dayKey: DayKey }[] = []
    const today = new Date()
    const seen = new Set<string>()

    for (let i = 0; slots.length < 8; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      const dayKey = DAY_ORDER[d.getDay() === 0 ? 6 : d.getDay() - 1] as DayKey
      if (!coach.availability.includes(dayKey)) continue
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
      if (seen.has(key)) continue
      seen.add(key)
      slots.push({ date: d, dayKey })
    }
    return slots
  }, [coach.availability])

  function formatDate(date: Date, loc: string): string {
    return date.toLocaleDateString(loc === "en" ? "en-GB" : "fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      setSelectedDate(null)
      setConfirmed(false)
      setNeedsLogin(false)
    }
  }

  function handleConfirm() {
    if (!user) {
      setNeedsLogin(true)
      return
    }
    setConfirmed(true)
  }

  function handleViewBookings() {
    setOpen(false)
    setSelectedDate(null)
    setConfirmed(false)
    router.push("/dashboard/client/bookings")
  }

  return (
    <>
      <Button
        onClick={() => handleOpenChange(true)}
        variant="entry"
        className="w-full py-6 text-base active:scale-[0.98] sm:sticky sm:top-4 sm:w-auto"
      >
        {tp("bookCta")}
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent closeLabel={t("close")}>
          {!confirmed ? (
            <>
              <DialogHeader>
                <DialogTitle>
                  {t("panelTitle", { coach: coach.name })}
                </DialogTitle>
                <DialogDescription>
                  {t("panelSubtitle")}
                </DialogDescription>
              </DialogHeader>

              <DialogBody>
                <div className="flex flex-col gap-2">
                  {upcomingSlots.map(({ date, dayKey }) => {
                    const dateStr = date.toISOString()
                    const isSelected = selectedDate === dateStr
                    return (
                      <button
                        key={dateStr}
                        type="button"
                        onClick={() => setSelectedDate(dateStr)}
                        className={cn(
                          "flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
                          isSelected
                            ? "border-blue-accent bg-blue-accent/15 text-white"
                            : "border-white/10 bg-white/[4%] text-white/70 hover:border-white/20 hover:bg-white/[6%]"
                        )}
                      >
                        <span>{formatDate(date, locale)}</span>
                        <span className="rounded-full border border-white/20 px-2 py-0.5 text-xs">
                          {tp(`days.${dayKey}`)}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </DialogBody>

              <DialogFooter>
                {needsLogin ? (
                  <div className="flex flex-col gap-3">
                    <p className="text-center text-sm text-text-secondary">
                      {t("loginPrompt")}
                    </p>
                    <Button
                      href={{
                        pathname: "/login",
                        query: { redirect: `/coaches/${coach.id}` },
                      }}
                      variant="entry"
                      className="w-full text-sm font-bold"
                    >
                      {t("loginCta")}
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleConfirm}
                    disabled={!selectedDate}
                    variant="entry"
                    className="w-full text-sm active:scale-[0.98]"
                  >
                    {t("confirm")}
                  </Button>
                )}
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="flex size-14 items-center justify-center rounded-md bg-teal-accent/20">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="size-7 text-teal-accent"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <DialogTitle>{t("successTitle")}</DialogTitle>
                <DialogDescription>
                  {t("successMessage", {
                    coach: coach.name,
                    date: selectedDate
                      ? formatDate(new Date(selectedDate), locale)
                      : "",
                  })}
                </DialogDescription>
              </div>

              <DialogFooter>
                <Button
                  onClick={handleViewBookings}
                  variant="primary"
                  className="w-full text-sm active:scale-[0.98]"
                >
                  {t("viewBookings")}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
