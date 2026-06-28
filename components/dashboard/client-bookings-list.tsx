"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Calendar, Clock, MapPin } from "lucide-react"

export interface Booking {
  id: string
  coachName: string
  coachInitial: string
  date: string
  timeStart: string
  timeEnd: string
  specialty: string
  type: "individual" | "group"
  groupSize?: number
  status: "confirmed" | "pending" | "cancelled"
}

interface BookingRowProps {
  booking: Booking
  onCancel: (id: string) => void
}

function BookingRow({ booking, onCancel }: BookingRowProps) {
  const t = useTranslations("dashboardClient")
  const isCancelled = booking.status === "cancelled"

  const typeClass = isCancelled
    ? "border-white/10 bg-white/[2%] text-white/40"
    : booking.type === "group"
      ? "border-blue-accent/40 bg-blue-accent/10 text-blue-accent"
      : "border-teal-accent/40 bg-teal-accent/10 text-teal-accent"
  const typeLabel = isCancelled
    ? booking.type === "group"
      ? t("sessionTypeGroup", { count: booking.groupSize ?? 0 })
      : t("sessionTypeIndividual")
    : booking.type === "group"
      ? t("sessionTypeGroup", { count: booking.groupSize ?? 0 })
      : t("sessionTypeIndividual")

  const statusClass =
    booking.status === "confirmed"
      ? "border-teal-accent/40 text-teal-accent"
      : booking.status === "pending"
        ? "border-amber-500/40 text-amber-400"
        : "border-white/10 text-white/40"
  const statusLabel =
    booking.status === "confirmed"
      ? t("bookingConfirmed")
      : booking.status === "pending"
        ? t("bookingPending")
        : t("bookingCancelled")

  const dateParts = booking.date.split(" ")

  return (
    <div className={`flex flex-col gap-4 rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-5 shadow-xl shadow-black/20 backdrop-blur-md sm:flex-row sm:items-center ${isCancelled ? "opacity-40" : ""}`}>
      <div className={`flex size-10 shrink-0 items-center justify-center rounded-md text-sm font-bold ${isCancelled ? "bg-white/5 text-white/40" : "bg-teal-accent/20 text-teal-accent"}`}>
        {booking.coachInitial}
      </div>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex min-w-0 items-center gap-2">
          <p className={`truncate text-sm font-medium ${isCancelled ? "text-white/50" : "text-white"}`}>
            {booking.coachName}
          </p>
          <span
            className={`shrink-0 rounded-full border px-2 py-0.5 text-xs ${typeClass}`}
          >
            {typeLabel}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-white/50">
          <Calendar className="size-3 shrink-0 text-white/30" />
          <span>
            {dateParts[0]} {parseInt(dateParts[1])} {dateParts[2]}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-white/50">
          <Clock className="size-3 shrink-0 text-white/30" />
          <span>
            {booking.timeStart}–{booking.timeEnd}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-white/40">
          <MapPin className="size-3 shrink-0 text-white/30" />
          <span>{booking.specialty}</span>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-xs ${statusClass}`}
        >
          {statusLabel}
        </span>
      </div>
      {!isCancelled && (
        <button
          type="button"
          onClick={() => onCancel(booking.id)}
          className="shrink-0 cursor-pointer rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/50 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60 active:scale-[0.97]"
        >
          {t("cancel")}
        </button>
      )}
    </div>
  )
}

interface ClientBookingsListProps {
  bookings: Booking[]
}

export function ClientBookingsList({ bookings: initial }: ClientBookingsListProps) {
  const t = useTranslations("dashboardClient")
  const [bookings, setBookings] = useState(initial)

  function handleCancel(id: string) {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: "cancelled" as const } : b
      )
    )
  }

  const active = bookings.filter((b) => b.status !== "cancelled")
  const cancelled = bookings.filter((b) => b.status === "cancelled")

  if (active.length === 0 && cancelled.length === 0) {
    return null
  }

  return (
    <>
      {active.map((booking) => (
        <BookingRow key={booking.id} booking={booking} onCancel={handleCancel} />
      ))}
      {cancelled.map((booking) => (
        <BookingRow
          key={booking.id}
          booking={booking}
          onCancel={handleCancel}
        />
      ))}
    </>
  )
}
