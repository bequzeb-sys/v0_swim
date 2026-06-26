import * as Flags from "country-flag-icons/react/3x2"
import type { LanguageCode } from "@/lib/coaches"

const LANGUAGE_TO_COUNTRY: Record<LanguageCode, string> = {
  fr: "FR",
  en: "GB",
  es: "ES",
  de: "DE",
  it: "IT",
  ar: "SA",
  zh: "CN",
  pt: "PT",
  ru: "RU",
  ja: "JP",
}

interface LanguageFlagProps {
  code: LanguageCode
  size?: number
  showLabel?: boolean
  label?: string
}

export function LanguageFlag({ code, size = 20, showLabel, label }: LanguageFlagProps) {
  const country = LANGUAGE_TO_COUNTRY[code]
  const FlagComponent = (Flags as Record<string, React.ComponentType<{ style?: React.CSSProperties; className?: string }>>)[country]

  if (!FlagComponent) return null

  return (
    <span className="inline-flex items-center gap-1.5" title={label}>
      <FlagComponent
        style={{ width: size, height: size }}
        className="rounded-md"
        aria-hidden="true"
      />
      {showLabel && label && (
        <span className="text-sm text-white/70">{label}</span>
      )}
    </span>
  )
}
