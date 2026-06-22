"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "@/i18n/navigation"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  User,
  X,
} from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { cn } from "@/lib/utils"

const CLIENT_NAV = [
  { key: "home", href: "/dashboard/client", icon: LayoutDashboard },
  { key: "bookings", href: "/dashboard/client/bookings", icon: Calendar },
  { key: "messages", href: "/dashboard/client/messages", icon: MessageSquare },
  { key: "settings", href: "/dashboard/client/settings", icon: Settings },
] as const

const COACH_NAV = [
  { key: "home", href: "/dashboard/coach", icon: LayoutDashboard },
  { key: "profile", href: "/dashboard/coach/profile", icon: User },
  { key: "schedule", href: "/dashboard/coach/schedule", icon: Calendar },
  { key: "bookings", href: "/dashboard/coach/bookings", icon: Calendar },
  { key: "settings", href: "/dashboard/coach/settings", icon: Settings },
] as const

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  const t = useTranslations("dashboard")
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const locale = (params.locale as string) || "fr"
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (user === null) {
      router.replace("/login?redirect=/dashboard")
    }
  }, [user, router])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  if (user === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-teal-accent" />
      </div>
    )
  }

  const nav = user.role === "coach" ? COACH_NAV : CLIENT_NAV

  function handleLogout() {
    logout()
    router.replace("/")
  }

  const roleLabel =
    user.role === "coach" ? t("sidebar.roleCoach") : t("sidebar.roleClient")

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-6">
        <svg
          viewBox="0 0 32 32"
          fill="none"
          className="size-7 shrink-0"
          aria-hidden="true"
        >
          <circle cx="16" cy="16" r="15" stroke="#2dd4bf" strokeWidth="2" />
          <path
            d="M8 20c2-4 6-8 10-8s8 4 10 8"
            stroke="#2dd4bf"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M11 16l3-4 3 4"
            stroke="#2dd4bf"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="font-heading text-lg font-bold tracking-tight text-white">
          Swim<span className="text-teal-accent">AI</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3" aria-label={t("sidebar.home")}>
        <ul className="flex flex-col gap-1">
          {nav.map(({ key, href, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/")
            return (
              <li key={key}>
                <a
                  href={`/${locale}${href}`}
                  onClick={(e) => {
                    e.preventDefault()
                    router.push(href)
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "bg-teal-accent/15 text-teal-accent"
                      : "text-white/60 hover:bg-white/5 hover:text-white/90"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {t(`sidebar.${key}` as Parameters<typeof t>[0])}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User + logout */}
      <div className="border-t border-white/10 px-4 py-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-teal-accent/20 text-sm font-bold text-teal-accent">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{user.name}</p>
            <p className="truncate text-xs text-white/40">{roleLabel}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-white/50 transition-colors hover:bg-white/5 hover:text-white/80"
        >
          <LogOut className="size-4 shrink-0" />
          {t("sidebar.logout")}
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-white/10 bg-sidebar transition-transform duration-200 lg:relative lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-white/10 bg-background px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex size-8 items-center justify-center rounded-lg text-white/60 hover:bg-white/5"
            aria-label="Open menu"
          >
            <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
            </svg>
          </button>
          <span className="font-heading text-base font-bold text-white">
            Swim<span className="text-teal-accent">AI</span>
          </span>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
