/* oxlint-disable react/only-export-components -- public primitive props are exported with the component. */
import type { KeyboardEvent, ReactElement, ReactNode } from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { IconChevronRight } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

import "./menu.css"

type MenuSide = "top" | "bottom" | "left" | "right"
type MenuAlign = "start" | "center" | "end"

function handleMenuNavigation(event: KeyboardEvent<HTMLDivElement>, loopFocus = true) {
  if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
    return
  }

  const enabledItems = Array.from(
    event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]'),
  ).filter((item) => item.getAttribute("aria-disabled") !== "true" && !item.hasAttribute("data-disabled"))
  const currentItem = (event.target as HTMLElement).closest<HTMLElement>('[role="menuitem"]')
  const currentIndex = currentItem ? enabledItems.indexOf(currentItem) : -1

  if (enabledItems.length === 0) {
    return
  }

  let nextIndex = currentIndex

  if (event.key === "Home") {
    nextIndex = 0
  } else if (event.key === "End") {
    nextIndex = enabledItems.length - 1
  } else {
    const direction = event.key === "ArrowDown" ? 1 : -1
    const candidate = currentIndex < 0
      ? direction > 0 ? 0 : enabledItems.length - 1
      : currentIndex + direction
    nextIndex = loopFocus
      ? (candidate + enabledItems.length) % enabledItems.length
      : Math.min(Math.max(candidate, 0), enabledItems.length - 1)
  }

  event.preventDefault()
  event.stopPropagation()
  enabledItems[nextIndex]?.focus()
}

type MenuProps = {
  trigger: ReactElement
  children: ReactNode
  className?: string
  open?: boolean
  defaultOpen?: boolean
  disabled?: boolean
  modal?: boolean
  loopFocus?: boolean
  side?: MenuSide
  align?: MenuAlign
  sideOffset?: number
  onOpenChange?: (open: boolean) => void
}

function Menu({
  trigger,
  children,
  className,
  open,
  defaultOpen,
  disabled = false,
  modal = true,
  loopFocus = true,
  side = "bottom",
  align = "start",
  sideOffset = 8,
  onOpenChange,
}: MenuProps) {
  return (
    <MenuPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      disabled={disabled}
      modal={modal}
      loopFocus={loopFocus}
      highlightItemOnHover={false}
      onOpenChange={(nextOpen) => onOpenChange?.(nextOpen)}
    >
      <MenuPrimitive.Trigger render={trigger} />
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner
          className="vlight-menu__positioner"
          side={side}
          align={align}
          sideOffset={sideOffset}
        >
          <MenuPrimitive.Popup
            className={cn("vlight-menu", className)}
            onKeyDownCapture={(event) => handleMenuNavigation(event, loopFocus)}
          >
            {children}
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  )
}

type MenuItemProps = {
  label: string
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  tone?: "neutral" | "danger"
  disabled?: boolean
  closeOnClick?: boolean
  className?: string
  onSelect?: () => void
}

function MenuItem({
  label,
  leadingIcon,
  trailingIcon,
  tone = "neutral",
  disabled = false,
  closeOnClick = true,
  className,
  onSelect,
}: MenuItemProps) {
  return (
    <MenuPrimitive.Item
      className={cn("vlight-menu__item", className)}
      data-tone={tone}
      label={label}
      disabled={disabled}
      closeOnClick={closeOnClick}
      onClick={onSelect}
    >
      {leadingIcon ? (
        <span className="vlight-menu__icon" aria-hidden="true">{leadingIcon}</span>
      ) : null}
      <span className="vlight-menu__item-label">{label}</span>
      {trailingIcon ? (
        <span className="vlight-menu__icon" aria-hidden="true">{trailingIcon}</span>
      ) : null}
    </MenuPrimitive.Item>
  )
}

type MenuSubmenuProps = {
  label: string
  children: ReactNode
  leadingIcon?: ReactNode
  disabled?: boolean
  className?: string
}

function MenuSubmenu({
  label,
  children,
  leadingIcon,
  disabled = false,
  className,
}: MenuSubmenuProps) {
  return (
    <MenuPrimitive.SubmenuRoot highlightItemOnHover={false}>
      <MenuPrimitive.SubmenuTrigger
        className={cn("vlight-menu__item vlight-menu__submenu-trigger", className)}
        label={label}
        disabled={disabled}
        openOnHover
      >
        {leadingIcon ? (
          <span className="vlight-menu__icon" aria-hidden="true">{leadingIcon}</span>
        ) : null}
        <span className="vlight-menu__item-label">{label}</span>
        <span className="vlight-menu__icon" aria-hidden="true">
          <IconChevronRight />
        </span>
      </MenuPrimitive.SubmenuTrigger>
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner
          className="vlight-menu__positioner"
          side="right"
          align="start"
          sideOffset={4}
        >
          <MenuPrimitive.Popup
            className="vlight-menu"
            onKeyDownCapture={(event) => handleMenuNavigation(event)}
          >
            {children}
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </MenuPrimitive.SubmenuRoot>
  )
}

type MenuGroupProps = {
  label: string
  children: ReactNode
  className?: string
}

function MenuGroup({ label, children, className }: MenuGroupProps) {
  return (
    <MenuPrimitive.Group className={cn("vlight-menu__group", className)}>
      <MenuPrimitive.GroupLabel className="vlight-menu__group-label">
        {label}
      </MenuPrimitive.GroupLabel>
      {children}
    </MenuPrimitive.Group>
  )
}

function MenuDivider({ className }: { className?: string }) {
  return <MenuPrimitive.Separator className={cn("vlight-menu__divider", className)} />
}

export {
  Menu,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuSubmenu,
  type MenuAlign,
  type MenuItemProps,
  type MenuProps,
  type MenuSide,
  type MenuSubmenuProps,
}
