import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  value: number
  max?: number
  size?: number
  className?: string
}

function StarIcon({
  fill,
  size,
}: {
  fill: "full" | "half" | "empty"
  size: number
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="half-fill">
          <stop offset="50%" stopColor="currentColor" />
          <stop offset="50%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <Star
        className={cn(
          "text-star-gold",
          fill === "empty" && "text-white/20"
        )}
        fill={
          fill === "full"
            ? "currentColor"
            : fill === "half"
              ? "url(#half-fill)"
              : "none"
        }
        strokeWidth={1.5}
      />
    </svg>
  )
}

export function StarRating({
  value,
  max = 5,
  size = 14,
  className,
}: StarRatingProps) {
  const clamped = Math.min(Math.max(value, 0), max)

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      aria-label={`${value} out of ${max} stars`}
    >
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1
        let fill: "full" | "half" | "empty" = "empty"
        if (clamped >= starValue) {
          fill = "full"
        } else if (clamped >= starValue - 0.5) {
          fill = "half"
        }
        return <StarIcon key={i} fill={fill} size={size} />
      })}
    </div>
  )
}
