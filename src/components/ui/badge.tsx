/* oxlint-disable react/only-export-components -- the public recipe and prop type are intentional. */
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

import "./badge.css"

const badgeVariants = cva("vlight-badge", {
  variants: {
    tone: {
      neutral: "is-neutral",
      purple: "is-purple",
      violet: "is-violet",
      blue: "is-blue",
      success: "is-success",
      warning: "is-warning",
      error: "is-error",
    },
    treatment: {
      soft: "is-soft",
      outline: "is-outline",
      solid: "is-solid",
    },
    size: {
      small: "is-small",
      medium: "is-medium",
    },
  },
  defaultVariants: {
    tone: "neutral",
    treatment: "soft",
    size: "small",
  },
})

type BadgeProps = ComponentPropsWithoutRef<"span"> &
  VariantProps<typeof badgeVariants> & {
    leadingIcon?: ReactNode
    trailingIcon?: ReactNode
  }

function Badge({
  className,
  tone = "neutral",
  treatment = "soft",
  size = "small",
  leadingIcon,
  trailingIcon,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      data-slot="badge"
      data-tone={tone}
      data-treatment={treatment}
      data-size={size}
      className={cn(badgeVariants({ tone, treatment, size }), className)}
      {...props}
    >
      {leadingIcon ? (
        <span className="vlight-badge__icon" aria-hidden="true">
          {leadingIcon}
        </span>
      ) : null}
      <span className="vlight-badge__label">{children}</span>
      {trailingIcon ? (
        <span className="vlight-badge__icon" aria-hidden="true">
          {trailingIcon}
        </span>
      ) : null}
    </span>
  )
}

export { Badge, badgeVariants, type BadgeProps }
