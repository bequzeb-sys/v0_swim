import { Waves } from "lucide-react"
import { content } from "@/lib/content"

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      {/* Subtle dark strip for nav contrast against the bright top of the photo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
        style={{
          background: "linear-gradient(180deg, rgba(5,11,26,0.45) 0%, rgba(5,11,26,0) 100%)",
        }}
      />
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-accent to-blue-accent-dark text-white shadow-lg shadow-blue-accent/30">
            <Waves className="size-5" strokeWidth={2.5} />
          </span>
          <span className="text-2xl font-extrabold tracking-tight text-white">
            {content.brand.swim}
            <span className="bg-gradient-to-r from-teal-accent-light to-blue-accent bg-clip-text text-transparent">
              {content.brand.ai}
            </span>
          </span>
        </a>

        {/* Center nav */}
        <ul className="hidden items-center gap-9 lg:flex">
          {content.nav.links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-[15px] font-medium text-white/80 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="#"
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-accent to-blue-accent-dark px-6 py-2.5 text-[15px] font-bold text-white shadow-lg shadow-blue-accent/30 transition-opacity hover:opacity-90"
        >
          {content.nav.cta}
        </a>
      </nav>
    </header>
  )
}
