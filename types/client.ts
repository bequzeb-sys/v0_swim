export type ClientGoal = "learnToSwim" | "improveTechnique" | "trainCompetition" | "fitness"
export type ClientLevel = "beginner" | "intermediate" | "advanced"

export interface ClientAvatarOptions {
  seed: string
}

export interface ClientOnboardingData {
  // Step 1 — Identity
  displayName: string
  // Step 2 — Avatar
  avatarType: "generated" | "upload"
  avatarSeed: string
  avatarOptions: ClientAvatarOptions
  avatarUrl: string
  // Step 3 — Location
  location: string
  country: string
  // Step 4 — Swimming profile
  level: ClientLevel | null
  languages: string[]
  // Step 5 — Goal
  goal: ClientGoal | null
}
