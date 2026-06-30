"use client"

import * as React from "react"
import { useState } from "react"
import { DayPicker } from "react-day-picker"
import { format, addMonths, subMonths } from "date-fns"
import type { Locale } from "date-fns"
import { fr, enUS } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Popover } from "@base-ui/react/popover"
import { cn } from "@/lib/utils"

interface DatePickerFieldProps {
  value: Date | undefined
  onChange: (date: Date | undefined) => void
  placeholder: string
  locale?: string
  ariaLabel?: string
}

const LOCALE_MAP: Record<string, Locale> = {
  fr,
  en: enUS,
}

export function DatePickerField({
  value,
  onChange,
  placeholder,
  locale = "fr",
  ariaLabel,
}: DatePickerFieldProps) {
  const dateFnsLocale = LOCALE_MAP[locale] ?? enUS
  const formatted = value ? format(value, "d MMM yyyy", { locale: dateFnsLocale }) : ""
  const [month, setMonth] = useState<Date>(value ?? new Date())
  const [open, setOpen] = useState(false)

  const goToPrevMonth = () => setMonth((current) => subMonths(current, 1))
  const goToNextMonth = () => setMonth((current) => addMonths(current, 1))

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        aria-label={ariaLabel ?? placeholder}
        className="group flex w-full cursor-pointer items-center justify-between gap-2 bg-transparent text-left text-lg font-medium text-white outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
      >
        <span className={cn("truncate", !value && "text-white/70")}>
          {formatted || placeholder}
        </span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8} align="start" className="z-50">
          <Popover.Popup
            className={cn(
              "rounded-2xl border border-white/10 p-3 shadow-xl backdrop-blur-md",
              "bg-white/[8%] text-white",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
            )}
          >
            <div className="mb-2 flex h-10 items-center justify-between px-2">
              <button
                type="button"
                aria-label={locale === "fr" ? "Mois précédent" : "Previous month"}
                onClick={goToPrevMonth}
                className="inline-flex size-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
              >
                <ChevronLeft className="size-5" />
              </button>
              <span className="text-base font-semibold text-white" aria-live="polite">
                {format(month, "MMMM yyyy", { locale: dateFnsLocale })}
              </span>
              <button
                type="button"
                aria-label={locale === "fr" ? "Mois suivant" : "Next month"}
                onClick={goToNextMonth}
                className="inline-flex size-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
            <DayPicker
              mode="single"
              month={month}
              onMonthChange={setMonth}
              hideNavigation
              disabled={(day) => {
                const m = month
                return day.getMonth() !== m.getMonth() || day.getFullYear() !== m.getFullYear()
              }}
              selected={value}
              onSelect={(d) => {
                onChange(d ?? undefined)
                setTimeout(() => setOpen(false), 150)
              }}
              locale={dateFnsLocale}
              classNames={{
                root: "rdp-dark",
                months: "flex gap-6",
                month: "space-y-3",
                month_caption: "hidden",
                weekdays: "flex",
                weekday: "w-9 text-xs font-medium text-white/50",
                week: "flex w-full mt-1",
                day: "size-9 p-0 text-sm relative",
                day_button:
                  "inline-flex size-9 cursor-pointer items-center justify-center rounded-md text-white transition-colors hover:bg-teal-accent/20 hover:text-teal-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
                today: "dark:!text-teal-accent dark:font-semibold",
                selected: "dark:!bg-teal-accent dark:!text-white dark:hover:!bg-teal-accent dark:hover:!text-white rounded-md",
                outside: "text-white/20 opacity-40",
                disabled: "text-white/20 opacity-40 cursor-not-allowed",
              }}
            />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}