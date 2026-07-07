import { Suspense } from "react"
import { getTranslations } from "next-intl/server"
import { getLocale } from "next-intl/server"
import { getAllCoaches, getCoachesByFilters } from "@/lib/coaches"
import type { CoachFilters, CoachBadgeKey, DayKey, LanguageCode } from "@/lib/coaches"
import { CoachesListingClient } from "@/components/coaches/coaches-listing-client"
import { UnderwaterBackground } from "@/components/underwater-background"
import { SecondaryPageHeader } from "@/components/secondary-page-header"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "seo" })
  return {
    title: t("coachesTitle"),
    description: t("coachesDescription"),
  }
}

export default async function CoachesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { locale } = await params
  const sp = await searchParams

  const filters: CoachFilters = {
    country: typeof sp.country === "string" ? sp.country : undefined,
    location: typeof sp.location === "string" ? sp.location : undefined,
    badges: typeof sp.badges === "string" ? ([sp.badges] as CoachBadgeKey[]) : undefined,
    languages: typeof sp.languages === "string" ? ([sp.languages] as LanguageCode[]) : undefined,
    maxPrice: typeof sp.maxPrice === "string" ? Number(sp.maxPrice) : undefined,
    minRating: typeof sp.minRating === "string" ? parseFloat(sp.minRating) : undefined,
    minExperience: typeof sp.minExperience === "string" ? Number(sp.minExperience) : undefined,
    availability: typeof sp.availability === "string" ? ([sp.availability] as DayKey[]) : undefined,
    gender: typeof sp.gender === "string" ? (sp.gender as "" | "M" | "F") : undefined,
  }

  // Use server-side filtering — replace with real DB call during database sprint
  const filteredCoaches = Object.values(filters).some(Boolean)
    ? getCoachesByFilters(filters)
    : getAllCoaches()

  const t = await getTranslations("coachesPage")
  const tc = await getTranslations("coaches")
  const tl = await getTranslations("languages")
  const td = await getTranslations("coachProfile")

  const badgeKeys = [
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
    <>
      <UnderwaterBackground />
      <SecondaryPageHeader />
      <Suspense fallback={null}>
        <CoachesListingClient
          coaches={filteredCoaches}
        translations={{
          badges: Object.fromEntries(
            badgeKeys.map((k) => [k, tc(`badges.${k}`)])
          ) as Record<string, string>,
          reviewsSuffix: tc("reviewsSuffix"),
          priceUnit: tc("priceUnit"),
          cardCta: tc("cardCta"),
          listingCta: tc("listingCta"),
          languagesTitle: td("languagesTitle"),
          languages: languageLabels,
        }}
        page={{
          title: t("title"),
          resultCountTemplate: t.raw("resultCount"),
          filters: {
            location: t("filters.location"),
            locationPlaceholder: t("filters.locationPlaceholder"),
            country: t("filters.country"),
            allCountries: t("filters.allCountries"),
            specialty: t("filters.specialty"),
          allSpecialties: t("filters.allSpecialties"),
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
      </Suspense>
      <Footer />
    </>
  )
}
