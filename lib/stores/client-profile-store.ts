import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { ClientProfile, ClientLevel, ClientGoal } from "@/types/client"

interface ClientProfileStore {
  profile: ClientProfile
  setProfile: (profile: Partial<ClientProfile>) => void
  setFromOnboarding: (data: {
    displayName: string
    avatarType: "default" | "upload"
    avatarUrl: string
    location: string
    country: string
    level: ClientLevel | null
    languages: string[]
    goal: ClientGoal | null
  }) => void
  reset: () => void
}

const defaultProfile: ClientProfile = {
  displayName: "",
  bio: "",
  avatarType: "default",
  avatarUrl: "",
  location: "",
  country: "",
  level: null,
  languages: [],
  goal: null,
  phone: "",
  notificationsEmail: true,
  notificationsPush: false,
}

export const useClientProfileStore = create<ClientProfileStore>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      setProfile: (partial) =>
        set((state) => ({ profile: { ...state.profile, ...partial } })),
      setFromOnboarding: (data) =>
        set((state) => ({ profile: { ...state.profile, ...data } })),
      reset: () => set({ profile: defaultProfile }),
    }),
    {
      name: "swimai-client-profile",
      storage: createJSONStorage(() => localStorage),
    }
  )
)