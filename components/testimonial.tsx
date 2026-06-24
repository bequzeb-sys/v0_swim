import Image from "next/image"
import { Quote } from "lucide-react"
import { useTranslations } from "next-intl"

export function Testimonial() {
  const t = useTranslations("testimonial")

  return (
    <section
      aria-label={t("label")}
      className="relative scroll-mt-24 px-6 py-10"
    >
      <div className="mx-auto max-w-xl">
        {/* Visible sample-testimonial disclosure so we never ship this as real social proof */}
        <div className="mb-4 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-medium text-amber-200">
            <span aria-hidden="true">∗</span>
            {t("label")}
          </span>
        </div>

        <figure className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md md:p-6">
          <Quote
            aria-hidden="true"
            className="absolute left-5 top-5 size-6 text-teal-accent"
          />

          <blockquote className="pt-5">
            <p className="text-base italic leading-relaxed text-white md:text-lg">
              &ldquo;{t("quote")}&rdquo;
            </p>
          </blockquote>

          <figcaption className="mt-6 flex items-center gap-4 border-t border-white/10 pt-5">
            <Image
              src="/placeholder.svg"
              alt=""
              width={48}
              height={48}
              aria-hidden="true"
              className="size-12 shrink-0 rounded-full"
            />
            <div className="flex flex-col text-left">
              <span className="text-base font-bold text-white">
                {t("name")}
              </span>
              <span className="text-sm text-text-secondary">
                {t("context")}
              </span>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}