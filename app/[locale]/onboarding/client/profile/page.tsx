"use client"

import { useEffect } from "react"
import { useRouter } from "@/i18n/navigation"

export default function ClientOnboardingProfilePage() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/onboarding/client")
  }, [router])
  return null
}
