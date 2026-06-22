import Image from "next/image"
import { getTranslations } from "next-intl/server"
import Link from "@/i18n/navigation"
import { coaches } from "@/lib/coaches"

interface Props {
  params: Promise<{ locale: string }>
}

interface MockBooking {
  id: string
  coach: (typeof coaches)[0]
  date: string
  status: "upcoming" | "completed"
}

function buildMockBookings(locale: string): MockBooking[] {
  const today = new Date()
  const fmt = (d: Date) =>
    d.toLocaleDateString(locale === "en" ? "en-GB" : "fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })

  const upcomingDate = new Date(today)
  upcomingDate.setDate(today.getDate() + 5)

  const pastDate = new Date(today)
  pastDate.setDate(today.getDate() - 10)

  const pastDate2 = new Date(today)
  pastDate2.setDate(today.getDate() - 25)

  return [
    {
      id: "b1",
      coach: coaches[0],
      date: fmt(upcomingDate),
      status: "upcoming",
    },
    {
      id: "b2",
      coach: coaches[1],
      date: fmt(pastDate),
      status: "completed",
    },
    {
      id: "b3",
      coach: coaches[2],
      date: fmt(pastDate2),
      status: "completed",
    },
  ]
}

export default async function ClientBookingsPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations("dashboardClient")

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
            <Image
              src={booking.coach.avatar || "/placeholder.svg"}
              alt={booking.coach.name}
              width={56}
              height={56}
              className="size-14 shrink-0 rounded-full object-cover ring-2 ring-white/10"
            />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-white">{booking.coach.name}</p>
              <p className="mt-0.5 text-sm text-white/50">{booking.date}</p>
              <p className="mt-1 text-xs text-white/30">
                {booking.coach.city}
              </p>
            </div>
            <span
              className={`self-start rounded-full border px-2.5 py-1 text-xs font-medium sm:self-auto ${
                booking.status === "upcoming"
                  ? "border-teal-accent/40 bg-teal-accent/10 text-teal-accent"
                  : "border-white/10 bg-white/5 text-white/30"
              }`}
            >
              {booking.status === "upcoming"
                ? t("bookingUpcoming")
                : t("bookingCompleted")}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
