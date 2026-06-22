import { getTranslations } from "next-intl/server"
import { CoachCard } from "@/components/coach-card"
import { coaches } from "@/lib/coaches"

export async function CoachesGrid() {
  const t = await getTranslations("coaches")
  const badgeKeys = t.raw("badges") as Record<string, string>

  return (
    <section id="coaches" className="relative px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          {t("title")}
        </h2>
        <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {coaches.map((coach) => (
            <CoachCard
              key={coach.id}
              coach={coach}
              translations={{
                badges: badgeKeys,
                reviewsSuffix: t("reviewsSuffix"),
                priceUnit: t("priceUnit"),
                cardCta: t("cardCta"),
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
