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
