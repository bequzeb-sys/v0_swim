"use client"

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react"
import type { FakeUser } from "./types"

interface AuthContextValue {
  user: FakeUser | null
  login: (user: FakeUser) => void
  logout: () => void
}

const noop = () => {}

const defaultValue: AuthContextValue = {
  user: null,
  login: noop,
  logout: noop,
}

const AuthContext = createContext<AuthContextValue>(defaultValue)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<FakeUser | null>(null)

  const login = useCallback((user: FakeUser) => {
    setUser(user)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext)
}
