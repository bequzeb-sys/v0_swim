import { getTranslations } from "next-intl/server"
import { getLocale } from "next-intl/server"
import { coaches } from "@/lib/coaches"
import type { CoachBadgeKey, LanguageCode, DayKey } from "@/lib/coaches"
import { CoachesListingClient } from "@/components/coaches/coaches-listing-client"
import { UnderwaterBackground } from "@/components/underwater-background"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Trouvez un coach — SwimAI",
    description: "Parcourez et filtrez les coachs de natation certifiés près de chez vous.",
  }
}

export default async function CoachesPage() {
  const locale = await getLocale()
  const t = await getTranslations("coachesPage")
  const tc = await getTranslations("coaches")
  const tl = await getTranslations("languages")
  const td = await getTranslations("coachProfile")

  const badgeKeys = ["freestyle", "competition", "openWater", "allLevels", "butterfly", "advanced"] as const
  const langKeys = ["fr", "en", "es", "de", "it", "ar", "zh", "pt", "ru", "ja"] as const
  const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const

  const badgeLabels = Object.fromEntries(
    badgeKeys.map((k) => [k, tc(`badges.${k}`)])
  ) as Record<CoachBadgeKey, string>

  const languageLabels = Object.fromEntries(
    langKeys.map((k) => [k, tl(k)])
  ) as Record<LanguageCode, string>

  const dayLabels = Object.fromEntries(
    dayKeys.map((k) => [k, td(`days.${k}`)])
  ) as Record<DayKey, string>

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background">
      <UnderwaterBackground />
      <CoachesListingClient
        coaches={coaches}
        translations={{
          badges: Object.fromEntries(
            badgeKeys.map((k) => [k, tc(`badges.${k}`)])
          ) as Record<string, string>,
          reviewsSuffix: tc("reviewsSuffix"),
          priceUnit: tc("priceUnit"),
          cardCta: tc("cardCta"),
          languages: languageLabels,
        }}
        page={{
          title: t("title"),
          resultCountTemplate: t.raw("resultCount"),
          filters: {
            location: t("filters.location"),
            locationPlaceholder: t("filters.locationPlaceholder"),
            specialty: t("filters.specialty"),
            language: t("filters.language"),
            maxPrice: t("filters.maxPrice"),
            minRating: t("filters.minRating"),
            minExperience: t("filters.minExperience"),
            availability: t("filters.availability"),
            gender: t("filters.gender"),
            reset: t("filters.reset"),
            all: t("filters.genderAll"),
            female: t("filters.genderFemale"),
            male: t("filters.genderMale"),
          },
          emptyTitle: t("emptyTitle"),
          emptyReset: t("emptyReset"),
          mobileFilters: t("mobileFilters"),
          close: t("close"),
        }}
        badgeLabels={badgeLabels}
        dayLabels={dayLabels}
      />
    </div>
  )
}
