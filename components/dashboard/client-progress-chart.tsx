"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { useTranslations } from "next-intl"
import { TrendingUp } from "lucide-react"

const DATA = [
  { week: "Sem. 1", value: 52 },
  { week: "Sem. 2", value: 57 },
  { week: "Sem. 3", value: 62 },
  { week: "Sem. 4", value: 68 },
  { week: "Sem. 5", value: 73 },
  { week: "Sem. 6", value: 78 },
  { week: "Sem. 7", value: 82 },
  { week: "Sem. 8", value: 88 },
]

interface ProgressChartProps {
  locale: string
}

export function ProgressChart({ locale }: ProgressChartProps) {
  const t = useTranslations("dashboardClient")
  const isFr = locale === "fr"

  const weekLabels = DATA.map((d, i) => {
    const label = isFr ? `Sem. ${i + 1}` : `Week ${i + 1}`
    return { ...d, week: label }
  })

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[4%] p-5 backdrop-blur-md">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium uppercase tracking-wider text-white/40">
          {t("myProgress")}
        </h2>
        {/* Selector — visual only */}
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 transition-colors hover:bg-white/10"
        >
          <span>{t("performanceScore")}</span>
          <TrendingUp className="size-3 text-teal-accent" />
        </button>
      </div>

      {/* Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height={192}>
          <LineChart data={weekLabels} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="week"
              tick={{ fill: "#a8b8d8", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#a8b8d8", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip
              contentStyle={{
                background: "#0a1428",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "0.75rem",
                fontSize: "12px",
                color: "#fff",
              }}
              itemStyle={{ color: "#2dd4bf" }}
              formatter={(val) => [val ?? 0, "Score"]}
              labelStyle={{ color: "#a8b8d8" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#2dd4bf"
              strokeWidth={2.5}
              dot={{
                fill: "#2dd4bf",
                strokeWidth: 0,
                r: 4,
              }}
              activeDot={{
                fill: "#2dd4bf",
                stroke: "#050b1a",
                strokeWidth: 2,
                r: 6,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Encouragement */}
      <p className="mt-3 text-xs text-white/50">
        {t("progressEncouragement")}{" "}
        <button
          type="button"
          className="cursor-pointer text-xs font-medium text-teal-accent transition-colors hover:text-teal-accent-light"
        >
          {t("greatWork")}
        </button>
      </p>
    </section>
  )
}
