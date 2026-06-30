import type { MetadataRoute } from "next"
import { coaches } from "@/lib/coaches"

const BASE_URL = "https://swimai.app"
const LOCALES = ["fr", "en"] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Static routes — one entry per locale
  const staticRoutes = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/coaches", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/login", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/signup", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/mentions-legales", priority: 0.2, changeFrequency: "yearly" as const },
    { path: "/cgu", priority: 0.2, changeFrequency: "yearly" as const },
    { path: "/confidentialite", priority: 0.2, changeFrequency: "yearly" as const },
  ]

  const staticEntries = staticRoutes.flatMap(({ path, priority, changeFrequency }) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${BASE_URL}/${l}${path}`])
        ),
      },
    }))
  )

  // Dynamic coach profile routes — one entry per coach per locale
  const coachEntries = coaches.flatMap((coach) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/coaches/${coach.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${BASE_URL}/${l}/coaches/${coach.id}`])
        ),
      },
    }))
  )

  return [...staticEntries, ...coachEntries]
}
