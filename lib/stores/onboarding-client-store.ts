import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { ClientGoal, ClientLevel, ClientOnboardingData } from "@/types/client"

// TODO (database sprint): country maps to clients.country in DB
// location maps to clients.city in DB

interface ClientOnboardingStore {
  data: ClientOnboardingData
  setStep1: (goal: ClientGoal) => void
  setStep2: (location: string, country: string) => void
  setStep3: (level: ClientLevel) => void
  reset: () => void
}

const defaultData: ClientOnboardingData = {
  goal: null,
  location: "",
  country: "",
  level: null,
}

export const useClientOnboardingStore = create<ClientOnboardingStore>()(
  persist(
    (set) => ({
      data: defaultData,
      setStep1: (goal) =>
        set((state) => ({ data: { ...state.data, goal } })),
      setStep2: (location, country) =>
        set((state) => ({ data: { ...state.data, location, country } })),
      setStep3: (level) =>
        set((state) => ({ data: { ...state.data, level } })),
      reset: () => set({ data: defaultData }),
    }),
    {
      name: "swimai-client-onboarding",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
