import { useRef, type KeyboardEvent, type ReactNode } from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"

import { cn } from "@/lib/utils"
import "./tabs.css"

export interface TabItem {
  value: string
  label: string
  icon?: ReactNode
  disabled?: boolean
  content?: ReactNode
}

export interface TabsProps {
  items: readonly TabItem[]
  ariaLabel: string
  className?: string
  listClassName?: string
  panelClassName?: string
  showIcons?: boolean
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
  activateOnFocus?: boolean
  loopFocus?: boolean
}

export function Tabs({
  items,
  ariaLabel,
  className,
  listClassName,
  panelClassName,
  showIcons = true,
  value,
  defaultValue,
  onValueChange,
  activateOnFocus = true,
  loopFocus = true,
}: TabsProps) {
  const tabRefs = useRef(new Map<string, HTMLElement>())
  const initialValue =
    defaultValue ?? items.find((item) => !item.disabled)?.value ?? null

  function handleListKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return
    }

    const enabledItems = items.filter((item) => !item.disabled)
    const currentIndex = enabledItems.findIndex(
      (item) => tabRefs.current.get(item.value) === event.target,
    )

    if (currentIndex < 0 || enabledItems.length === 0) {
      return
    }

    let nextIndex = currentIndex

    if (event.key === "Home") {
      nextIndex = 0
    } else if (event.key === "End") {
      nextIndex = enabledItems.length - 1
    } else {
      const direction = event.key === "ArrowRight" ? 1 : -1
      const candidate = currentIndex + direction
      nextIndex = loopFocus
        ? (candidate + enabledItems.length) % enabledItems.length
        : Math.min(Math.max(candidate, 0), enabledItems.length - 1)
    }

    event.preventDefault()
    event.stopPropagation()
    tabRefs.current.get(enabledItems[nextIndex].value)?.focus()
  }

  return (
    <TabsPrimitive.Root
      className={cn("vlight-tabs", className)}
      value={value}
      defaultValue={value === undefined ? initialValue : undefined}
      onValueChange={(nextValue) => {
        onValueChange?.(typeof nextValue === "string" ? nextValue : null)
      }}
    >
      <TabsPrimitive.List
        aria-label={ariaLabel}
        activateOnFocus={activateOnFocus}
        loopFocus={loopFocus}
        onKeyDownCapture={handleListKeyDown}
        className={cn("vlight-tabs__list", listClassName)}
      >
        {items.map((item) => (
          <TabsPrimitive.Tab
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            ref={(element) => {
              if (element) {
                tabRefs.current.set(item.value, element)
              } else {
                tabRefs.current.delete(item.value)
              }
            }}
            className="vlight-tabs__item"
          >
            {showIcons && item.icon ? (
              <span aria-hidden="true" className="vlight-tabs__icon">
                {item.icon}
              </span>
            ) : null}
            <span className="vlight-tabs__label">{item.label}</span>
          </TabsPrimitive.Tab>
        ))}
      </TabsPrimitive.List>

      {items.map((item) =>
        item.content === undefined ? null : (
          <TabsPrimitive.Panel
            key={item.value}
            value={item.value}
            className={cn("vlight-tabs__panel", panelClassName)}
          >
            {item.content}
          </TabsPrimitive.Panel>
        ),
      )}
    </TabsPrimitive.Root>
  )
}
