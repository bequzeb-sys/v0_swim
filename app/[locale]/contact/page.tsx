"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { UnderwaterBackground } from "@/components/underwater-background"
import { SecondaryPageHeader } from "@/components/secondary-page-header"
import { Footer } from "@/components/footer"
import { MessageCircle, UserCheck, Wrench, LifeBuoy, Copy, Check, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

const TOPIC_ICONS = [
  <LifeBuoy className="size-5" aria-hidden="true" />,
  <UserCheck className="size-5" aria-hidden="true" />,
  <Wrench className="size-5" aria-hidden="true" />,
  <MessageCircle className="size-5" aria-hidden="true" />,
]

export default function ContactPage() {
  const t = useTranslations("contact")
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null)
  const [email, setEmail] = useState("")
  const [copied, setCopied] = useState(false)

  const topics = [
    { title: t("topic1Title"), body: t("topic1Body"), prefill: t("topic1Prefill") },
    { title: t("topic2Title"), body: t("topic2Body"), prefill: t("topic2Prefill") },
    { title: t("topic3Title"), body: t("topic3Body"), prefill: t("topic3Prefill") },
    { title: t("topic4Title"), body: t("topic4Body"), prefill: t("topic4Prefill") },
  ]

  const selectedPrefill = selectedTopic !== null ? topics[selectedTopic].prefill : ""

  function handleCopy() {
    navigator.clipboard.writeText(selectedPrefill)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleEmail() {
    const subject = selectedTopic !== null ? topics[selectedTopic].title : "SwimAI"
    const body = encodeURIComponent(selectedPrefill)
    window.open(`mailto:${t("emailAddress")}?subject=${encodeURIComponent(subject)}&body=${body}`)
  }

  return (
    <>
      <UnderwaterBackground />
      <SecondaryPageHeader />
      <main className="relative z-10 mx-auto max-w-3xl px-6 pb-24 pt-24">

        {/* Badge */}
        <div className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-accent/30 bg-teal-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-teal-accent">
            <MessageCircle className="size-3.5" aria-hidden="true" />
            {t("badge")}
          </span>
        </div>

        {/* Hero */}
        <h1 className="mb-4 text-center text-4xl font-extrabold tracking-tight text-white md:text-5xl">
          {t("hero")}
        </h1>
        <p className="mx-auto mb-12 max-w-md text-center text-base text-white/60">
          {t("heroSub")}
        </p>

        {/* Topic selector */}
        <div className="grid gap-4 sm:grid-cols-2">
          {topics.map((topic, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedTopic(i === selectedTopic ? null : i)}
              className={cn(
                "cursor-pointer rounded-3xl border p-6 text-left transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
                selectedTopic === i
                  ? "border-teal-accent/40 bg-teal-accent/10 shadow-lg shadow-teal-accent/10"
                  : "border-blue-300/20 bg-blue-400/[8%] shadow-xl shadow-black/20 backdrop-blur-md hover:border-teal-accent/20 hover:bg-blue-400/[12%]"
              )}
            >
              <div className={cn(
                "mb-3 flex size-10 items-center justify-center rounded-md transition-colors",
                selectedTopic === i ? "bg-teal-accent/20 text-teal-accent" : "bg-white/5 text-white/50"
              )}>
                {TOPIC_ICONS[i]}
              </div>
              <h3 className={cn(
                "mb-1 text-sm font-bold transition-colors",
                selectedTopic === i ? "text-teal-accent" : "text-white"
              )}>
                {topic.title}
              </h3>
              <p className="text-xs leading-relaxed text-white/50">{topic.body}</p>
            </button>
          ))}
        </div>

        {/* Message preview — slides in when topic selected */}
        {selectedTopic !== null && (
          <div className="mt-6 rounded-3xl border border-blue-300/20 bg-blue-400/[8%] p-6 shadow-xl shadow-black/20 backdrop-blur-md">

            {/* Coming soon badge */}
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/40">
                {t("comingSoonBadge")}
              </span>
            </div>

            <p className="mb-4 text-xs text-white/40">{t("comingSoonNote")}</p>

            {/* Pre-filled message */}
            <div className="mb-4 rounded-xl border border-white/10 bg-white/5 p-4">
              <pre className="whitespace-pre-wrap text-xs leading-relaxed text-white/70 font-sans">
                {selectedPrefill}
              </pre>
            </div>

            {/* Email input */}
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-medium text-white/50">
                {t("emailLabel")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-base text-white placeholder:text-white/30 outline-none transition-colors focus:border-teal-accent focus:ring-1 focus:ring-teal-accent/30"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCopy}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60",
                  copied
                    ? "border-teal-accent/40 bg-teal-accent/10 text-teal-accent"
                    : "border-white/15 bg-white/5 text-white/70 hover:border-white/30 hover:text-white"
                )}
              >
                {copied
                  ? <><Check className="size-4" aria-hidden="true" />{t("copiedButton")}</>
                  : <><Copy className="size-4" aria-hidden="true" />{t("copyButton")}</>
                }
              </button>
              <button
                type="button"
                onClick={handleEmail}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-teal-accent px-4 py-2.5 text-sm font-semibold text-navy-deep transition-all hover:opacity-90 active:scale-[0.98] active:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60"
              >
                <Mail className="size-4" aria-hidden="true" />
                {t("emailCta")}
              </button>
            </div>
          </div>
        )}

      </main>
      <Footer />
    </>
  )
}
