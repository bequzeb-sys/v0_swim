"use client"

import { useState } from "react"
import { MapPin, Waves, Calendar } from "lucide-react"
import { format } from "date-fns"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePickerField } from "@/components/date-picker-field"
import { fr, enUS } from "date-fns/locale"

const specialtyKeys = [
  "all",
  "apprentissage",
  "aquagym",
  "aquaphobie",
  "bebeNageur",
  "competition",
  "eauLibre",
  "natationAdaptee",
  "natationPalmes",
  "perfectionnement",
  "sauvetageAquatique",
  "triathlon",
] as const

const LOCALE_MAP = { fr, en: enUS } as const

export function SearchBar() {
  const t = useTranslations("search")
  const locale = useLocale()
  const router = useRouter()

  const [location, setLocation] = useState("")
  const [specialty, setSpecialty] = useState("all")
  const [date, setDate] = useState<Date | undefined>(undefined)

  function handleSearch() {
    const params = new URLSearchParams()
    if (location.trim()) params.set("location", location.trim())
    if (specialty && specialty !== "all") params.set("badges", specialty)
    if (date) params.set("date", format(date, "yyyy-MM-dd"))
    const queryString = params.toString()
    router.push(
      queryString
        ? { pathname: "/coaches", query: Object.fromEntries(params) }
        : "/coaches"
    )
  }

  return (
    <div
      id="search"
      className="scroll-mt-28 mx-auto w-full max-w-5xl rounded-2xl border border-blue-300/20 bg-blue-400/[8%] p-3 shadow-2xl shadow-black/20 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-stretch md:gap-0">
        {/* Localisation */}
        <div className="flex flex-1 items-center gap-3 px-5 py-3">
          <MapPin className="size-6 shrink-0 text-teal-accent" />
          <div className="flex flex-col text-left">
            <span className="text-sm text-text-secondary">{t("locationLabel")}</span>
            <input
              type="text"
              placeholder={t("locationPlaceholder")}
              className="w-full bg-transparent text-lg font-medium text-white placeholder:text-white/70 focus:outline-none"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
        </div>

        <div className="hidden w-px self-stretch bg-white/10 md:block" />

        {/* Spécialité */}
        <div className="flex flex-1 items-center gap-3 px-5 py-3">
          <Waves className="size-6 shrink-0 text-teal-accent" />
          <div className="flex w-full flex-col text-left">
            <span className="text-sm text-text-secondary">{t("specialtyLabel")}</span>
            <Select value={specialty} onValueChange={(v) => setSpecialty(v ?? "all")}>
              <SelectTrigger className="h-auto w-full gap-2 rounded-none border-0 bg-transparent p-0 text-lg font-medium text-white shadow-none outline-none hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 data-[size=default]:h-auto [&_svg]:text-white [&_svg:not([class*='size-'])]:size-4">
                <SelectValue placeholder={t("specialtyPlaceholder")}>
                  {(value: string | null) =>
                    value && value !== "all"
                      ? t(`specialtyOptions.${value}`)
                      : t("specialtyPlaceholder")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent
                alignItemWithTrigger={false}
                className="min-w-[var(--anchor-width)] rounded-2xl border border-blue-300/20 bg-blue-400/[8%] text-white shadow-xl shadow-black/20 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] [&_[data-slot=select-item]]:text-white [&_[data-slot=select-item]]:focus:bg-white/10 [&_[data-slot=select-item]]:focus:text-white"
              >
                {specialtyKeys.map((key) => (
                  <SelectItem key={key} value={key}>
                    {t(`specialtyOptions.${key}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="hidden w-px self-stretch bg-white/10 md:block" />

        {/* Date */}
        <div className="flex flex-1 items-center gap-3 px-5 py-3">
          <Calendar className="size-6 shrink-0 text-teal-accent" />
          <div className="flex flex-col text-left">
            <span className="text-sm text-text-secondary">{t("dateLabel")}</span>
            <DatePickerField
              value={date}
              onChange={setDate}
              placeholder={t("datePlaceholder")}
              locale={locale}
              ariaLabel={t("dateLabel")}
            />
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center md:pl-3">
          <Button
            variant="entry"
            type="button"
            className="h-full md:w-auto"
            onClick={handleSearch}
          >
            {t("cta")}
          </Button>
        </div>
      </div>
    </div>
  )
}