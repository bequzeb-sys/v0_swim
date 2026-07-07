"use client"

import { useState } from "react"
import { Star, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import type { CoachReview } from "@/lib/coaches"

interface ReviewsSectionProps {
  reviews: CoachReview[]
  totalCount: number
  locale: string
  labels: {
    reviewsTitle: string
    viewAllReviews: string
    close: string
  }
}

function ReviewCard({ review, locale }: { review: CoachReview; locale: string }) {
  return (
    <div className="rounded-2xl border border-blue-300/20 bg-blue-400/[8%] p-4">
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

export function ReviewsSection({ reviews, totalCount, locale, labels }: ReviewsSectionProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <section className="rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-6 shadow-xl shadow-black/20 backdrop-blur-md">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold text-white">
          <Star className="size-4 text-teal-accent" aria-hidden="true" />
          {labels.reviewsTitle} ({totalCount})
        </h2>
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className={cn(
            "inline-flex size-8 cursor-pointer items-center justify-center rounded-xl border border-blue-300/20 bg-blue-400/[8%] text-white/50 transition-all hover:border-teal-accent/30 hover:bg-teal-accent/10 hover:text-teal-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
            expanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
          aria-label={labels.close}
          aria-hidden={!expanded}
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>

      {/* Reviews grid — first 3 always visible */}
      {/* First 3 reviews — always visible */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.slice(0, 3).map((review) => (
          <ReviewCard key={review.id} review={review} locale={locale} />
        ))}
      </div>

      {/* Expanded reviews — smooth animation, all reviews scroll together */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.slice(3, 10).map((review) => (
                <ReviewCard key={review.id} review={review} locale={locale} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-white/60 transition-colors hover:border-teal-accent/30 hover:bg-teal-accent/5 hover:text-teal-accent active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
      >
        {expanded ? labels.close : `${labels.viewAllReviews} (${totalCount})`}
      </button>
    </section>
  )
}
