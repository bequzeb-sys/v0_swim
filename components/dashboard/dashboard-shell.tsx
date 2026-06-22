"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "@/i18n/navigation"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  User,
  Bell,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
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

const NAV_FADE = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.18, ease: "easeOut" } },
  exit: { opacity: 0, x: -8, transition: { duration: 0.12, ease: "easeIn" } },
}

const SIDEBAR_VARIANTS = {
  hidden: { x: "-100%", transition: { duration: 0.28, ease: "easeInOut" } },
  visible: { x: 0, transition: { duration: 0.28, ease: "easeInOut" } },
}

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
  const [collapsed, setCollapsed] = useState(false)

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
  const roleLabel =
    user.role === "coach" ? t("sidebar.roleCoach") : t("sidebar.roleClient")

  function handleLogout() {
    logout()
    router.replace("/")
  }

  function handleNav(href: string) {
    router.push(href)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* ===== DESKTOP SIDEBAR ===== */}
      <motion.aside
        variants={SIDEBAR_VARIANTS}
        initial="visible"
        animate={mobileOpen ? "visible" : "visible"}
        className="fixed inset-y-0 left-0 z-40 shrink-0 lg:relative"
        style={{ margin: "0.75rem", height: "calc(100vh - 1.5rem)" }}
        aria-label="Sidebar"
      >
        {/* Floating rounded panel */}
        <motion.div
          animate={{ width: collapsed ? "5rem" : "18rem" }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[5%] shadow-xl shadow-black/40 backdrop-blur-md"
        >
          {/* Logo row + collapse toggle */}
          <div className="flex shrink-0 items-center border-b border-white/10 px-3 py-5">
            {/* Logo mark — always visible */}
            <motion.div
              animate={{ justifyContent: collapsed ? "center" : "flex-start" }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-2.5 overflow-hidden"
            >
              <motion.svg
                viewBox="0 0 32 32"
                fill="none"
                className="size-7 shrink-0"
                aria-hidden="true"
                whileHover={{ scale: 1.08 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
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
              </motion.svg>

              {/* "SwimAI" wordmark — fades out/in with collapse */}
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    key="wordmark"
                    {...NAV_FADE}
                    className="font-heading whitespace-nowrap text-lg font-bold tracking-tight text-white"
                  >
                    Swim<span className="text-teal-accent">AI</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Spacer — pushes toggle to the far right */}
            <div className="flex-1" />

            {/* Collapse toggle — hidden on mobile */}
            <motion.button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? t("sidebar.expandSidebar") : t("sidebar.collapseSidebar")}
              className="hidden size-7 shrink-0 items-center justify-center rounded-md text-white/40 lg:flex"
              whileHover={{ scale: 1.1, color: "rgba(255,255,255,0.8)" }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {collapsed ? (
                <PanelLeftOpen className="size-5" />
              ) : (
                <PanelLeftClose className="size-5" />
              )}
            </motion.button>
          </div>

          {/* Nav items */}
          <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label={t("sidebar.home")}>
            <ul className="flex flex-col gap-1">
              {nav.map(({ key, href, icon: Icon }) => {
                const isHome = key === "home"
                const active = isHome
                  ? pathname === href
                  : pathname === href || pathname.startsWith(href + "/")
                const label = t(`sidebar.${key}` as Parameters<typeof t>[0])

                return (
                  <li key={key}>
                    <motion.button
                      type="button"
                      onClick={() => handleNav(href)}
                      aria-label={label}
                      className={cn(
                        "group relative flex w-full items-center rounded-xl py-2.5 text-sm font-medium",
                        active
                          ? "bg-teal-accent/15 text-teal-accent"
                          : "text-white/60",
                        collapsed ? "justify-center px-0" : "gap-3 px-3"
                      )}
                      whileHover={
                        active
                          ? { scale: 1.02 }
                          : { scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.9)" }
                      }
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    >
                      <motion.div
                        animate={{ justifyContent: collapsed ? "center" : "flex-start" }}
                        transition={{ duration: 0.18 }}
                        className={cn("flex items-center gap-3 overflow-hidden", collapsed ? "w-full justify-center" : "")}
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        >
                          <Icon className="shrink-0 size-5" />
                        </motion.div>

                        {/* Label — fades out/in with collapse */}
                        <AnimatePresence mode="wait">
                          {!collapsed && (
                            <motion.span
                              key={`label-${key}`}
                              {...NAV_FADE}
                              className="truncate"
                            >
                              {label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </motion.button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* User footer */}
          <div
            className={cn(
              "shrink-0 border-t border-white/10 px-2 pb-4 pt-3",
              collapsed ? "flex flex-col items-center gap-3" : ""
            )}
          >
            {collapsed ? (
              <>
                {/* Avatar only */}
                <motion.div
                  className="flex size-10 items-center justify-center rounded-full bg-teal-accent/20 text-sm font-bold text-teal-accent"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </motion.div>
                {/* Logout icon */}
                <motion.button
                  type="button"
                  onClick={handleLogout}
                  aria-label={t("sidebar.logout")}
                  className="flex size-9 items-center justify-center rounded-xl text-white/40"
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.8)" }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <LogOut className="size-5" />
                </motion.button>
              </>
            ) : (
              <>
                {/* Name + role — fade-slide in/out */}
                <motion.div
                  className="mb-2 flex items-center gap-2.5 overflow-hidden px-2"
                  layout
                >
                  <motion.div
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-teal-accent/20 text-sm font-bold text-teal-accent"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </motion.div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key="user-info"
                      {...NAV_FADE}
                      className="min-w-0 flex-1"
                    >
                      <p className="truncate text-sm font-medium text-white">{user.name}</p>
                      <p className="truncate text-xs text-white/40">{roleLabel}</p>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>

                <motion.button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/50"
                  whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.8)" }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <LogOut className="size-5 shrink-0" />
                  </motion.div>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key="logout-label"
                      {...NAV_FADE}
                    >
                      {t("sidebar.logout")}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              </>
            )}
          </div>
        </motion.div>
      </motion.aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-white/10 bg-background px-4 lg:hidden">
          <motion.button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex size-8 items-center justify-center rounded-lg text-white/60"
            aria-label="Open menu"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
            </svg>
          </motion.button>
          <span className="font-heading text-base font-bold text-white">
            Swim<span className="text-teal-accent">AI</span>
          </span>
        </header>

        {/* Top bar */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-background px-6">
          <div />
          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              aria-label="Notifications"
              className="relative flex size-9 items-center justify-center rounded-lg text-white/50"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,1)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Bell className="size-4" />
              <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold leading-none text-white">
                3
              </span>
            </motion.button>
            <motion.button
              type="button"
              aria-label="Account menu"
              className="flex items-center gap-2 rounded-lg px-1 py-1"
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="flex size-8 items-center justify-center rounded-full bg-teal-accent/20 text-sm font-bold text-teal-accent">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <ChevronDown className="size-3 text-white/40" />
            </motion.button>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
