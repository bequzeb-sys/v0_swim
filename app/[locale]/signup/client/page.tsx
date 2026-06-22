"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link, useRouter } from "@/i18n/navigation"
import { useAuth } from "@/lib/auth/auth-context"
import { Input } from "@/components/ui/input"
import type { FakeUser } from "@/lib/auth/types"

export default function SignupClientPage() {
  const t = useTranslations("auth.signup.client")
  const tParent = useTranslations("auth.signup")
  const searchParams = useSearchParams()
  const router = useRouter()
  const { login } = useAuth()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !password.trim()) return

    const user: FakeUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: "client",
    }

    login(user)

    const redirectParam = searchParams.get("redirect")
    if (redirectParam) {
      router.push(`/onboarding/client?redirect=${encodeURIComponent(redirectParam)}`)
    } else {
      router.push("/onboarding/client")
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4">
      {/* Underwater background */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-top bg-no-repeat"
          style={{ backgroundImage: "url('/underwater-hero.webp')" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(5,11,26,0.15) 0%, rgba(5,11,26,0.45) 35%, rgba(5,11,26,0.85) 62%, #050B1A 85%)",
          }}
        />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-white/[4%] p-8 backdrop-blur-md shadow-2xl">
        {/* Back link */}
        <Link
          href={{ pathname: "/signup", query: Object.fromEntries(searchParams) }}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white/80"
        >
          <ArrowLeft className="size-3.5" />
          <span>{tParent("title")}</span>
        </Link>

        <h1 className="mb-1 text-2xl font-bold text-white">{t("title")}</h1>
        <p className="mb-6 text-sm text-white/50">{t("subtitle")}</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label={t("nameLabel")}
            placeholder={t("namePlaceholder")}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
          <Input
            label={t("emailLabel")}
            placeholder={t("emailPlaceholder")}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            label={t("passwordLabel")}
            placeholder={t("passwordPlaceholder")}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <button
            type="submit"
            className="mt-2 flex h-10 w-full items-center justify-center rounded-xl bg-gradient-to-r from-teal-accent to-blue-accent text-sm font-bold text-white shadow-lg shadow-teal-accent/25 transition-all hover:opacity-90 active:scale-[0.98]"
          >
            {t("submitCta")}
          </button>
        </form>
      </div>
    </main>
  )
}
