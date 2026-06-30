import Image from "next/image"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { MapPin, Star, Clock } from "lucide-react"
import { getCoachById } from "@/lib/coaches"
import type { LanguageCode } from "@/lib/coaches"
import { LanguageList } from "@/components/ui/language-list"
import { BookingPanel } from "@/components/coach-profile/booking-panel"
import { SecondaryPageHeader } from "@/components/secondary-page-header"
import { UnderwaterBackground } from "@/components/underwater-background"
import type { DayKey } from "@/lib/coaches"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import * as Flags from "country-flag-icons/react/3x2"

interface Props {
  params: Promise<{ locale: string; id: string }>
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale, id } = await params
  const coach = getCoachById(id)
  if (!coach) {
    const t = await getTranslations({ locale, namespace: "seo" })
    return { title: t("notFound") }
  }
  const tSeo = await getTranslations({ locale, namespace: "seo" })
  const tBadges = await getTranslations({ locale, namespace: "coaches.badges" })
  const specialties = coach.badgeKeys
    .slice(0, 3)
    .map((key) => tBadges(key))
    .join(", ")
  return {
    title: `${coach.name} — SwimAI`,
    description: tSeo("coachProfileDescription")
      .replace("{name}", coach.name)
      .replace("{specialties}", specialties),
    alternates: {
      canonical: `https://swimai.app/${locale}/coaches/${id}`,
      languages: {
        "fr": `https://swimai.app/fr/coaches/${id}`,
        "en": `https://swimai.app/en/coaches/${id}`,
      },
    },
  }
}

const ALL_DAYS: DayKey[] = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
]

export default async function CoachProfilePage({ params }: Props) {
  const { locale, id } = await params
  const coach = getCoachById(id)

  if (!coach) notFound()

  const t = await getTranslations("coachProfile")
  const tc = await getTranslations("coaches")
  const tl = await getTranslations("languages")
  const langKeys = ["fr", "en", "es", "de", "it", "ar", "zh", "pt", "ru", "ja"] as const
  const languageLabels = Object.fromEntries(
    langKeys.map((k) => [k, tl(k)])
  ) as Record<(typeof langKeys)[number], string>

  return (
    <>
      <UnderwaterBackground />
      <SecondaryPageHeader />
      <main className="relative z-10">
        {/* Hero */}
        <div className="border-b border-white/10">
          <div className="relative mx-auto max-w-3xl px-4 py-12">
            {/* Coach info */}
            <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
              <div className="relative shrink-0">
                <Image
                  src={coach.avatar || "/placeholder.svg"}
                  alt={coach.name}
                  width={120}
                  height={120}
                  className="size-28 rounded-md object-cover ring-4 ring-white/10 sm:size-32"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-3xl font-bold text-white sm:text-4xl">{coach.name}</h1>

                {/* Badges */}
                <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                  {coach.badgeKeys.map((badgeKey) => (
                    <span
                      key={badgeKey}
                      className="whitespace-nowrap rounded-full border border-teal-accent/30 bg-teal-accent/10 px-3 py-1 text-sm font-medium text-teal-accent-light"
                    >
                      {tc(`badges.${badgeKey}`)}
                    </span>
                  ))}
                </div>

                {/* Meta */}
                <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-white/70 sm:justify-start">
                  <div className="flex items-center gap-1.5">
                    <Star className="size-4 shrink-0 fill-star-gold text-star-gold" />
                    <span className="font-bold text-white">{coach.rating}</span>
                    <span className="text-sm">({coach.reviews} {tc("reviewsSuffix")})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="size-4 shrink-0 text-teal-accent" aria-hidden="true" />
                    <span className="flex items-center gap-1.5 text-white">
                      {coach.city}
                      {(() => {
                        const F = (Flags as unknown as Record<string, React.ComponentType<{ style?: React.CSSProperties; className?: string }>>)[coach.country]
                        return F ? (
                          <span aria-hidden="true">
                            <F style={{ width: 20, height: 14 }} className="rounded-sm opacity-80" />
                          </span>
                        ) : null
                      })()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-4 shrink-0 text-teal-accent" />
                    <span>{t("yearsExperience", { count: coach.yearsExperience })}</span>
                  </div>
                </div>
              </div>

              {/* Price + CTA */}
              <div className="flex shrink-0 flex-col items-center gap-2 sm:items-end">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">{coach.price}</span>
                  <span className="text-sm text-white/50">{tc("priceUnit")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="mx-auto max-w-3xl px-4 py-10">
          <div className="grid gap-8 sm:grid-cols-3">
            {/* Left: bio + availability */}
            <div className="flex flex-col gap-8 sm:col-span-2">
              {/* Bio */}
              <section>
                <h2 className="mb-3 text-lg font-bold text-white">{t("bioTitle")}</h2>
                <p className="text-sm leading-relaxed text-white/70">{coach.bio}</p>
              </section>

              {/* Languages */}
              <section>
                <h2 className="mb-3 text-lg font-bold text-white">{t("languagesTitle")}</h2>
                <LanguageList
                  codes={coach.languages}
                  labels={languageLabels}
                  size={20}
                  showLabels
                />
              </section>

              {/* Availability */}
              <section>
                <h2 className="mb-3 text-lg font-bold text-white">{t("availabilityTitle")}</h2>
                <div className="flex flex-wrap gap-2">
                  {ALL_DAYS.map((day) => {
                    const available = coach.availability.includes(day)
                    return (
                      <span
                        key={day}
                        className={cn(
                          "flex size-10 items-center justify-center rounded-full text-sm font-medium transition-all",
                          available
                            ? "bg-teal-accent/15 text-teal-accent ring-1 ring-teal-accent/30"
                            : "bg-white/5 text-white/25 ring-1 ring-white/10"
                        )}
                      >
                        {t(`days.${day}`)}
                      </span>
                    )
                  })}
                </div>
              </section>
            </div>

            {/* Right: booking panel */}
            <div className="sm:col-span-1">
              <div className="rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-5 shadow-xl shadow-black/20 backdrop-blur-md">
                <p className="mb-1 text-2xl font-bold text-white">{coach.price}</p>
                <p className="mb-4 text-sm text-white/50">{tc("priceUnit")}</p>
                <BookingPanel coach={coach} locale={locale} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
