import type { Coach, CoachBadgeKey, DayKey, LanguageCode } from "@/types/coach"
import { coaches } from "@/lib/coaches-data"

// ─── Fetch functions (replace with DB calls during database sprint) ───────────

export function getCoachById(id: string): Coach | undefined {
  return coaches.find((c) => c.id === id)
}

export function getAllCoaches(): Coach[] {
  return coaches
}

export function getFeaturedCoaches(limit: number = 3): Coach[] {
  // TODO (database sprint): replace with DB query
  // e.g. supabase.from("coaches").select("*").eq("featured", true).limit(limit)
  return coaches.slice(0, limit)
}

export interface CoachFilters {
  country?: string
  location?: string
  badges?: CoachBadgeKey[]
  languages?: LanguageCode[]
  maxPrice?: number
  minRating?: number
  minExperience?: number
  availability?: DayKey[]
  gender?: "M" | "F" | ""
}

export function getCoachesByFilters(filters: CoachFilters): Coach[] {
  return coaches.filter((coach) => {
    if (filters.country && coach.country !== filters.country) return false
    if (filters.location && !coach.city.toLowerCase().includes(filters.location.toLowerCase())) return false
    if (filters.badges?.length && !filters.badges.some((b) => coach.badgeKeys.includes(b))) return false
    if (filters.languages?.length && !filters.languages.some((l) => coach.languages.includes(l))) return false
    if (filters.maxPrice && Number(coach.price) > filters.maxPrice) return false
    if (filters.minRating && Number(coach.rating) < filters.minRating) return false
    if (filters.minExperience && coach.yearsExperience < filters.minExperience) return false
    if (filters.availability?.length && !filters.availability.some((d) => coach.availability.includes(d))) return false
    if (filters.gender && coach.gender !== filters.gender) return false
    return true
  })
}

export function getCoachReviews(coachId: string) {
  return coaches.find((c) => c.id === coachId)?.reviewsList ?? []
}
