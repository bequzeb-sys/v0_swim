"use client"

import { LogIn, LogOut, User } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "@/i18n/navigation"
import { useAuth } from "@/lib/auth/auth-context"
import type { FakeUser } from "@/lib/auth/types"

const SAMPLE_CLIENT: FakeUser = {
  id: "user-sample-client-1",
  name: "Test Client",
  email: "test-client@swimai.dev",
  role: "client",
}

const SAMPLE_COACH: FakeUser = {
  id: "user-sample-coach-1",
  name: "Test Coach",
  email: "test-coach@swimai.dev",
  role: "coach",
}

function AuthPanel() {
  const { user, login, logout } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()

  function handleLogin(sample: FakeUser) {
    login(sample)
    const redirectTo = searchParams.get("redirect")
    if (redirectTo) {
      // `redirectTo` flows from the `redirect` query param (set by protected CTAs),
      // so its value is only known at runtime. Cast to next-intl's href union.
      router.push(redirectTo as Parameters<typeof router.push>[0])
    }
  }

  return (
    <div
      aria-label="Fake auth debug panel"
      className="fixed bottom-6 right-6 z-[9999] flex w-60 flex-col gap-3 rounded-xl border border-white/10 bg-black/70 p-4 backdrop-blur-md shadow-2xl"
    >
      {/* Header */}
      <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
        Dev — Fake Auth
      </p>

      {/* Current state */}
      {user ? (
        <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
          <User className="size-4 shrink-0 text-teal-accent" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{user.name}</p>
            <p className="truncate text-xs text-white/50">{user.role}</p>
          </div>
        </div>
      ) : (
        <p className="rounded-lg bg-white/5 px-3 py-2 text-sm text-white/50">
          Logged out
        </p>
      )}

      {/* Divider */}
      <div className="h-px bg-white/10" />

      {/* Login buttons */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => handleLogin(SAMPLE_CLIENT)}
          className="flex w-full cursor-pointer items-center gap-2 rounded-lg bg-teal-accent/20 px-3 py-2 text-sm font-medium text-teal-accent transition-colors hover:bg-teal-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
        >
          <LogIn className="size-3.5 shrink-0" />
          Log in as Client
        </button>
        <button
          type="button"
          onClick={() => handleLogin(SAMPLE_COACH)}
          className="flex w-full cursor-pointer items-center gap-2 rounded-lg bg-blue-accent/20 px-3 py-2 text-sm font-medium text-blue-accent transition-colors hover:bg-blue-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
        >
          <LogIn className="size-3.5 shrink-0" />
          Log in as Coach
        </button>
      </div>

      {/* Logout — only when logged in */}
      {user && (
        <button
          type="button"
          onClick={logout}
          className="flex w-full cursor-pointer items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
        >
          <LogOut className="size-3.5 shrink-0" />
          Log out
        </button>
      )}
    </div>
  )
}

function FakeAuthDebug() {
  // On the server (ssr: false still executes the module), render nothing.
  // On the client: once typeof window is defined we're past the server render
  // and AuthProvider is guaranteed to be active. AuthPanel calls hooks on
  // every render — no conditional hook calls, no Rules of Hooks violation.
  if (typeof window === "undefined") return null
  return <AuthPanel />
}

export { FakeAuthDebug }
