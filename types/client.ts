export type ClientGoal = "learnToSwim" | "improveTechnique" | "trainCompetition" | "fitness"
export type ClientLevel = "beginner" | "intermediate" | "advanced"

export interface ClientOnboardingData {
  // Step 1 — Goal
  goal: ClientGoal | null
  // Step 2 — Location + Country + Level
  location: string
  country: string
  level: ClientLevel | null
}
