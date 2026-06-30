import Image from "next/image"
import { MapPin, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageList } from "@/components/ui/language-list"
import type { Coach, LanguageCode } from "@/lib/coaches"
import * as Flags from "country-flag-icons/react/3x2"

interface CoachCardProps {
  coach: Coach
  translations: {
    badges: Record<string, string>
    reviewsSuffix: string
    priceUnit: string
    cardCta: string
    languagesTitle: string
    languages: Record<LanguageCode, string>
  }
}

export function CoachCard({ coach, translations: t }: CoachCardProps) {
  return (
    <article className="flex flex-col rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-6 shadow-xl shadow-black/20 backdrop-blur-md">
      {/* Top: avatar + info */}
      <div className="flex items-start gap-4 sm:gap-5">
        <Image
          src={coach.avatar || "/placeholder.svg"}
          alt={coach.name}
          width={112}
          height={112}
          sizes="112px"
          className="size-28 shrink-0 rounded-md object-cover ring-2 ring-white/10 sm:size-32"
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-white sm:text-xl">{coach.name}</h3>
          <div className="mt-1.5 flex w-fit flex-col gap-1">
            {coach.badgeKeys.slice(0, 2).map((badgeKey) => (
              <span
                key={badgeKey}
                className="inline-flex w-fit whitespace-nowrap rounded-full border border-teal-accent/30 bg-teal-accent/10 px-2 py-0.5 text-xs font-medium text-teal-accent-light"
              >
                {t.badges[badgeKey]}
              </span>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <Star className="size-5 shrink-0 fill-star-gold text-star-gold" />
            <span className="font-bold text-white">{coach.rating}</span>
            <span className="whitespace-nowrap text-text-secondary">
              ({coach.reviews} {t.reviewsSuffix})
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-white/40">{t.languagesTitle}</span>
            <LanguageList
              codes={coach.languages}
              labels={t.languages}
              size={18}
              showLabels={false}
              max={3}
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-5 h-px w-full bg-white/10" />

      {/* Location + price */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2">
          <MapPin className="size-5 shrink-0 text-teal-accent" aria-hidden="true" />
          <span className="flex items-center gap-1.5 text-sm text-white/50">
            {coach.city}
            {(() => {
              const F = (Flags as unknown as Record<string, React.ComponentType<{ style?: React.CSSProperties; className?: string }>>)[coach.country]
              return F ? (
                <span aria-hidden="true" className="ml-1">
                  <F style={{ width: 16, height: 11 }} className="rounded-sm opacity-70" />
                </span>
              ) : null
            })()}
          </span>
        </div>
        <div className="flex shrink-0 items-baseline whitespace-nowrap">
          <span className="text-2xl font-bold text-white">{coach.price}</span>
          <span className="ml-1 text-sm text-text-secondary">{t.priceUnit}</span>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-5">
<Button
        variant="primary"
        href={{ pathname: "/coaches/[id]", params: { id: coach.id } }}
        className="w-full"
      >
        {t.cardCta}
      </Button>
      </div>
    </article>
  )
}
