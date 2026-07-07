import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { CoachBadgeKey, DayKey, LanguageCode } from "@/types/coach"

export interface CoachOnboardingData {
  // Step 1 — Specialties
  badgeKeys: CoachBadgeKey[]
  featuredBadgeKeys: CoachBadgeKey[] // max 2, chosen from badgeKeys
  // Step 2 — Profile
  bio: string
  city: string
  country: string
  price: string
  certification: string
  languages: LanguageCode[]
  // Step 3 — Availability
  availability: DayKey[]
}

interface CoachOnboardingStore {
  data: CoachOnboardingData
  setStep1: (badgeKeys: CoachBadgeKey[], featuredBadgeKeys: CoachBadgeKey[]) => void
  setStep2: (profile: Omit<CoachOnboardingData, "badgeKeys" | "featuredBadgeKeys" | "availability">) => void
  setStep3: (availability: DayKey[]) => void
  reset: () => void
}

const defaultData: CoachOnboardingData = {
  badgeKeys: [],
  featuredBadgeKeys: [],
  bio: "",
  city: "",
  country: "",
  price: "",
  certification: "",
  languages: [],
  availability: [],
}

export const useCoachOnboardingStore = create<CoachOnboardingStore>()(
  persist(
    (set) => ({
      data: defaultData,
      setStep1: (badgeKeys, featuredBadgeKeys) =>
        set((state) => ({ data: { ...state.data, badgeKeys, featuredBadgeKeys } })),
      setStep2: (profile) =>
        set((state) => ({ data: { ...state.data, ...profile } })),
      setStep3: (availability) =>
        set((state) => ({ data: { ...state.data, availability } })),
      reset: () => set({ data: defaultData }),
    }),
    {
      name: "swimai-coach-onboarding",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
