import { CoachCard } from "@/components/coach-card"
import { content } from "@/lib/content"

export function CoachesGrid() {
  return (
    <section id="coaches" className="relative px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          {content.coaches.title}
        </h2>
        <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {content.coaches.list.map((coach) => (
            <CoachCard key={coach.name} coach={coach} />
          ))}
        </div>
      </div>
    </section>
  )
}
