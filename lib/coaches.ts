// Re-export barrel — keeps all existing consumer imports working unchanged.
// When database sprint begins, update lib/coaches-api.ts only.
export type { CoachBadgeKey, LanguageCode, DayKey, CoachReview, Coach } from "@/types/coach"
export type { CoachFilters } from "@/lib/coaches-api"
export { coaches } from "@/lib/coaches-data"
export { getCoachById, getAllCoaches, getCoachesByFilters, getCoachReviews } from "@/lib/coaches-api"
