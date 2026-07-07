import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { ClientGoal, ClientLevel, ClientOnboardingData } from "@/types/client"

interface ClientOnboardingStore {
  data: ClientOnboardingData
  setStep1: (goal: ClientGoal) => void
  setStep2: (location: string, level: ClientLevel) => void
  reset: () => void
}

const defaultData: ClientOnboardingData = {
  goal: null,
  location: "",
  level: null,
}

export const useClientOnboardingStore = create<ClientOnboardingStore>()(
  persist(
    (set) => ({
      data: defaultData,
      setStep1: (goal) =>
        set((state) => ({ data: { ...state.data, goal } })),
      setStep2: (location, level) =>
        set((state) => ({ data: { ...state.data, location, level } })),
      reset: () => set({ data: defaultData }),
    }),
    {
      name: "swimai-client-onboarding",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
