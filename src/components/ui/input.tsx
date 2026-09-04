/* oxlint-disable react/only-export-components -- public prop types are intentionally exported with the component. */
import { useId, useState } from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { IconEye, IconEyeOff, IconSearch } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

import "./input.css"

type InputKind = "text" | "search" | "password"
type InputSize = "small" | "medium" | "large"

type SharedInputProps = Omit<
  InputPrimitive.Props,
  "className" | "size" | "type"
> & {
  className?: string
  inputClassName?: string
  label: string
  required?: boolean
  helperText?: string
  errorMessage?: string
}

type TextInputProps = SharedInputProps & {
  kind?: "text"
  size?: InputSize
}

type AffordanceInputProps = SharedInputProps & {
  kind: "search" | "password"
  size?: "medium"
}

type InputProps = TextInputProps | AffordanceInputProps

function Input({
  className,
  inputClassName,
  kind = "text",
  size = "medium",
  label,
  required = false,
  helperText,
  errorMessage,
  disabled,
  readOnly,
  id: providedId,
  "aria-describedby": providedDescribedBy,
  ...props
}: InputProps) {
  const generatedId = useId()
  const inputId = providedId ?? `vlight-input-${generatedId}`
  const errorId = `${inputId}-error`
  const helperId = `${inputId}-helper`
  const [passwordVisible, setPasswordVisible] = useState(false)
  const isPassword = kind === "password"
  const isSearch = kind === "search"
  const invalid = Boolean(errorMessage)
  const describedBy = [
    providedDescribedBy,
    invalid ? errorId : null,
    helperText ? helperId : null,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div
      className={cn("vlight-input", className)}
      data-kind={kind}
      data-size={size}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
    >
      <label className="vlight-input__label" htmlFor={inputId}>
        <span>{label}</span>
        {required && <span className="vlight-input__required" aria-hidden="true">*</span>}
      </label>

      <div className="vlight-input__surface">
        {isSearch && (
          <span className="vlight-input__icon" aria-hidden="true">
            <IconSearch />
          </span>
        )}

        <InputPrimitive
          className={cn("vlight-input__control", inputClassName)}
          id={inputId}
          type={isPassword ? (passwordVisible ? "text" : "password") : kind}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy || undefined}
          {...props}
        />

        {isPassword && (
          <button
            className="vlight-input__visibility"
            type="button"
            aria-label={passwordVisible ? "Hide password" : "Show password"}
            aria-controls={inputId}
            disabled={disabled}
            onClick={() => setPasswordVisible((visible) => !visible)}
          >
            {passwordVisible ? <IconEyeOff aria-hidden="true" /> : <IconEye aria-hidden="true" />}
          </button>
        )}
      </div>

      {invalid && (
        <p className="vlight-input__error" id={errorId}>
          {errorMessage}
        </p>
      )}
      {helperText && (
        <p className="vlight-input__helper" id={helperId}>
          {helperText}
        </p>
      )}
    </div>
  )
}

export { Input, type InputKind, type InputProps, type InputSize }
