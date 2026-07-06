"use client"

import { useState } from "react"
import { Star, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import type { CoachReview } from "@/lib/coaches"

interface ReviewsPanelProps {
  reviews: CoachReview[]
  totalCount: number
  locale: string
  labels: {
    viewAll: string
    close: string
    allReviews: string
  }
}

function ReviewCard({ review, locale }: { review: CoachReview; locale: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
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
  )
}

export function ReviewsPanel({ reviews, totalCount, locale, labels }: ReviewsPanelProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Voir plus button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-white/60 transition-colors hover:border-teal-accent/30 hover:bg-teal-accent/5 hover:text-teal-accent active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
      >
        {labels.viewAll} ({totalCount})
      </button>

      {/* Full reviews panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Panel — slides up from bottom */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%", transition: { duration: 0.3, ease: "easeIn" } }}
              transition={{ type: "spring", stiffness: 380, damping: 40 }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-hidden rounded-t-3xl border border-blue-300/20 bg-blue-400/[8%] shadow-2xl backdrop-blur-md"
              style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="h-1 w-10 rounded-full bg-white/20" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-white/10">
                <h3 className="text-base font-semibold text-white">{labels.allReviews} ({totalCount})</h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex size-8 cursor-pointer items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white/50 transition-colors hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
                  aria-label={labels.close}
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>

              {/* Scrollable reviews list */}
              <div className="overflow-y-auto px-6 py-4" style={{ maxHeight: "calc(85vh - 100px)" }}>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} locale={locale} />
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}