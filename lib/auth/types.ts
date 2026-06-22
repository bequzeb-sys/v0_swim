export type UserRole = "client" | "coach"

export interface FakeUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatarUrl?: string
}
