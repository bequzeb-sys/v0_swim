import { getTranslations } from "next-intl/server"
import { GraduationCap, Calendar, Waves, Clock, MapPin, ChevronRight } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { ClientDashboardWelcome } from "@/components/dashboard/client-dashboard-welcome"
import { ProgressChart } from "@/components/dashboard/client-progress-chart"
import { StarRating } from "@/components/dashboard/star-rating"

interface Props {
  params: Promise<{ locale: string }>
}

// ---------- Mock data ----------

interface Booking {
  id: string
  coachName: string
  coachInitial: string
  date: string
  timeStart: string
  timeEnd: string
  specialty: string
  type: "individual" | "group"
  groupSize?: number
  status: "confirmed" | "pending"
}

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

function tomorrowLabel(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
}

function historyDates(): string[] {
  const dates: string[] = []
  for (let i = 1; i <= 5; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i * 3)
    dates.push(
      d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
    )
  }
  return dates
}

const bookings: Booking[] = [
  {
    id: "b1",
    coachName: "Marc Delorme",
    coachInitial: "M",
    date: tomorrowLabel(),
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
    date: tomorrowLabel(),
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
    date: tomorrowLabel(),
    timeStart: "17:00",
    timeEnd: "18:00",
    specialty: "Compétition · Individuel",
    type: "individual",
    status: "pending",
  },
]

const history: HistoryRow[] = (() => {
  const dates = historyDates()
  return [
    { id: "h1", coachName: "Marc Delorme", coachInitial: "M", date: dates[0], type: "individual", duration: 60, notes: "Bonne progression en crawl, à travailler sur la respiration bilatérale.", rating: 5.0 },
    { id: "h2", coachName: "Sophie Chen", coachInitial: "S", date: dates[1], type: "group", duration: 60, notes: "Séance en eau libre réussie, bonne endurance générale.", rating: 4.5 },
    { id: "h3", coachName: "Marc Delorme", coachInitial: "M", date: dates[2], type: "individual", duration: 60, notes: "Amélioration notable sur les virages. Travailler les appuis.", rating: 5.0 },
    { id: "h4", coachName: "Sophie Chen", coachInitial: "S", date: dates[3], type: "group", duration: 90, notes: "Premier triathlon en conditions réelles — séance d'avant-course.", rating: 4.5 },
    { id: "h5", coachName: "Marc Delorme", coachInitial: "M", date: dates[4], type: "individual", duration: 60, notes: "Technique de départ et coulée à améliorer.", rating: 4.0 },
  ]
})()

// ---------- Page ----------

export default async function ClientDashboardPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations("dashboardClient")

  return (
    <div className="flex flex-col gap-8 p-6 lg:p-8">

      {/* Welcome */}
      <ClientDashboardWelcome />

      {/* ========== Stats row ========== */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 *:rounded-2xl">

        {/* Card 1: Lessons completed */}
        <div className="flex flex-col gap-3 rounded-2xl border border-white/15 bg-white/[8%] p-6 backdrop-blur-md">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-teal-accent/15">
            <GraduationCap className="size-5 text-teal-accent" />
          </div>
          <div>
            <p className="text-3xl font-bold text-white">12</p>
            <p className="mt-1 text-sm text-white/50">{t("statsLessonsCompleted")}</p>
          </div>
          <p className="text-xs text-white/40">{t("statsLessonsEncouragement")}</p>
        </div>

        {/* Card 2: Next session */}
        <div className="flex flex-col gap-3 rounded-2xl border border-white/15 bg-white/[8%] p-6 backdrop-blur-md">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-blue-accent/15">
            <Calendar className="size-5 text-blue-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-white/70">{t("statsNextSession")}</p>
            <p className="mt-0.5 text-xl font-bold text-white">
              {t("statsNextSessionTomorrow", { time: "09:00" })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-teal-accent/20 text-xs font-bold text-teal-accent">
              M
            </div>
            <span className="text-xs text-white/50">
              {t("withCoach", { coach: "Marc Delorme" })}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["Freestyle", "Individuel"].map((badge) => (
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
        <div className="flex flex-col gap-3 rounded-2xl border border-white/15 bg-white/[8%] p-6 backdrop-blur-md">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-teal-accent/15">
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

      {/* ========== Two-column row ========== */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 *:rounded-2xl">

        {/* Left: Upcoming Bookings card */}
        <div className="flex flex-col gap-4 rounded-2xl border border-white/15 bg-white/[8%] p-6 backdrop-blur-md">
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
            {bookings.map((booking) => (
              <BookingRow key={booking.id} booking={booking} t={t} />
            ))}
          </div>
        </div>

        {/* Right: Progress chart */}
        <ProgressChart locale={locale} />

      </div>

      {/* ========== Session history ========== */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[4%] p-6 backdrop-blur-md">
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
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-teal-accent/20 text-xs font-bold text-teal-accent">
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
          <span className="flex cursor-pointer items-center gap-1.5 text-sm text-teal-accent">
            {t("viewFullHistory")}
            <ChevronRight className="size-4" />
          </span>
        </div>
      </div>

    </div>
  )
}

// ---------- BookingRow sub-component (server component) ----------

interface BookingRowProps {
  booking: Booking
  t: ReturnType<typeof useTranslations>
}

function BookingRow({ booking, t }: BookingRowProps) {
  const typeClass = booking.type === "group"
    ? "border-blue-accent/40 bg-blue-accent/10 text-blue-accent"
    : "border-teal-accent/40 bg-teal-accent/10 text-teal-accent"
  const typeLabel = booking.type === "group"
    ? t("sessionTypeGroup", { count: booking.groupSize })
    : t("sessionTypeIndividual")
  const statusClass = booking.status === "confirmed"
    ? "border-teal-accent/40 text-teal-accent"
    : "border-amber-500/40 text-amber-400"
  const statusLabel = booking.status === "confirmed"
    ? t("bookingConfirmed")
    : t("bookingPending")

  // Format date: "mardi 23 juin"
  const dateParts = booking.date.split(" ")

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[3%] p-5 backdrop-blur-sm sm:flex-row sm:items-center">
      {/* Avatar */}
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal-accent/20 text-sm font-bold text-teal-accent">
        {booking.coachInitial}
      </div>

      {/* Content row */}
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-2">
        {/* Name + type badge */}
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate text-sm font-medium text-white">{booking.coachName}</p>
          <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs ${typeClass}`}>
            {typeLabel}
          </span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-1.5 text-xs text-white/50">
          <Calendar className="size-3 shrink-0 text-white/30" />
          <span>{dateParts[0]} {parseInt(dateParts[1])} {dateParts[2]}</span>
        </div>

        {/* Time */}
        <div className="flex items-center gap-1.5 text-xs text-white/50">
          <Clock className="size-3 shrink-0 text-white/30" />
          <span>{booking.timeStart}–{booking.timeEnd}</span>
        </div>

        {/* Specialty */}
        <div className="flex items-center gap-1.5 text-xs text-white/40">
          <MapPin className="size-3 shrink-0 text-white/30" />
          <span>{booking.specialty}</span>
        </div>

        {/* Status badge */}
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs ${statusClass}`}>
          {statusLabel}
        </span>
      </div>

      {/* Cancel */}
      <span className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/50">
        {t("cancel")}
      </span>
    </div>
  )
}
