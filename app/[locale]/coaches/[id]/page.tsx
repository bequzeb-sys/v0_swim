import Image from "next/image"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { MapPin, Star, Clock, User, Waves } from "lucide-react"
import { getCoachById } from "@/lib/coaches"
import type { LanguageCode } from "@/lib/coaches"
import { LanguageList } from "@/components/ui/language-list"
import { BookingPanel } from "@/components/coach-profile/booking-panel"
import { ReviewsPanel } from "@/components/coach-profile/reviews-panel"
import { SecondaryPageHeader } from "@/components/secondary-page-header"
import { UnderwaterBackground } from "@/components/underwater-background"
import { FooterCTA } from "@/components/footer-cta"
import { Footer } from "@/components/footer"
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
    description: tSeo("coachProfileDescription", {
      name: coach.name,
      specialties,
    }),
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
        <div className="mx-auto max-w-7xl px-4 pt-6 pb-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">

            {/* LEFT SIDE — hero + content cards stacked */}
            <div className="flex min-w-0 flex-1 flex-col gap-6">

              {/* Hero card */}
              <div className="rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-6 shadow-xl shadow-black/20 backdrop-blur-md">
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
                    <p className="mt-1 text-sm text-white/50">{coach.certification}</p>

                    {/* Badges */}
                    <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                      {coach.badgeKeys.slice(0, 2).map((badgeKey) => (
                        <span
                          key={badgeKey}
                          className="whitespace-nowrap rounded-full border border-teal-accent/30 bg-teal-accent/10 px-2 py-0.5 text-xs font-medium text-teal-accent-light"
                        >
                          {tc(`badges.${badgeKey}`)}
                        </span>
                      ))}
                    </div>

                    {/* Languages */}
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                      <span className="text-xs text-white/40">{t("languagesTitle")}</span>
                      <LanguageList
                        codes={coach.languages}
                        labels={languageLabels}
                        size={16}
                        showLabels
                      />
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
                </div>
              </div>

              {/* Bio card */}
              <section className="rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-6 shadow-xl shadow-black/20 backdrop-blur-md">
                <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-white">
                  <User className="size-4 text-teal-accent" aria-hidden="true" />
                  {t("bioTitle")}
                </h2>
                <p className="text-sm leading-relaxed text-white/70">{coach.bio}</p>
              </section>

              {/* Specialties card */}
              <section className="rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-6 shadow-xl shadow-black/20 backdrop-blur-md">
                <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-white">
                  <Waves className="size-4 text-teal-accent" aria-hidden="true" />
                  {t("specialtiesTitle")}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {coach.badgeKeys.map((badgeKey) => (
                    <span
                      key={badgeKey}
                      className="whitespace-nowrap rounded-full border border-teal-accent/30 bg-teal-accent/10 px-3 py-1.5 text-sm font-medium text-teal-accent-light"
                    >
                      {tc(`badges.${badgeKey}`)}
                    </span>
                  ))}
                </div>
              </section>

              {/* Reviews card */}
              <section className="rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-6 shadow-xl shadow-black/20 backdrop-blur-md">
                <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-white">
                  <Star className="size-4 text-teal-accent" aria-hidden="true" />
                  {t("reviewsTitle")} ({coach.reviews})
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {coach.reviewsList.slice(0, 3).map((review) => (
                    <div key={review.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="mb-2 flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-teal-accent/15 text-sm font-bold text-teal-accent">
                          {review.reviewerName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{review.reviewerName}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: review.rating }).map((_, j) => (
                                <Star key={j} className="size-3 fill-star-gold text-star-gold" aria-hidden="true" />
                              ))}
                            </div>
                            <span className="text-xs text-white/40">
                              {new Date(review.date).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs leading-relaxed text-white/60">{review.text}</p>
                    </div>
                  ))}
                </div>
                <ReviewsPanel
                  reviews={coach.reviewsList}
                  totalCount={coach.reviews}
                  locale={locale}
                  labels={{
                    viewAll: t("viewAllReviews"),
                    close: t("close"),
                    allReviews: t("allReviews"),
                  }}
                />
              </section>

            </div>

            {/* RIGHT SIDE — booking panel sticky */}
            <div className="w-full lg:w-96 lg:max-w-96 lg:shrink-0">
              <div className="sticky top-28 rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-5 shadow-xl shadow-black/20 backdrop-blur-md">
                <BookingPanel coach={coach} locale={locale} />
              </div>
            </div>

          </div>
        </div>
      </main>
      <FooterCTA href="/coaches" />
      <Footer />
    </>
  )
}
