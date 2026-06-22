import Image from "next/image"
import { MapPin, Star } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import type { Coach } from "@/lib/coaches"

interface CoachCardProps {
  coach: Coach
  translations: {
    badges: Record<string, string>
    reviewsSuffix: string
    priceUnit: string
    cardCta: string
  }
}

export function CoachCard({ coach, translations: t }: CoachCardProps) {
  return (
    <article className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
      {/* Top: avatar + info */}
      <div className="flex items-start gap-4 sm:gap-5">
        <Image
          src={coach.avatar || "/placeholder.svg"}
          alt={coach.name}
          width={96}
          height={96}
          className="size-20 shrink-0 rounded-full object-cover ring-2 ring-white/10 sm:size-24"
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-white sm:text-xl">{coach.name}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1">
            {coach.badgeKeys.map((badgeKey, i) => (
              <span key={badgeKey} className="flex items-center gap-1.5">
                <span className="whitespace-nowrap rounded-full border border-teal-accent/30 bg-teal-accent/10 px-2.5 py-1 text-xs font-medium text-teal-accent-light sm:px-3 sm:text-sm">
                  {t.badges[badgeKey]}
                </span>
                {i < coach.badgeKeys.length - 1 && (
                  <span className="text-text-secondary">·</span>
                )}
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
        </div>
      </div>

      {/* Divider */}
      <div className="my-5 h-px w-full bg-white/10" />

      {/* Location + price */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2">
          <MapPin className="size-5 shrink-0 text-teal-accent" />
          <span className="truncate text-lg text-white">{coach.city}</span>
        </div>
        <div className="flex shrink-0 items-baseline whitespace-nowrap">
          <span className="text-2xl font-bold text-white">{coach.price}</span>
          <span className="ml-1 text-sm text-text-secondary">{t.priceUnit}</span>
        </div>
      </div>

      {/* CTA */}
      <Link href={`/coaches/${coach.id}`} className="mt-5 block w-full">
        <Button className="w-full rounded-xl bg-teal-accent py-6 text-base font-bold text-primary-foreground hover:bg-teal-accent-light">
          {t.cardCta}
        </Button>
      </Link>
    </article>
  )
}
