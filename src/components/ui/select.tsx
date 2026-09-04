/* oxlint-disable react/only-export-components -- public prop types are intentionally exported with the component. */
import { useId } from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { IconChevronDown } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

import "./select.css"

type SelectSize = "small" | "medium" | "large"

type SelectOption = {
  label: string
  value: string
  disabled?: boolean
}

type SelectProps = {
  className?: string
  triggerClassName?: string
  label: string
  options: readonly SelectOption[]
  size?: SelectSize
  placeholder?: string
  required?: boolean
  helperText?: string
  errorMessage?: string
  disabled?: boolean
  readOnly?: boolean
  name?: string
  value?: string | null
  defaultValue?: string | null
  open?: boolean
  defaultOpen?: boolean
  onValueChange?: (value: string | null) => void
  onOpenChange?: (open: boolean) => void
}

function Select({
  className,
  triggerClassName,
  label,
  options,
  size = "medium",
  placeholder = "Select an option",
  required = false,
  helperText,
  errorMessage,
  disabled = false,
  readOnly = false,
  name,
  value,
  defaultValue,
  open,
  defaultOpen,
  onValueChange,
  onOpenChange,
}: SelectProps) {
  const generatedId = useId()
  const selectId = `vlight-select-${generatedId}`
  const errorId = `${selectId}-error`
  const helperId = `${selectId}-helper`
  const invalid = Boolean(errorMessage)
  const describedBy = [invalid ? errorId : null, helperText ? helperId : null]
    .filter(Boolean)
    .join(" ")
  const items = options.map(({ label: optionLabel, value: optionValue }) => ({
    label: optionLabel,
    value: optionValue,
  }))

  return (
    <div
      className={cn("vlight-select", className)}
      data-size={size}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
    >
      <SelectPrimitive.Root
        id={selectId}
        items={items}
        name={name}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        value={value}
        defaultValue={defaultValue}
        open={open}
        defaultOpen={defaultOpen}
        onValueChange={(nextValue) => onValueChange?.(nextValue)}
        onOpenChange={(nextOpen) => onOpenChange?.(nextOpen)}
      >
        <SelectPrimitive.Label className="vlight-select__label">
          <span>{label}</span>
          {required && <span className="vlight-select__required" aria-hidden="true">*</span>}
        </SelectPrimitive.Label>

        <SelectPrimitive.Trigger
          className={cn("vlight-select__trigger", triggerClassName)}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy || undefined}
        >
          <SelectPrimitive.Value className="vlight-select__value" placeholder={placeholder} />
          <SelectPrimitive.Icon className="vlight-select__icon">
            <IconChevronDown aria-hidden="true" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Positioner
            className="vlight-select__positioner"
            sideOffset={8}
            align="start"
            alignItemWithTrigger={false}
          >
            <SelectPrimitive.Popup className="vlight-select__popup">
              <SelectPrimitive.List className="vlight-select__list">
                {options.map((option) => (
                  <SelectPrimitive.Item
                    className="vlight-select__item"
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.List>
            </SelectPrimitive.Popup>
          </SelectPrimitive.Positioner>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>

      {invalid && (
        <p className="vlight-select__error" id={errorId}>
          {errorMessage}
        </p>
      )}
      {helperText && (
        <p className="vlight-select__helper" id={helperId}>
          {helperText}
        </p>
      )}
    </div>
  )
}

export { Select, type SelectOption, type SelectProps, type SelectSize }
