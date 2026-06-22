import { MessageCircle, ChevronRight } from "lucide-react"
import { content } from "@/lib/content"

export function FooterCTA() {
  const c = content.footer

  return (
    <section className="relative px-6 pb-12 pt-4">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-6 backdrop-blur-md sm:flex-row sm:items-center sm:px-7">
        <div className="flex items-start gap-4 sm:items-center">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-teal-accent/15 text-teal-accent shadow-lg shadow-teal-accent/20">
            <MessageCircle className="size-6" />
          </span>
          <p className="text-base text-white sm:text-lg">{c.text}</p>
        </div>
        <a
          href="#"
          className="flex shrink-0 items-center gap-1 text-lg font-bold text-teal-accent transition-colors hover:text-teal-accent-light"
        >
          {c.cta}
          <ChevronRight className="size-5" />
        </a>
      </div>
    </section>
  )
}
