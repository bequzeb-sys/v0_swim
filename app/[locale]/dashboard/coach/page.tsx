import { getTranslations } from "next-intl/server"
import { Calendar, Star, Users, Check, X, ChevronRight } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { CoachDashboardWelcome } from "@/components/dashboard/coach-dashboard-welcome"
import { StarRating } from "@/components/dashboard/star-rating"

interface Props {
  params: Promise<{ locale: string }>
}

// ---------- Mock data ----------

interface UpcomingSession {
  id: string
  clientName: string
  clientInitial: string
  date: string
  timeStart: string
  timeEnd: string
  type: "individual" | "group"
  groupSize?: number
  status: "confirmed" | "pending"
}

interface PendingRequest {
  id: string
  clientName: string
  clientInitial: string
  date: string
  time: string
  message: string
}

function tomorrowLabel(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
}

function dayAfterLabel(): string {
  const d = new Date()
  d.setDate(d.getDate() + 2)
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
}

const pendingRequests: PendingRequest[] = [
  {
    id: "r1",
    clientName: "Nicolas Petit",
    clientInitial: "N",
    date: "Mercredi 2 juillet 2026",
    time: "10:00",
    message: "Je souhaite progresser en brasse.",
  },
  {
    id: "r2",
    clientName: "Camille Dubois",
    clientInitial: "C",
    date: "Vendredi 4 juillet 2026",
    time: "16:30",
    message: "Bonjour, j'aimerais reprendre après une longue pause.",
  },
  {
    id: "r3",
    clientName: "Fatima Oussama",
    clientInitial: "F",
    date: "Jeudi 3 juillet 2026",
    time: "09:30",
    message: "Bonjour, j'ai un objectif triathlon cet été.",
  },
]

const upcomingSessions: UpcomingSession[] = [
  {
    id: "s1",
    clientName: "Léa Fontaine",
    clientInitial: "L",
    date: tomorrowLabel(),
    timeStart: "09:00",
    timeEnd: "10:00",
    type: "individual",
    status: "confirmed",
  },
  {
    id: "s2",
    clientName: "Thomas Renard",
    clientInitial: "T",
    date: tomorrowLabel(),
    timeStart: "14:00",
    timeEnd: "15:30",
    type: "group",
    groupSize: 3,
    status: "confirmed",
  },
  {
    id: "s3",
    clientName: "Sophie Martin",
    clientInitial: "S",
    date: dayAfterLabel(),
    timeStart: "10:00",
    timeEnd: "11:00",
    type: "individual",
    status: "pending",
  },
  {
    id: "s4",
    clientName: "Antoine Leroy",
    clientInitial: "A",
    date: dayAfterLabel(),
    timeStart: "16:00",
    timeEnd: "17:00",
    type: "individual",
    status: "confirmed",
  },
  {
    id: "s5",
    clientName: "Julie Morel",
    clientInitial: "J",
    date: dayAfterLabel(),
    timeStart: "17:30",
    timeEnd: "19:00",
    type: "group",
    groupSize: 2,
    status: "confirmed",
  },
]

// Coach availability (Marc Delorme's days)
const coachDays: { key: string; label: string; available: boolean }[] = [
  { key: "mon", label: "Lun", available: true },
  { key: "tue", label: "Mar", available: false },
  { key: "wed", label: "Mer", available: true },
  { key: "thu", label: "Jeu", available: false },
  { key: "fri", label: "Ven", available: true },
  { key: "sat", label: "Sam", available: true },
  { key: "sun", label: "Dim", available: false },
]

// ---------- Page ----------

export default async function CoachDashboardPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations("dashboardCoach")

  return (
    <div className="flex flex-col gap-8 p-6 lg:p-8">

      {/* Welcome */}
      <CoachDashboardWelcome />

      {/* ========== Stats row ========== */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 *:rounded-2xl">

        {/* Card 1: Sessions this month */}
        <div className="flex flex-col gap-3 rounded-2xl border border-white/15 bg-white/[8%] p-6 backdrop-blur-md">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-blue-accent/15">
            <Calendar className="size-5 text-blue-accent" />
          </div>
          <div>
            <p className="text-3xl font-bold text-white">12</p>
            <p className="mt-1 text-sm text-white/50">{t("statsSessions", { count: 12 })}</p>
          </div>
          <p className="flex items-center gap-1 text-xs text-teal-accent">
            <svg viewBox="0 0 12 12" fill="none" className="size-3 shrink-0" aria-hidden="true">
              <path d="M6 10V2M6 2L2 6M6 2l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            +2 {t("statsSessionsTrend")}
          </p>
        </div>

        {/* Card 2: Average rating */}
        <div className="flex flex-col gap-3 rounded-2xl border border-white/15 bg-white/[8%] p-6 backdrop-blur-md">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-teal-accent/15">
            <Star className="size-5 text-teal-accent" />
          </div>
          <div>
            <p className="text-3xl font-bold text-white">4.8</p>
            <p className="mt-1 text-sm text-white/50">{t("statsRating", { rating: "4.8" })}</p>
          </div>
          <StarRating value={4.8} size={14} />
        </div>

        {/* Card 3: Active students */}
        <div className="flex flex-col gap-3 rounded-2xl border border-white/15 bg-white/[8%] p-6 backdrop-blur-md">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-teal-accent/15">
            <Users className="size-5 text-teal-accent" />
          </div>
          <div>
            <p className="text-3xl font-bold text-white">8</p>
            <p className="mt-1 text-sm text-white/50">{t("statsStudents", { count: 8 })}</p>
          </div>
          <p className="flex items-center gap-1 text-xs text-teal-accent">
            <svg viewBox="0 0 12 12" fill="none" className="size-3 shrink-0" aria-hidden="true">
              <path d="M6 10V2M6 2L2 6M6 2l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            +1 {t("statsNewThisWeek")}
          </p>
        </div>

      </div>

      {/* ========== Two-column row ========== */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 *:rounded-2xl">

        {/* Left: Pending requests */}
        <div className="flex flex-col gap-4 rounded-2xl border border-white/15 bg-white/[8%] p-6 backdrop-blur-md">
          <h2 className="text-sm font-medium uppercase tracking-wider text-white/40">
            {t("pendingRequests")}
          </h2>
          <div className="flex flex-col gap-4">
            {pendingRequests.map((req) => (
              <PendingRequestRow key={req.id} req={req} t={t} />
            ))}
          </div>
        </div>

        {/* Right: My availability */}
        <div className="flex flex-col gap-4 rounded-2xl border border-white/15 bg-white/[8%] p-6 backdrop-blur-md">
          <h2 className="text-sm font-medium uppercase tracking-wider text-white/40">
            {t("myAvailability")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {coachDays.map((day) => (
              <span
                key={day.key}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  day.available
                    ? "border border-teal-accent/40 bg-teal-accent/10 text-teal-accent"
                    : "border border-white/10 bg-white/5 text-white/30"
                }`}
              >
                {day.label}
              </span>
            ))}
          </div>
          <Link
            href="/dashboard/coach/schedule"
            className="mt-auto flex items-center gap-1 text-xs text-teal-accent transition-colors hover:text-teal-accent-light"
          >
            {t("availabilityManage")}
            <ChevronRight className="size-3" />
          </Link>
        </div>

      </div>

      {/* ========== Upcoming sessions ========== */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[4%] p-6 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wider text-white/40">
            {t("upcomingSessions")}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="pb-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-white/40">{t("colClient")}</th>
                <th className="pb-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-white/40">{t("colDate")}</th>
                <th className="pb-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-white/40">{t("colTime")}</th>
                <th className="pb-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-white/40">{t("colType")}</th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-white/40">{t("colStatus")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {upcomingSessions.map((session) => {
                const typeClass = session.type === "group"
                  ? "border-blue-accent/40 bg-blue-accent/10 text-blue-accent"
                  : "border-teal-accent/40 bg-teal-accent/10 text-teal-accent"
                const statusClass = session.status === "confirmed"
                  ? "border-teal-accent/40 text-teal-accent"
                  : "border-amber-500/40 text-amber-400"
                const statusLabel = session.status === "confirmed"
                  ? t("bookingConfirmed")
                  : t("bookingPending")

                return (
                  <tr key={session.id} className="transition-colors hover:bg-white/[2%]">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-teal-accent/20 text-xs font-bold text-teal-accent">
                          {session.clientInitial}
                        </div>
                        <span className="text-sm text-white">{session.clientName}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap py-4 pr-4 text-sm text-white/60">{session.date}</td>
                    <td className="whitespace-nowrap py-4 pr-4 text-sm text-white/60">
                      {session.timeStart}–{session.timeEnd}
                    </td>
                    <td className="py-4 pr-4">
                      <span className={`rounded-full border px-2 py-0.5 text-xs ${typeClass}`}>
                        {session.type === "group"
                          ? t("sessionTypeGroup", { count: session.groupSize })
                          : t("sessionTypeIndividual")}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`rounded-full border px-2 py-0.5 text-xs ${statusClass}`}>
                        {statusLabel}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

// ---------- PendingRequestRow sub-component ----------

interface PendingRequestRowProps {
  req: PendingRequest
  t: ReturnType<typeof useTranslations>
}

function PendingRequestRow({ req, t }: PendingRequestRowProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 sm:flex-row sm:items-start">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-sm font-bold text-amber-400">
        {req.clientInitial}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-white">{req.clientName}</p>
          <span className="text-xs text-white/50">{req.date} · {req.time}</span>
        </div>
        <p className="mt-1 text-xs text-white/50 italic">&ldquo;{req.message}&rdquo;</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <span className="flex items-center gap-1.5 rounded-lg border border-teal-accent/40 bg-teal-accent/10 px-3 py-1.5 text-xs font-medium text-teal-accent">
          <Check className="size-3" />
          {t("pendingAccept")}
        </span>
        <span className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/50">
          <X className="size-3" />
          {t("pendingDecline")}
        </span>
      </div>
    </div>
  )
}
