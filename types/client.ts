export type ClientGoal = "learnToSwim" | "improveTechnique" | "trainCompetition" | "fitness"
export type ClientLevel = "beginner" | "intermediate" | "advanced"

export interface ClientOnboardingData {
  displayName: string
  avatarType: "default" | "upload"
  avatarUrl: string
  location: string
  country: string
  level: ClientLevel | null
  languages: string[]
  goal: ClientGoal | null
}

export interface ClientProfile {
  // Identity
  displayName: string
  bio: string
  avatarType: "default" | "upload"
  avatarUrl: string
  // Location
  location: string
  country: string
  // Swimming profile
  level: ClientLevel | null
  languages: string[]
  goal: ClientGoal | null
  // Contact (optional)
  phone: string
  // Preferences
  notificationsEmail: boolean
  notificationsPush: boolean
}
