import { getTranslations } from "next-intl/server"

interface Props {
  params: Promise<{ locale: string }>
}

interface MockBooking {
  id: string
  clientName: string
  date: string
  status: "upcoming" | "completed" | "cancelled"
}

function buildMockBookings(locale: string): MockBooking[] {
  const today = new Date()
  const fmt = (d: Date) =>
    d.toLocaleDateString(locale === "en" ? "en-GB" : "fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })

  const d1 = new Date(today)
  d1.setDate(today.getDate() + 3)
  const d2 = new Date(today)
  d2.setDate(today.getDate() + 7)
  const d3 = new Date(today)
  d3.setDate(today.getDate() - 5)
  const d4 = new Date(today)
  d4.setDate(today.getDate() - 12)
  const d5 = new Date(today)
  d5.setDate(today.getDate() - 18)

  return [
    { id: "b1", clientName: "Léa Fontaine", date: fmt(d1), status: "upcoming" },
    { id: "b2", clientName: "Thomas Leroy", date: fmt(d2), status: "upcoming" },
    { id: "b3", clientName: "Sophie Martin", date: fmt(d3), status: "completed" },
    { id: "b4", clientName: "Marc Dupont", date: fmt(d4), status: "completed" },
    { id: "b5", clientName: "Emma Bernard", date: fmt(d5), status: "cancelled" },
  ]
}

const STATUS_STYLES = {
  upcoming: "border-teal-accent/40 bg-teal-accent/10 text-teal-accent",
  completed: "border-white/10 bg-white/5 text-white/30",
  cancelled: "border-red-500/30 bg-red-500/10 text-red-400",
}

export default async function CoachBookingsPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations("dashboardCoach")

  const bookings = buildMockBookings(locale)

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-white lg:text-3xl">
        {t("bookingsTitle")}
      </h1>

      <div className="flex flex-col gap-3">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[4%] p-4 backdrop-blur-md sm:flex-row sm:items-center"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-white/10 text-sm font-bold text-white/60">
              {booking.clientName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-white">{booking.clientName}</p>
              <p className="mt-0.5 text-sm text-white/50">{booking.date}</p>
            </div>
            <span
              className={`self-start rounded-full border px-3 py-1 text-xs font-medium sm:self-auto ${
                STATUS_STYLES[booking.status]
              }`}
            >
              {t(`booking${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}`)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
