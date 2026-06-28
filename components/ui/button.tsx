import { ChevronRight, type LucideIcon } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

type ButtonVariant = "primary" | "entry" | "ghost"

// Accept next-intl's strict href type so we can pass either a plain string
// (same in both locales) or the localized object form ({ pathname, params })
// without `as` casts at every call site.
type ButtonHref = Parameters<typeof Link>[0]["href"] | string

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  href?: ButtonHref
  icon?: LucideIcon
  iconRight?: LucideIcon
  disabled?: boolean
  type?: "button" | "submit" | "reset"
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-teal-accent text-white hover:bg-teal-accent-light shadow-lg shadow-teal-accent/20",
  entry: "bg-blue-accent text-white hover:bg-blue-accent-dark shadow-lg shadow-blue-accent/30",
  ghost: "bg-transparent text-white hover:bg-white/5",
}

const baseClasses =
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl text-base font-semibold no-underline transition-all duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-teal-accent focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-40"

const sizeClasses = "px-6 py-3"

function ButtonInner({
  variant = "primary",
  icon: Icon,
  iconRight: IconRight,
  children,
  className,
}: {
  variant?: ButtonVariant
  icon?: LucideIcon
  iconRight?: LucideIcon
  children: React.ReactNode
  className?: string
}) {
  return (
    <>
      {Icon && <Icon className="size-[1.125rem] shrink-0" aria-hidden="true" />}
      <span>{children}</span>
      {IconRight && (
        <IconRight className="size-[1.125rem] shrink-0" aria-hidden="true" />
      )}
    </>
  )
}

export function Button({
  variant = "primary",
  href,
  icon: Icon,
  iconRight: IconRight,
  disabled,
  type = "button",
  onClick,
  children,
  className,
  ...rest
}: ButtonProps) {
  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses,
    className,
  )

  if (href !== undefined) {
    return (
      <Link
        href={href as Parameters<typeof Link>[0]["href"]}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        className={classes}
        aria-disabled={disabled}
      >
        <ButtonInner variant={variant} icon={Icon} iconRight={IconRight}>
          {children}
        </ButtonInner>
      </Link>
    )
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      className={classes}
      {...rest}
    >
      <ButtonInner variant={variant} icon={Icon} iconRight={IconRight}>
        {children}
      </ButtonInner>
    </button>
  )
}

export { ChevronRight }
