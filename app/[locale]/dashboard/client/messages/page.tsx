import Image from "next/image"
import { getTranslations } from "next-intl/server"
import { coaches } from "@/lib/coaches"

interface Props {
  params: Promise<{ locale: string }>
}

interface MockMessage {
  id: string
  coach: (typeof coaches)[0]
  preview: string
  time: string
  unread: boolean
}

function buildMockMessages(): MockMessage[] {
  return [
    {
      id: "m1",
      coach: coaches[0],
      preview:
        "Super séance aujourd'hui ! On continue la technique en crawl la prochaine fois.",
      time: "14h32",
      unread: true,
    },
    {
      id: "m2",
      coach: coaches[1],
      preview: "N'oubliez pas d'apporter vos palmes pour vendredi.",
      time: "Hier",
      unread: true,
    },
    {
      id: "m3",
      coach: coaches[2],
      preview: "Merci pour la séance, à la prochaine !",
      time: "Lun",
      unread: false,
    },
  ]
}

export default async function ClientMessagesPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations("dashboardClient")

  const messages = buildMockMessages()

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-white lg:text-3xl">
        {t("messagesTitle")}
      </h1>

      <div className="flex flex-col gap-2">
        {messages.map((msg) => (
          <button
            key={msg.id}
            type="button"
            className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[4%] p-4 text-left backdrop-blur-md transition-colors hover:bg-white/[6%]"
          >
            <div className="relative shrink-0">
              <Image
                src={msg.coach.avatar || "/placeholder.svg"}
                alt={msg.coach.name}
                width={48}
                height={48}
                className="size-12 rounded-md object-cover ring-2 ring-white/10"
              />
              {msg.unread && (
                <span className="absolute -right-0.5 -top-0.5 flex size-3 rounded-full bg-teal-accent ring-2 ring-background" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p
                  className={`truncate text-sm ${
                    msg.unread ? "font-semibold text-white" : "text-white/70"
                  }`}
                >
                  {msg.coach.name}
                </p>
                <span className="shrink-0 text-xs text-white/30">{msg.time}</span>
              </div>
              <p className="mt-0.5 line-clamp-1 text-xs text-white/40">
                {msg.preview}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
