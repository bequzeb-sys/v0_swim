import { memo } from "react"
import Image from "next/image"
import { MapPin, Star } from "lucide-react"
import * as Flags from "country-flag-icons/react/3x2"
import { Button } from "@/components/ui/button"
import { LanguageList } from "@/components/ui/language-list"
import type { Coach } from "@/lib/coaches"

interface CoachListingCardProps {
  coach: Coach
  t: {
    badges: Record<string, string>
    languages: Record<string, string>
    listingCta: string
    reviews: string
    priceUnit: string
    languagesTitle: string
  }
}

function CoachListingCardInner({ coach, t }: CoachListingCardProps) {
  return (
    <article className="flex flex-row items-stretch gap-5 rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-5 shadow-xl shadow-black/20 backdrop-blur-md">

      {/* Left — Avatar */}
      <div className="shrink-0">
        <div className="relative size-24 overflow-hidden rounded-2xl">
          <Image
            src={coach.avatar}
            alt={coach.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
      </div>

      {/* Right — Info */}
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">

        {/* Top — name + badges */}
        <div>
          <h3 className="truncate text-base font-bold text-white">
            {coach.name}
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1">
            {coach.badgeKeys.slice(0, 2).map((badgeKey, i) => (
              <span key={badgeKey} className="flex items-center gap-1.5">
                <span className="whitespace-nowrap rounded-full border border-teal-accent/30 bg-teal-accent/10 px-2 py-0.5 text-xs font-medium text-teal-accent-light">
                  {t.badges[badgeKey]}
                </span>
                {i < coach.badgeKeys.length - 1 && (
                  <span className="text-text-secondary">·</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Middle — rating then languages below */}
        <div className="flex flex-col gap-1.5">
          <span className="flex items-center gap-1 text-sm text-white/80">
            <Star className="size-3.5 fill-star-gold text-star-gold" aria-hidden="true" />
            <span className="font-semibold">{coach.rating}</span>
            <span className="text-white/40">({coach.reviews} {t.reviews})</span>
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40">{t.languagesTitle}</span>
            <LanguageList
              codes={coach.languages}
              labels={t.languages}
              size={16}
              showLabels={false}
              max={3}
            />
          </div>
        </div>

        {/* Bottom — location + price + CTA */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="flex items-center gap-1.5 text-xs text-white/50">
              <MapPin className="size-3 shrink-0" aria-hidden="true" />
              <span className="truncate">{coach.city}</span>
              {(() => {
                const F = (Flags as unknown as Record<string, React.ComponentType<{ style?: React.CSSProperties; className?: string }>>)[coach.country]
                return F ? (
                  <span aria-hidden="true">
                    <F style={{ width: 14, height: 10 }} className="rounded-sm opacity-70" />
                  </span>
                ) : null
              })()}
            </span>
            <span className="text-base font-bold text-white">
              {coach.price}
              <span className="text-xs font-normal text-white/50"> {t.priceUnit}</span>
            </span>
          </div>
          <Button
            variant="primary"
            href={{ pathname: "/coaches/[id]", params: { id: coach.id } }}
            className="shrink-0 px-4 py-2 text-sm"
          >
            {t.listingCta}
          </Button>
        </div>

      </div>
    </article>
  )
}

export const CoachListingCard = memo(CoachListingCardInner)