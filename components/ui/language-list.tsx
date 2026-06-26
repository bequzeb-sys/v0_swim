import { LanguageFlag } from "@/components/ui/language-flag"
import type { LanguageCode } from "@/lib/coaches"
import { cn } from "@/lib/utils"

interface LanguageListProps {
  codes: LanguageCode[]
  labels?: Partial<Record<LanguageCode, string>>
  size?: number
  showLabels?: boolean
  max?: number
  className?: string
}

export function LanguageList({
  codes,
  labels = {},
  size = 18,
  showLabels = false,
  max,
  className,
}: LanguageListProps) {
  const visible = max !== undefined ? codes.slice(0, max) : codes
  const overflow = max !== undefined ? codes.length - max : 0

  return (
    <span className={cn("inline-flex flex-wrap items-center gap-2", className)}>
      {visible.map((code) => (
        <LanguageFlag
          key={code}
          code={code}
          size={size}
          showLabel={showLabels}
          label={labels[code]}
        />
      ))}
      {overflow > 0 && (
        <span className="rounded-sm border border-white/15 bg-white/5 px-1.5 py-0.5 text-xs font-medium text-white/50">
          +{overflow}
        </span>
      )}
    </span>
  )
}
