import { getLocale, getTranslations } from "next-intl/server"
import { GraduationCap, Calendar, Waves, ChevronRight } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { ProgressChart } from "@/components/dashboard/client-progress-chart"
import { StarRating } from "@/components/dashboard/star-rating"
import { WelcomeHeader } from "@/components/dashboard/welcome-header"
import { ClientBookingsList, type Booking } from "@/components/dashboard/client-bookings-list"

interface Props {
  params: Promise<{ locale: string }>
}

// ---------- Mock data ----------

interface HistoryRow {
  id: string
  coachName: string
  coachInitial: string
  date: string
  type: "individual" | "group"
  duration: number
  notes: string
  rating: number
}

function tomorrowLabel(locale: string): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toLocaleDateString(locale === "en" ? "en-GB" : "fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
}

function historyDates(locale: string): string[] {
  const dates: string[] = []
  for (let i = 1; i <= 5; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i * 3)
    dates.push(
      d.toLocaleDateString(locale === "en" ? "en-GB" : "fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    )
  }
  return dates
}

function buildBookings(locale: string): Booking[] {
  return [
    {
      id: "b1",
      coachName: "Marc Delorme",
      coachInitial: "M",
      date: tomorrowLabel(locale),
      timeStart: "09:00",
      timeEnd: "10:00",
      specialty: "Freestyle · Individuel",
      type: "individual",
      status: "confirmed",
    },
    {
      id: "b2",
      coachName: "Sophie Chen",
      coachInitial: "S",
      date: tomorrowLabel(locale),
      timeStart: "14:00",
      timeEnd: "15:30",
      specialty: "Eau libre · Groupe (2-4)",
      type: "group",
      groupSize: 2,
      status: "confirmed",
    },
    {
      id: "b3",
      coachName: "Marc Delorme",
      coachInitial: "M",
      date: tomorrowLabel(locale),
      timeStart: "17:00",
      timeEnd: "18:00",
      specialty: "Compétition · Individuel",
      type: "individual",
      status: "pending",
    },
  ]
}

function buildHistory(locale: string): HistoryRow[] {
  const dates = historyDates(locale)
  return [
    { id: "h1", coachName: "Marc Delorme", coachInitial: "M", date: dates[0], type: "individual", duration: 60, notes: "Bonne progression en crawl, à travailler sur la respiration bilatérale.", rating: 5.0 },
    { id: "h2", coachName: "Sophie Chen", coachInitial: "S", date: dates[1], type: "group", duration: 60, notes: "Séance en eau libre réussie, bonne endurance générale.", rating: 4.5 },
    { id: "h3", coachName: "Marc Delorme", coachInitial: "M", date: dates[2], type: "individual", duration: 60, notes: "Amélioration notable sur les virages. Travailler les appuis.", rating: 5.0 },
    { id: "h4", coachName: "Sophie Chen", coachInitial: "S", date: dates[3], type: "group", duration: 90, notes: "Premier triathlon en conditions réelles — séance d'avant-course.", rating: 4.5 },
    { id: "h5", coachName: "Marc Delorme", coachInitial: "M", date: dates[4], type: "individual", duration: 60, notes: "Technique de départ et coulée à améliorer.", rating: 4.0 },
  ]
}

// ---------- Page ----------

export default async function ClientDashboardPage({ params }: Props) {
  await params
  const activeLocale = await getLocale()
  const t = await getTranslations("dashboardClient")
  const tBadges = await getTranslations("coaches.badges")
  const bookings = buildBookings(activeLocale)
  const history = buildHistory(activeLocale)

  return (
    <>
      {/* Desktop: the outer glass card is rendered by the shell layout wrapper (margin + height match sidebar) */}
      <div className="hidden h-full w-full flex-col rounded-3xl border border-blue-300/20 bg-blue-400/[8%] shadow-xl shadow-black/20 backdrop-blur-md lg:flex">

        {/* === Top of card: welcome header === */}
        <div className="shrink-0 border-b border-white/10 px-6 py-5">
          <WelcomeHeader namespace="dashboardClient" />
        </div>

        {/* === Scrollable content area === */}
        <div className="flex-1 overflow-y-auto">

          {/* Stats row */}
          <div className="grid shrink-0 grid-cols-1 gap-10 border-b border-white/10 p-6 md:grid-cols-3 *:rounded-2xl">
            {/* Card 1: Lessons completed */}
            <div className="flex flex-col gap-3 rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-6 shadow-xl shadow-black/20 backdrop-blur-md">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-teal-accent/15">
                <GraduationCap className="size-5 text-teal-accent" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">12</p>
                <p className="mt-1 text-sm text-white/50">{t("statsLessonsCompleted")}</p>
              </div>
              <p className="text-xs text-white/40">{t("statsLessonsEncouragement")}</p>
            </div>

            {/* Card 2: Next session */}
            <div className="flex flex-col gap-3 rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-6 shadow-xl shadow-black/20 backdrop-blur-md">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-blue-accent/15">
                <Calendar className="size-5 text-blue-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/70">{t("statsNextSession")}</p>
                <p className="mt-0.5 text-xl font-bold text-white">
                  {t("statsNextSessionTomorrow", { time: "09:00" })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-teal-accent/20 text-xs font-bold text-teal-accent">
                  M
                </div>
                <span className="text-xs text-white/50">
                  {t("withCoach", { coach: "Marc Delorme" })}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[tBadges("freestyle"), t("sessionTypeIndividual")].map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-teal-accent/30 bg-teal-accent/10 px-2 py-0.5 text-xs text-teal-accent"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Card 3: Total distance */}
            <div className="flex flex-col gap-3 rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-6 shadow-xl shadow-black/20 backdrop-blur-md">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-teal-accent/15">
                <Waves className="size-5 text-teal-accent" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">24 km</p>
                <p className="mt-1 text-sm text-white/50">{t("statsTotalDistance")}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-teal-accent">
                <svg viewBox="0 0 12 12" fill="none" className="size-3 shrink-0" aria-hidden="true">
                  <path d="M6 10V2M6 2L2 6M6 2l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>+3,2 km {t("statsDistanceTrend")}</span>
              </div>
            </div>
          </div>

          {/* Two-column row */}
          <div className="grid shrink-0 grid-cols-1 gap-10 border-b border-white/10 p-6 md:grid-cols-2 *:rounded-2xl">

            {/* Left: Upcoming Bookings card */}
            <div className="flex flex-col gap-4 rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-6 shadow-xl shadow-black/20 backdrop-blur-md">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium uppercase tracking-wider text-white/40">
                  {t("upcomingBookings")}
                </h2>
                <Link
                  href="/dashboard/client/bookings"
                  className="flex items-center gap-1 text-xs text-teal-accent transition-colors hover:text-teal-accent-light"
                >
                  {t("viewAll")}
                  <ChevronRight className="size-3" />
                </Link>
              </div>

              {/* Booking rows */}
              <div className="flex flex-col gap-4">
                <ClientBookingsList bookings={bookings} />
              </div>
            </div>

            {/* Right: Progress chart */}
            <ProgressChart locale={activeLocale} />
          </div>

          {/* Session history table */}
          <div className="flex flex-col gap-4 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium uppercase tracking-wider text-white/40">
                {t("sessionHistory")}
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="pb-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-white/40">{t("colCoach")}</th>
                    <th className="pb-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-white/40">{t("colDate")}</th>
                    <th className="pb-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-white/40">{t("colType")}</th>
                    <th className="pb-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-white/40">{t("colDuration")}</th>
                    <th className="hidden pb-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-white/40 sm:table-cell">{t("colNotes")}</th>
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-white/40">{t("colRating")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {history.map((row) => (
                    <tr key={row.id} className="transition-colors hover:bg-white/[2%]">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-teal-accent/20 text-xs font-bold text-teal-accent">
                            {row.coachInitial}
                          </div>
                          <span className="text-sm text-white">{row.coachName}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap py-4 pr-4 text-sm text-white/60">{row.date}</td>
                      <td className="py-4 pr-4">
                        <span className={`rounded-full border px-2 py-0.5 text-xs ${row.type === "group" ? "border-blue-accent/40 bg-blue-accent/10 text-blue-accent" : "border-teal-accent/40 bg-teal-accent/10 text-teal-accent"}`}>
                          {row.type === "group" ? t("sessionTypeGroup", { count: 3 }) : t("sessionTypeIndividual")}
                        </span>
                      </td>
                      <td className="whitespace-nowrap py-4 pr-4 text-sm text-white/60">{t("durationMin", { min: row.duration })}</td>
                      <td className="hidden max-w-xs py-4 pr-4 text-xs text-white/40 sm:table-cell">
                        <span className="line-clamp-2">{row.notes}</span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <StarRating value={row.rating} size={12} />
                          <span className="text-xs text-white/60">{row.rating.toFixed(1)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 flex justify-center">
              <Link
                href="/dashboard/client/bookings"
                className="flex items-center gap-1.5 text-sm text-teal-accent"
              >
                {t("viewFullHistory")}
                <ChevronRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: full-width page layout, normal scroll */}
      <div className="flex flex-col gap-8 p-6 lg:hidden">
        {/* Welcome */}
        <div className="shrink-0 border-b border-white/10 pb-5">
          <WelcomeHeader namespace="dashboardClient" />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 *:rounded-2xl">
          <div className="flex flex-col gap-3 rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-6 shadow-xl shadow-black/20 backdrop-blur-md">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-teal-accent/15">
              <GraduationCap className="size-5 text-teal-accent" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">12</p>
              <p className="mt-1 text-sm text-white/50">{t("statsLessonsCompleted")}</p>
            </div>
            <p className="text-xs text-white/40">{t("statsLessonsEncouragement")}</p>
          </div>
          <div className="flex flex-col gap-3 rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-6 shadow-xl shadow-black/20 backdrop-blur-md">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-blue-accent/15">
              <Calendar className="size-5 text-blue-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/70">{t("statsNextSession")}</p>
              <p className="mt-0.5 text-xl font-bold text-white">
                {t("statsNextSessionTomorrow", { time: "09:00" })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-teal-accent/20 text-xs font-bold text-teal-accent">M</div>
              <span className="text-xs text-white/50">{t("withCoach", { coach: "Marc Delorme" })}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[tBadges("freestyle"), t("sessionTypeIndividual")].map((badge) => (
                <span key={badge} className="rounded-full border border-teal-accent/30 bg-teal-accent/10 px-2 py-0.5 text-xs text-teal-accent">{badge}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-6 shadow-xl shadow-black/20 backdrop-blur-md">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-teal-accent/15">
              <Waves className="size-5 text-teal-accent" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">24 km</p>
              <p className="mt-1 text-sm text-white/50">{t("statsTotalDistance")}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-teal-accent">
              <svg viewBox="0 0 12 12" fill="none" className="size-3 shrink-0" aria-hidden="true">
                <path d="M6 10V2M6 2L2 6M6 2l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>+3,2 km {t("statsDistanceTrend")}</span>
            </div>
          </div>
        </div>

        {/* Two-column row */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 *:rounded-2xl">
          <div className="flex flex-col gap-4 rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-6 shadow-xl shadow-black/20 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium uppercase tracking-wider text-white/40">{t("upcomingBookings")}</h2>
              <Link href="/dashboard/client/bookings" className="flex items-center gap-1 text-xs text-teal-accent transition-colors hover:text-teal-accent-light">
                {t("viewAll")}<ChevronRight className="size-3" />
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              <ClientBookingsList bookings={bookings} />
            </div>
          </div>
          <ProgressChart locale={activeLocale} />
        </div>

        {/* Session history */}
        <div className="flex flex-col gap-4 rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-6 shadow-xl shadow-black/20 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase tracking-wider text-white/40">{t("sessionHistory")}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-white/40">{t("colCoach")}</th>
                  <th className="pb-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-white/40">{t("colDate")}</th>
                  <th className="pb-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-white/40">{t("colType")}</th>
                  <th className="pb-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-white/40">{t("colDuration")}</th>
                  <th className="hidden pb-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-white/40 sm:table-cell">{t("colNotes")}</th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-white/40">{t("colRating")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {history.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-white/[2%]">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-teal-accent/20 text-xs font-bold text-teal-accent">{row.coachInitial}</div>
                        <span className="text-sm text-white">{row.coachName}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap py-4 pr-4 text-sm text-white/60">{row.date}</td>
                    <td className="py-4 pr-4">
                      <span className={`rounded-full border px-2 py-0.5 text-xs ${row.type === "group" ? "border-blue-accent/40 bg-blue-accent/10 text-blue-accent" : "border-teal-accent/40 bg-teal-accent/10 text-teal-accent"}`}>
                        {row.type === "group" ? t("sessionTypeGroup", { count: 3 }) : t("sessionTypeIndividual")}
                      </span>
                    </td>
                    <td className="whitespace-nowrap py-4 pr-4 text-sm text-white/60">{t("durationMin", { min: row.duration })}</td>
                    <td className="hidden max-w-xs py-4 pr-4 text-xs text-white/40 sm:table-cell"><span className="line-clamp-2">{row.notes}</span></td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <StarRating value={row.rating} size={12} />
                        <span className="text-xs text-white/60">{row.rating.toFixed(1)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex justify-center">
            <Link
              href="/dashboard/client/bookings"
              className="flex items-center gap-1.5 text-sm text-teal-accent"
            >
              {t("viewFullHistory")}<ChevronRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

// ---------- end of page ----------
