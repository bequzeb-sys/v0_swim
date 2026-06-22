"use client"

import { MapPin, Waves, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTranslations } from "next-intl"

const specialtyKeys = [
  "all",
  "freestyle",
  "openWater",
  "butterfly",
  "competition",
] as const

export function SearchBar() {
  const t = useTranslations("search")

  return (
    <div
      id="search"
      className="mx-auto w-full max-w-6xl rounded-2xl border border-white/10 bg-white/5 p-3 shadow-2xl shadow-black/40 backdrop-blur-md"
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
            />
          </div>
        </div>

        <div className="hidden w-px self-stretch bg-white/10 md:block" />

        {/* Spécialité */}
        <div className="flex flex-1 items-center gap-3 px-5 py-3">
          <Waves className="size-6 shrink-0 text-teal-accent" />
          <div className="flex w-full flex-col text-left">
            <span className="text-sm text-text-secondary">{t("specialtyLabel")}</span>
            <Select defaultValue={t("specialtyOptions.all")}>
              <SelectTrigger className="h-auto w-full border-0 bg-transparent p-0 text-lg font-medium text-white shadow-none focus:ring-0 focus-visible:ring-0 [&>svg]:text-white">
                <SelectValue placeholder={t("specialtyPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
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
            <span className="text-lg font-medium text-white/70">
              {t("datePlaceholder")}
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center md:pl-3">
          <Button className="h-full w-full rounded-xl bg-teal-accent px-8 py-4 text-lg font-bold text-primary-foreground hover:bg-teal-accent-light md:w-auto">
            {t("cta")}
          </Button>
        </div>
      </div>
    </div>
  )
}
