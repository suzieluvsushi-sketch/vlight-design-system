/* oxlint-disable react/only-export-components -- the public recipe and prop type are intentional. */
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import {
  IconAlertTriangleFilled,
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconInfoCircleFilled,
} from "@tabler/icons-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

import "./alert.css"

const alertVariants = cva("vlight-alert", {
  variants: {
    tone: {
      info: "is-info",
      success: "is-success",
      warning: "is-warning",
      error: "is-error",
    },
  },
  defaultVariants: {
    tone: "info",
  },
})

type AlertProps = Omit<ComponentPropsWithoutRef<"div">, "title"> &
  VariantProps<typeof alertVariants> & {
    title: ReactNode
    description?: ReactNode
    icon?: ReactNode | false
    action?: ReactNode
  }

const toneIcons = {
  info: IconInfoCircleFilled,
  success: IconCircleCheckFilled,
  warning: IconAlertTriangleFilled,
  error: IconCircleXFilled,
} as const

function Alert({
  className,
  tone = "info",
  title,
  description,
  icon,
  action,
  role,
  ...props
}: AlertProps) {
  const resolvedTone = tone ?? "info"
  const ToneIcon = toneIcons[resolvedTone]
  const iconContent = icon === undefined ? <ToneIcon /> : icon
  const resolvedRole = role ?? (resolvedTone === "warning" || resolvedTone === "error" ? "alert" : "status")

  return (
    <div
      data-slot="alert"
      data-tone={resolvedTone}
      className={cn(alertVariants({ tone: resolvedTone }), action && "has-action", className)}
      role={resolvedRole}
      {...props}
    >
      <div className="vlight-alert__body">
        {iconContent ? (
          <span className="vlight-alert__icon" aria-hidden="true">
            {iconContent}
          </span>
        ) : null}
        <div className="vlight-alert__content">
          <p className="vlight-alert__title">{title}</p>
          {description != null ? <p className="vlight-alert__description">{description}</p> : null}
        </div>
      </div>
      {action ? <div className="vlight-alert__action">{action}</div> : null}
    </div>
  )
}

export { Alert, alertVariants, type AlertProps }
