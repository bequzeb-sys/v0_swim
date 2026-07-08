import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { ClientGoal, ClientLevel, ClientOnboardingData } from "@/types/client"

interface ClientOnboardingStore {
  data: ClientOnboardingData
  setStep1: (displayName: string) => void
  setStep2: (avatarType: "default" | "upload", avatarUrl: string) => void
  setStep3: (location: string, country: string) => void
  setStep4: (level: ClientLevel) => void
  setStep5: (languages: string[]) => void
  setStep6: (goal: ClientGoal) => void
  reset: () => void
}

const defaultData: ClientOnboardingData = {
  displayName: "",
  avatarType: "default",
  avatarUrl: "",
  location: "",
  country: "",
  level: null,
  languages: [],
  goal: null,
}

export const useClientOnboardingStore = create<ClientOnboardingStore>()(
  persist(
    (set) => ({
      data: defaultData,
      setStep1: (displayName) =>
        set((state) => ({ data: { ...state.data, displayName } })),
      setStep2: (avatarType, avatarUrl) =>
        set((state) => ({ data: { ...state.data, avatarType, avatarUrl } })),
      setStep3: (location, country) =>
        set((state) => ({ data: { ...state.data, location, country } })),
      setStep4: (level) =>
        set((state) => ({ data: { ...state.data, level } })),
      setStep5: (languages) =>
        set((state) => ({ data: { ...state.data, languages } })),
      setStep6: (goal) =>
        set((state) => ({ data: { ...state.data, goal } })),
      reset: () => set({ data: defaultData }),
    }),
    {
      name: "swimai-client-onboarding",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
