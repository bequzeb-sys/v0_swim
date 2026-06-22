"use client"

import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

interface StepIndicatorProps {
  current: number
  total: number
}

export function StepIndicator({ current, total }: StepIndicatorProps) {
  const t = useTranslations("onboarding.step")

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs font-medium text-white/40 uppercase tracking-widest">
        {t("of", { current, total })}
      </p>

      <div className="flex items-center gap-2">
        {Array.from({ length: total }, (_, i) => {
          const step = i + 1
          const isActive = step === current
          const isCompleted = step < current
          return (
            <div
              key={step}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                isActive && "w-6 bg-teal-accent",
                isCompleted && "w-1.5 bg-teal-accent",
                step > current && "w-1.5 bg-white/20"
              )}
            />
          )
        })}
      </div>
    </div>
  )
}
