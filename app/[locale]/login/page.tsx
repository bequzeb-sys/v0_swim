"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Waves } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link, useRouter } from "@/i18n/navigation"
import { useAuth } from "@/lib/auth/auth-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { FakeUser } from "@/lib/auth/types"

function LoginForm() {
  const t = useTranslations("auth.login")
  const searchParams = useSearchParams()
  const router = useRouter()
  const { login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return

    const nameFromEmail = email.split("@")[0]
      .replace(/[._-]/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

    const user: FakeUser = {
      id: `user-${Date.now()}`,
      name: nameFromEmail || email,
      email,
      role: "client",
    }

    login(user)

    const redirectTo = searchParams.get("redirect")
    if (redirectTo) {
      // `redirectTo` flows from the `redirect` query param (set by protected CTAs),
      // so its value is only known at runtime. Cast to next-intl's href union.
      router.push(redirectTo as Parameters<typeof router.push>[0])
    } else {
      router.push("/dashboard")
    }
  }

  const redirectParam = searchParams.get("redirect")
  const signupHref: Parameters<typeof Link>[0]["href"] = redirectParam
    ? { pathname: "/signup", query: { redirect: redirectParam } }
    : "/signup"

  return (
    <div className="w-full max-w-md rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-8 shadow-2xl shadow-black/20 backdrop-blur-md">
      {/* Logo mark */}
      <div className="mb-6 flex justify-center">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-accent to-blue-accent-dark shadow-lg shadow-blue-accent/25">
          <Waves className="size-6 text-white" strokeWidth={2.5} />
        </div>
      </div>

      {/* Heading */}
      <h1 className="mb-1 text-center text-2xl font-bold text-white">{t("title")}</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
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
          autoComplete="current-password"
        />
        <Button
          type="submit"
          variant="entry"
          className="mt-2 w-full text-sm active:scale-[0.98]"
        >
          {t("submitCta")}
        </Button>
      </form>

      {/* Signup link */}
      <div className="mt-6 flex items-center justify-center gap-1.5 text-sm text-white/50">
        <span>{t("noAccount")}</span>
        <Link
          href={signupHref}
          className="font-medium text-teal-accent transition-colors hover:text-teal-accent-light"
        >
          {t("signupLink")}
        </Link>
      </div>
    </div>
  )
}

export default function LoginPage() {
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
      <LoginForm />
    </main>
  )
}
