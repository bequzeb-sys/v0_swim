import type { ReactNode } from "react"

interface OnboardingShellProps {
  children: ReactNode
  current: number
  total: number
}

export function OnboardingShell({
  children,
  current,
  total,
}: OnboardingShellProps) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-top bg-no-repeat"
          style={{ backgroundImage: "url('/underwater-hero.webp')" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(5,11,26,0.15) 0%, rgba(5,11,26,0.45) 35%, rgba(5,11,26,0.85) 62%, #050B1A 85%)",
          }}
        />
      </div>
      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-8 shadow-2xl shadow-black/20 backdrop-blur-md">
        {children}
      </div>
    </main>
  )
}
