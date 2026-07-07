import { getLocale, getTranslations } from "next-intl/server"
import { Calendar, Star, Users, ChevronRight } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { StarRating } from "@/components/dashboard/star-rating"
import { WelcomeHeader } from "@/components/dashboard/welcome-header"
import { CoachPendingRequestsList, type PendingRequest } from "@/components/dashboard/coach-pending-requests"

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

function formatRelativeDay(locale: string, offsetDays: number): string {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toLocaleDateString(locale === "en" ? "en-GB" : "fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
}

const COACH_AVAILABILITY: { key: string; available: boolean }[] = [
  { key: "mon", available: true },
  { key: "tue", available: false },
  { key: "wed", available: true },
  { key: "thu", available: false },
  { key: "fri", available: true },
  { key: "sat", available: true },
  { key: "sun", available: false },
]

function buildPendingRequests(locale: string): PendingRequest[] {
  // Mock data — dates are computed relative to "today" so the dashboard
  // shows fresh-looking pending requests in the user's locale.
  // Client names and messages are intentionally French-only mock copy
  // and will be replaced when real data exists.
  const today = new Date()
  function fmt(offsetDays: number) {
    const d = new Date(today)
    d.setDate(today.getDate() + offsetDays)
    return d.toLocaleDateString(locale === "en" ? "en-GB" : "fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }
  return [
    {
      id: "r1",
      clientName: "Nicolas Petit",
      clientInitial: "N",
      date: fmt(5),
      time: "10:00",
      message: "Je souhaite progresser en brasse.",
    },
    {
      id: "r2",
      clientName: "Camille Dubois",
      clientInitial: "C",
      date: fmt(7),
      time: "16:30",
      message: "Bonjour, j'aimerais reprendre après une longue pause.",
    },
    {
      id: "r3",
      clientName: "Fatima Oussama",
      clientInitial: "F",
      date: fmt(6),
      time: "09:30",
      message: "Bonjour, j'ai un objectif triathlon cet été.",
    },
  ]
}

function buildUpcomingSessions(locale: string): UpcomingSession[] {
  return [
    {
      id: "s1",
      clientName: "Léa Fontaine",
      clientInitial: "L",
      date: formatRelativeDay(locale, 1),
      timeStart: "09:00",
      timeEnd: "10:00",
      type: "individual",
      status: "confirmed",
    },
    {
      id: "s2",
      clientName: "Thomas Renard",
      clientInitial: "T",
      date: formatRelativeDay(locale, 1),
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
      date: formatRelativeDay(locale, 2),
      timeStart: "10:00",
      timeEnd: "11:00",
      type: "individual",
      status: "pending",
    },
    {
      id: "s4",
      clientName: "Antoine Leroy",
      clientInitial: "A",
      date: formatRelativeDay(locale, 2),
      timeStart: "16:00",
      timeEnd: "17:00",
      type: "individual",
      status: "confirmed",
    },
    {
      id: "s5",
      clientName: "Julie Morel",
      clientInitial: "J",
      date: formatRelativeDay(locale, 2),
      timeStart: "17:30",
      timeEnd: "19:00",
      type: "group",
      groupSize: 2,
      status: "confirmed",
    },
  ]
}

// ---------- Page ----------

export default async function CoachDashboardPage({ params }: Props) {
  await params
  const activeLocale = await getLocale()
  const t = await getTranslations("dashboardCoach")
  const tDays = await getTranslations("onboarding.coach.availability")
  const pendingRequests = buildPendingRequests(activeLocale)
  const upcomingSessions = buildUpcomingSessions(activeLocale)
  const coachDays = COACH_AVAILABILITY.map((d) => ({
    key: d.key,
    label: tDays(d.key),
    available: d.available,
  }))

  return (
    <>
      {/* Desktop: outer glass card, margin + height matched to sidebar */}
      <div className="hidden h-full w-full flex-col rounded-3xl border border-blue-300/20 bg-blue-400/[8%] shadow-xl shadow-black/20 backdrop-blur-md lg:flex">

        {/* === Top of card: welcome header === */}
        <div className="shrink-0 border-b border-white/10 px-6 py-5">
          <WelcomeHeader namespace="dashboardCoach" />
        </div>

        {/* === Scrollable content area === */}
        <div className="flex-1 overflow-y-auto">

          {/* Stats row */}
          <div className="grid shrink-0 grid-cols-1 gap-10 border-b border-white/10 p-6 md:grid-cols-3 *:rounded-2xl">
            {/* Card 1: Sessions this month */}
            <div className="flex flex-col gap-3 rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-6 shadow-xl shadow-black/20 backdrop-blur-md">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-blue-accent/15">
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
            <div className="flex flex-col gap-3 rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-6 shadow-xl shadow-black/20 backdrop-blur-md">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-teal-accent/15">
                <Star className="size-5 text-teal-accent" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">4.8</p>
                <p className="mt-1 text-sm text-white/50">{t("statsRating", { rating: "4.8" })}</p>
              </div>
              <StarRating value={4.8} size={14} />
            </div>

            {/* Card 3: Active students */}
            <div className="flex flex-col gap-3 rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-6 shadow-xl shadow-black/20 backdrop-blur-md">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-teal-accent/15">
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

          {/* Two-column row */}
          <div className="grid shrink-0 grid-cols-1 gap-10 border-b border-white/10 p-6 md:grid-cols-2 *:rounded-2xl">
            {/* Left: Pending requests */}
            <div className="flex flex-col gap-4 rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-6 shadow-xl shadow-black/20 backdrop-blur-md">
              <h2 className="text-sm font-medium uppercase tracking-wider text-white/40">
                {t("pendingRequests")}
              </h2>
              <div className="flex flex-col gap-4">
                <CoachPendingRequestsList requests={pendingRequests} />
              </div>
            </div>

            {/* Right: My availability */}
            <div className="flex flex-col gap-4 rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-6 shadow-xl shadow-black/20 backdrop-blur-md">
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

          {/* Upcoming sessions table */}
          <div className="flex flex-col gap-4 p-6">
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
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-teal-accent/20 text-xs font-bold text-teal-accent">
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
                              ? t("sessionTypeGroup", { count: session.groupSize ?? 0 })
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
      </div>

      {/* Mobile: full-width page layout, normal scroll */}
      <div className="flex flex-col gap-8 p-6 lg:hidden">
        {/* Welcome */}
        <div className="shrink-0 border-b border-white/10 pb-5">
          <WelcomeHeader namespace="dashboardCoach" />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 *:rounded-2xl">
          <div className="flex flex-col gap-3 rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-6 shadow-xl shadow-black/20 backdrop-blur-md">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-blue-accent/15">
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
          <div className="flex flex-col gap-3 rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-6 shadow-xl shadow-black/20 backdrop-blur-md">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-teal-accent/15">
              <Star className="size-5 text-teal-accent" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">4.8</p>
              <p className="mt-1 text-sm text-white/50">{t("statsRating", { rating: "4.8" })}</p>
            </div>
            <StarRating value={4.8} size={14} />
          </div>
          <div className="flex flex-col gap-3 rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-6 shadow-xl shadow-black/20 backdrop-blur-md">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-teal-accent/15">
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

        {/* Two-column row */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 *:rounded-2xl">
          <div className="flex flex-col gap-4 rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-6 shadow-xl shadow-black/20 backdrop-blur-md">
            <h2 className="text-sm font-medium uppercase tracking-wider text-white/40">{t("pendingRequests")}</h2>
            <div className="flex flex-col gap-4">
              <CoachPendingRequestsList requests={pendingRequests} />
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-6 shadow-xl shadow-black/20 backdrop-blur-md">
            <h2 className="text-sm font-medium uppercase tracking-wider text-white/40">{t("myAvailability")}</h2>
            <div className="flex flex-wrap gap-2">
              {coachDays.map((day) => (
                <span key={day.key} className={`rounded-full px-3 py-1.5 text-xs font-medium ${day.available ? "border border-teal-accent/40 bg-teal-accent/10 text-teal-accent" : "border border-white/10 bg-white/5 text-white/30"}`}>
                  {day.label}
                </span>
              ))}
            </div>
            <Link href="/dashboard/coach/schedule" className="mt-auto flex items-center gap-1 text-xs text-teal-accent transition-colors hover:text-teal-accent-light">
              {t("availabilityManage")}<ChevronRight className="size-3" />
            </Link>
          </div>
        </div>

        {/* Upcoming sessions */}
        <div className="flex flex-col gap-4 rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-6 shadow-xl shadow-black/20 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase tracking-wider text-white/40">{t("upcomingSessions")}</h2>
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
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-teal-accent/20 text-xs font-bold text-teal-accent">{session.clientInitial}</div>
                          <span className="text-sm text-white">{session.clientName}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap py-4 pr-4 text-sm text-white/60">{session.date}</td>
                      <td className="whitespace-nowrap py-4 pr-4 text-sm text-white/60">{session.timeStart}–{session.timeEnd}</td>
                      <td className="py-4 pr-4">
                        <span className={`rounded-full border px-2 py-0.5 text-xs ${typeClass}`}>
                          {session.type === "group" ? t("sessionTypeGroup", { count: session.groupSize ?? 0 }) : t("sessionTypeIndividual")}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`rounded-full border px-2 py-0.5 text-xs ${statusClass}`}>{statusLabel}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

// ---------- end of page ----------
