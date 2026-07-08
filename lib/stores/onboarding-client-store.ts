import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type {
  ClientGoal,
  ClientLevel,
  ClientGender,
  ClientAvatarOptions,
  ClientOnboardingData,
} from "@/types/client"

interface ClientOnboardingStore {
  data: ClientOnboardingData
  setStep1: (displayName: string) => void
  setStep2: (avatarType: "generated" | "upload", avatarSeed: string, avatarOptions: ClientAvatarOptions, avatarUrl: string) => void
  setStep3: (location: string, country: string) => void
  setStep4: (level: ClientLevel, languages: string[]) => void
  setStep5: (goal: ClientGoal) => void
  reset: () => void
}

const defaultAvatarOptions: ClientAvatarOptions = {
  skinColor: "f5d0b5",
  hair: "long01",
  gender: "neutral",
  glasses: false,
}

const defaultData: ClientOnboardingData = {
  displayName: "",
  avatarType: "generated",
  avatarSeed: "",
  avatarOptions: defaultAvatarOptions,
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
      setStep2: (avatarType, avatarSeed, avatarOptions, avatarUrl) =>
        set((state) => ({ data: { ...state.data, avatarType, avatarSeed, avatarOptions, avatarUrl } })),
      setStep3: (location, country) =>
        set((state) => ({ data: { ...state.data, location, country } })),
      setStep4: (level, languages) =>
        set((state) => ({ data: { ...state.data, level, languages } })),
      setStep5: (goal) =>
        set((state) => ({ data: { ...state.data, goal } })),
      reset: () => set({ data: defaultData }),
    }),
    {
      name: "swimai-client-onboarding",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
