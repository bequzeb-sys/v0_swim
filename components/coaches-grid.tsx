import { CoachCard } from "@/components/coach-card"
import { coaches } from "@/lib/coaches"
import { useTranslations } from "next-intl"

export function CoachesGrid() {
  const t = useTranslations("coaches")

  return (
    <section id="coaches" className="relative px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          {t("title")}
        </h2>
        <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {coaches.map((coach) => (
            <CoachCard key={coach.name} coach={coach} />
          ))}
        </div>
      </div>
    </section>
  )
}
