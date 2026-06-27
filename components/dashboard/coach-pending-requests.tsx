"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Check, X } from "lucide-react"

export interface PendingRequest {
  id: string
  clientName: string
  clientInitial: string
  date: string
  time: string
  message: string
}

export type RequestStatus = "pending" | "accepted" | "declined"

interface PendingRequestRowProps {
  req: PendingRequest
  status: RequestStatus
  onAccept: (id: string) => void
  onDecline: (id: string) => void
}

function PendingRequestRow({ req, status, onAccept, onDecline }: PendingRequestRowProps) {
  const t = useTranslations("dashboardCoach")

  if (status === "accepted") {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-teal-accent/20 bg-teal-accent/5 p-5 opacity-60 sm:flex-row sm:items-start">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal-accent/15 text-sm font-bold text-teal-accent">
          {req.clientInitial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-white">{req.clientName}</p>
            <span className="text-xs text-white/50">
              {req.date} · {req.time}
            </span>
          </div>
          <p className="mt-1 text-xs text-white/50 italic">&ldquo;{req.message}&rdquo;</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-lg border border-teal-accent/40 bg-teal-accent/10 px-3 py-1.5 text-xs font-medium text-teal-accent">
          <Check className="size-3" />
          {t("bookingAccepted")}
        </div>
      </div>
    )
  }

  if (status === "declined") {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[2%] p-5 opacity-40 sm:flex-row sm:items-start">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-sm font-bold text-white/50">
          {req.clientInitial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-white/50">{req.clientName}</p>
            <span className="text-xs text-white/30">
              {req.date} · {req.time}
            </span>
          </div>
          <p className="mt-1 text-xs text-white/30 italic">&ldquo;{req.message}&rdquo;</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/40">
          <X className="size-3" />
          {t("bookingDeclined")}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 sm:flex-row sm:items-start">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-sm font-bold text-amber-400">
        {req.clientInitial}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-white">{req.clientName}</p>
          <span className="text-xs text-white/50">
            {req.date} · {req.time}
          </span>
        </div>
        <p className="mt-1 text-xs text-white/50 italic">&ldquo;{req.message}&rdquo;</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => onAccept(req.id)}
          className="flex items-center gap-1.5 rounded-lg border border-teal-accent/40 bg-teal-accent/10 px-3 py-1.5 text-xs font-medium text-teal-accent transition-colors hover:bg-teal-accent/20 active:scale-[0.97]"
        >
          <Check className="size-3" />
          {t("pendingAccept")}
        </button>
        <button
          type="button"
          onClick={() => onDecline(req.id)}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/50 transition-colors hover:border-white/20 hover:bg-white/10 active:scale-[0.97]"
        >
          <X className="size-3" />
          {t("pendingDecline")}
        </button>
      </div>
    </div>
  )
}

interface CoachPendingRequestsListProps {
  requests: PendingRequest[]
}

export function CoachPendingRequestsList({ requests: initial }: CoachPendingRequestsListProps) {
  const [statuses, setStatuses] = useState<Record<string, RequestStatus>>(
    Object.fromEntries(initial.map((r) => [r.id, "pending"]))
  )

  function handleAccept(id: string) {
    setStatuses((prev) => ({ ...prev, [id]: "accepted" }))
  }

  function handleDecline(id: string) {
    setStatuses((prev) => ({ ...prev, [id]: "declined" }))
  }

  return (
    <div className="flex flex-col gap-4">
      {initial.map((req) => (
        <PendingRequestRow
          key={req.id}
          req={req}
          status={statuses[req.id]}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      ))}
    </div>
  )
}
