"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PillProps {
  selected: boolean
  onClick: () => void
  /**
   * Optional leading element (flag, icon, etc.). Use `ariaLabel` on the
   * parent <Pill> when no children are rendered (icon-only pills).
   */
  icon?: ReactNode
  /** Pill label. Omit for icon-only pills. */
  children?: ReactNode
  /** Required when `children` is omitted — keeps icon-only pills accessible. */
  ariaLabel?: string
  disabled?: boolean
  /**
   * Layout-only extension slot for spacing/sizing tweaks (e.g. wider
   * horizontal padding on text-only pills). Do NOT use this to override
   * colors or selected/unselected states — those are the whole point of
   * the shared component.
   */
  className?: string
}

export function Pill({
  selected,
  onClick,
  icon,
  children,
  ariaLabel,
  disabled,
  className,
}: PillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2 py-1 text-sm transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
        "disabled:cursor-not-allowed disabled:opacity-50",
        selected
          ? "border-teal-accent bg-teal-accent/15 text-teal-accent-light"
          : "border-white/15 bg-white/5 text-white/70 hover:border-white/30 hover:text-white",
        className
      )}
    >
      {icon}
      {children}
    </button>
  )
}
