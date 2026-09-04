/* oxlint-disable react/only-export-components -- public prop types are intentionally exported with the components. */
import { useId, type ReactNode } from "react"
import { Checkbox as CheckboxPrimitive, type CheckboxRootProps } from "@base-ui/react/checkbox"
import { IconCheck } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

import "./checkbox.css"

type CheckboxFieldStyle = "default" | "box"
type CheckboxControlPlacement = "start" | "end"

type CheckboxControlProps = Omit<
  CheckboxRootProps,
  "children" | "className" | "indeterminate" | "render"
> & {
  className?: string
  invalid?: boolean
}

type CheckboxFieldProps = Omit<
  CheckboxControlProps,
  "aria-describedby" | "aria-label" | "aria-labelledby" | "className"
> & {
  className?: string
  controlClassName?: string
  label: ReactNode
  description?: ReactNode
  fieldStyle?: CheckboxFieldStyle
  controlPlacement?: CheckboxControlPlacement
}

function CheckboxControl({
  className,
  invalid = false,
  disabled,
  readOnly,
  ...props
}: CheckboxControlProps) {
  return (
    <CheckboxPrimitive.Root
      className={cn("vlight-checkbox-control", className)}
      data-invalid={invalid || undefined}
      disabled={disabled}
      readOnly={readOnly}
      aria-invalid={invalid || undefined}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="vlight-checkbox-control__indicator">
        <IconCheck aria-hidden="true" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

function CheckboxField({
  className,
  controlClassName,
  label,
  description,
  fieldStyle = "default",
  controlPlacement = "start",
  invalid = false,
  disabled,
  readOnly,
  id,
  ...props
}: CheckboxFieldProps) {
  const generatedId = useId()
  const checkboxId = id ?? `vlight-checkbox-${generatedId}`
  const labelId = `${checkboxId}-label`
  const descriptionId = description ? `${checkboxId}-description` : undefined

  const control = (
    <span className="vlight-checkbox-field__control-slot">
      <CheckboxControl
        className={controlClassName}
        invalid={invalid}
        disabled={disabled}
        readOnly={readOnly}
        id={checkboxId}
        aria-labelledby={labelId}
        aria-describedby={descriptionId}
        {...props}
      />
    </span>
  )

  return (
    <label
      className={cn("vlight-checkbox-field", className)}
      data-description={description ? "on" : undefined}
      data-disabled={disabled || undefined}
      data-invalid={invalid || undefined}
      data-placement={controlPlacement}
      data-readonly={readOnly || undefined}
      data-style={fieldStyle}
    >
      {controlPlacement === "start" && control}
      <span className="vlight-checkbox-field__content">
        <span className="vlight-checkbox-field__label" id={labelId}>{label}</span>
        {description && (
          <span className="vlight-checkbox-field__description" id={descriptionId}>
            {description}
          </span>
        )}
      </span>
      {controlPlacement === "end" && control}
    </label>
  )
}

export {
  CheckboxControl,
  CheckboxField,
  type CheckboxControlPlacement,
  type CheckboxControlProps,
  type CheckboxFieldProps,
  type CheckboxFieldStyle,
}
