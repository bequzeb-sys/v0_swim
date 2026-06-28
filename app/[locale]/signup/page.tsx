"use client"

import { useSearchParams } from "next/navigation"
import { UserCheck, Award } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"

interface RoleCardProps {
  href: Parameters<typeof Link>[0]["href"]
  icon: React.ReactNode
  title: string
  description: string
}

function RoleCard({ href, icon, title, description }: RoleCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-start gap-4 rounded-2xl border border-white/10 bg-white/[4%] p-6 backdrop-blur-md transition-all hover:border-teal-accent/40 hover:bg-white/[6%] active:scale-[0.98]"
    >
      <div className="flex size-11 items-center justify-center rounded-xl bg-white/[6%]">
        {icon}
      </div>
      <div>
        <p className="mb-1 text-base font-semibold text-white">{title}</p>
        <p className="text-sm text-white/50">{description}</p>
      </div>
    </Link>
  )
}

export default function SignupPage() {
  const t = useTranslations("auth.signup")
  const searchParams = useSearchParams()
  const redirectParam = searchParams.get("redirect")

  const clientHref: Parameters<typeof Link>[0]["href"] = redirectParam
    ? { pathname: "/signup/client", query: { redirect: redirectParam } }
    : "/signup/client"
  const coachHref: Parameters<typeof Link>[0]["href"] = redirectParam
    ? { pathname: "/signup/coach", query: { redirect: redirectParam } }
    : "/signup/coach"

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
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-8 shadow-2xl shadow-black/20 backdrop-blur-md">
        <h1 className="mb-2 text-center text-2xl font-bold text-white">{t("title")}</h1>
        <p className="mb-8 text-center text-sm text-white/50">{t("subtitle")}</p>

        <div className="flex flex-col gap-3">
          <RoleCard
            href={clientHref}
            icon={<UserCheck className="size-5 text-teal-accent" strokeWidth={2} />}
            title={t("clientOption")}
            description={t("clientDescription")}
          />
          <RoleCard
            href={coachHref}
            icon={<Award className="size-5 text-blue-accent" strokeWidth={2} />}
            title={t("coachOption")}
            description={t("coachDescription")}
          />
        </div>
      </div>
    </main>
  )
}
