"use client"

import { useEffect } from "react"
import { useRouter } from "@/i18n/navigation"
import { useAuth } from "@/lib/auth/auth-context"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user?.role === "client") {
      router.replace("/dashboard/client")
    } else if (user?.role === "coach") {
      router.replace("/dashboard/coach")
    }
  }, [user, router])

  return null
}
