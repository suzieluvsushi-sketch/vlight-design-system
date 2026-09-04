/* oxlint-disable react/only-export-components -- public prop types are intentionally exported with the components. */
import { useId, type ReactNode } from "react"
import { Radio as RadioPrimitive, type RadioRootProps } from "@base-ui/react/radio"
import {
  RadioGroup as RadioGroupPrimitive,
  type RadioGroupProps as PrimitiveRadioGroupProps,
} from "@base-ui/react/radio-group"

import { cn } from "@/lib/utils"

import "./radio.css"

type RadioTone = "brand" | "neutral"
type RadioFieldStyle = "default" | "box"
type RadioControlPlacement = "start" | "end"

type RadioGroupProps<Value = string> = PrimitiveRadioGroupProps<Value>

type RadioFieldProps<Value = string> = Omit<
  RadioRootProps<Value>,
  "children" | "className" | "render"
> & {
  className?: string
  label: ReactNode
  description?: ReactNode
  tone?: RadioTone
  fieldStyle?: RadioFieldStyle
  controlPlacement?: RadioControlPlacement
  invalid?: boolean
}

function RadioGroup<Value = string>({ className, ...props }: RadioGroupProps<Value>) {
  return <RadioGroupPrimitive className={cn("vlight-radio-group", className)} {...props} />
}

function RadioField<Value = string>({
  className,
  label,
  description,
  tone = "brand",
  fieldStyle = "default",
  controlPlacement = "start",
  invalid = false,
  disabled,
  readOnly,
  id,
  ...props
}: RadioFieldProps<Value>) {
  const generatedId = useId()
  const radioId = id ?? `vlight-radio-${generatedId}`
  const labelId = `${radioId}-label`
  const descriptionId = description ? `${radioId}-description` : undefined

  const control = (
    <span className="vlight-radio-field__control-slot">
      <RadioPrimitive.Root
        className="vlight-radio-control"
        data-invalid={invalid || undefined}
        data-tone={tone}
        disabled={disabled}
        readOnly={readOnly}
        id={radioId}
        aria-labelledby={labelId}
        aria-describedby={descriptionId}
        aria-invalid={invalid || undefined}
        {...props}
      >
        <RadioPrimitive.Indicator className="vlight-radio-control__indicator" keepMounted />
      </RadioPrimitive.Root>
    </span>
  )

  return (
    <label
      className={cn("vlight-radio-field", className)}
      data-disabled={disabled || undefined}
      data-invalid={invalid || undefined}
      data-placement={controlPlacement}
      data-readonly={readOnly || undefined}
      data-style={fieldStyle}
    >
      {controlPlacement === "start" && control}
      <span className="vlight-radio-field__content">
        <span className="vlight-radio-field__label" id={labelId}>{label}</span>
        {description && (
          <span className="vlight-radio-field__description" id={descriptionId}>
            {description}
          </span>
        )}
      </span>
      {controlPlacement === "end" && control}
    </label>
  )
}

export {
  RadioField,
  RadioGroup,
  type RadioControlPlacement,
  type RadioFieldProps,
  type RadioFieldStyle,
  type RadioGroupProps,
  type RadioTone,
}
