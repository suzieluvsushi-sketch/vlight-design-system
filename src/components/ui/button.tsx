/* oxlint-disable react/only-export-components -- shared component recipes and public prop types are intentional. */
import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { IconChevronDown, IconLoader2 } from "@tabler/icons-react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

import "./button.css"

type ButtonVariant = "primary" | "secondary" | "ghost" | "outlined"
type ButtonTone = "brand" | "neutral" | "danger"
type ButtonSize = "mini" | "small" | "medium" | "large"

const buttonVariants = cva("vlight-button", {
  variants: {
    variant: {
      primary: "is-primary",
      secondary: "is-secondary",
      ghost: "is-ghost",
      outlined: "is-outlined",
    },
    tone: {
      brand: "is-brand",
      neutral: "is-neutral",
      danger: "is-danger",
    },
    size: {
      mini: "is-mini",
      small: "is-small",
      medium: "is-medium",
      large: "is-large",
    },
    iconOnly: {
      true: "is-icon-only",
      false: null,
    },
  },
  defaultVariants: {
    variant: "primary",
    tone: "neutral",
    size: "medium",
    iconOnly: false,
  },
})

type ButtonBaseProps = Omit<ButtonPrimitive.Props, "className"> & {
    className?: string
    leadingIcon?: ReactNode
    trailingIcon?: ReactNode
    loading?: boolean
  }

type TextButtonProps = ButtonBaseProps & {
  variant?: ButtonVariant
  tone?: ButtonTone
  size?: ButtonSize
  iconOnly?: false | null
}

type IconOnlyButtonProps = ButtonBaseProps &
  {
    size?: Exclude<ButtonSize, "mini">
    iconOnly: true
  } & (
    | {
        variant?: "primary" | "secondary"
        tone?: "brand" | "neutral"
      }
    | {
        variant: "ghost"
        tone?: "neutral"
      }
  )

type ButtonProps = TextButtonProps | IconOnlyButtonProps

function Button({
  className,
  variant = "primary",
  tone = "neutral",
  size = "medium",
  iconOnly = false,
  leadingIcon,
  trailingIcon,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const iconOnlyContent = leadingIcon ?? children

  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      data-tone={tone}
      data-size={size}
      data-icon-only={iconOnly || undefined}
      data-loading={loading || undefined}
      className={cn(buttonVariants({ variant, tone, size, iconOnly, className }))}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      <span className="vlight-button__state-layer" aria-hidden="true" />
      {iconOnly ? (
        <span className="vlight-button__icon" aria-hidden="true">
          {loading ? <IconLoader2 className="vlight-button__spinner" /> : iconOnlyContent}
        </span>
      ) : (
        <>
          {(loading || leadingIcon) && (
            <span className="vlight-button__icon" aria-hidden="true">
              {loading ? <IconLoader2 className="vlight-button__spinner" /> : leadingIcon}
            </span>
          )}
          <span className="vlight-button__label">{children}</span>
          {!loading && trailingIcon && (
            <span className="vlight-button__icon" aria-hidden="true">
              {trailingIcon}
            </span>
          )}
        </>
      )}
    </ButtonPrimitive>
  )
}

type SplitButtonMenuItem = {
  label: string
  value: string
  icon?: ReactNode
}

type SplitButtonProps = {
  className?: string
  variant?: "primary" | "secondary"
  size?: "small" | "medium"
  label: string
  menuLabel?: string
  menuItems: SplitButtonMenuItem[]
  leadingIcon?: ReactNode
  triggerIcon?: ReactNode
  loading?: boolean
  disabled?: boolean
  onMainAction?: () => void
  onMenuAction?: (item: SplitButtonMenuItem) => void
}

function SplitButton({
  className,
  variant = "primary",
  size = "small",
  label,
  menuLabel = "Choose an alternative action",
  menuItems,
  leadingIcon,
  triggerIcon,
  loading = false,
  disabled = false,
  onMainAction,
  onMenuAction,
}: SplitButtonProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])
  const menuId = useId()
  const unavailable = disabled || loading

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }

    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [open])

  const openAndFocusFirstItem = () => {
    setOpen(true)
    window.requestAnimationFrame(() => itemRefs.current[0]?.focus())
  }

  const closeAndRestoreFocus = () => {
    setOpen(false)
    triggerRef.current?.focus()
  }

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = itemRefs.current.findIndex((item) => item === document.activeElement)
    let nextIndex = currentIndex

    if (event.key === "ArrowDown") nextIndex = (currentIndex + 1) % menuItems.length
    else if (event.key === "ArrowUp") nextIndex = (currentIndex - 1 + menuItems.length) % menuItems.length
    else if (event.key === "Home") nextIndex = 0
    else if (event.key === "End") nextIndex = menuItems.length - 1
    else if (event.key === "Escape") {
      event.preventDefault()
      closeAndRestoreFocus()
      return
    } else return

    event.preventDefault()
    itemRefs.current[nextIndex]?.focus()
  }

  return (
    <div
      ref={rootRef}
      className={cn("vlight-split-button", className)}
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
    >
      <div className="vlight-split-button__control">
        <button
          className="vlight-split-button__main"
          type="button"
          disabled={unavailable}
          aria-busy={loading || undefined}
          onClick={onMainAction}
        >
          {(loading || leadingIcon) && (
            <span className="vlight-split-button__icon" aria-hidden="true">
              {loading ? <IconLoader2 className="vlight-button__spinner" /> : leadingIcon}
            </span>
          )}
          <span>{label}</span>
        </button>
        <span className="vlight-split-button__divider" aria-hidden="true" />
        <button
          ref={triggerRef}
          className="vlight-split-button__trigger"
          type="button"
          disabled={unavailable}
          aria-label={menuLabel}
          aria-haspopup="menu"
          aria-controls={menuId}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault()
              openAndFocusFirstItem()
            }
            if (event.key === "Escape" && open) {
              event.preventDefault()
              setOpen(false)
            }
          }}
        >
          <span className="vlight-split-button__icon" aria-hidden="true">
            {triggerIcon ?? <IconChevronDown />}
          </span>
        </button>
      </div>

      {open && (
        <div
          className="vlight-split-button__menu"
          id={menuId}
          role="menu"
          aria-label={menuLabel}
          onKeyDown={handleMenuKeyDown}
        >
          {menuItems.map((item, index) => (
            <button
              ref={(node) => {
                itemRefs.current[index] = node
              }}
              className="vlight-split-button__menu-item"
              type="button"
              role="menuitem"
              tabIndex={index === 0 ? 0 : -1}
              key={item.value}
              onClick={() => {
                onMenuAction?.(item)
                setOpen(false)
                triggerRef.current?.focus()
              }}
            >
              {item.icon && <span aria-hidden="true">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export {
  Button,
  SplitButton,
  buttonVariants,
  type ButtonProps,
  type SplitButtonMenuItem,
  type SplitButtonProps,
}
