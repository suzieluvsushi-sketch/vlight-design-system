import {
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type TextareaHTMLAttributes,
} from "react"
import {
  IconArrowUp,
  IconFile,
  IconLoader2,
  IconPaperclip,
  IconPhoto,
  IconPlayerStop,
  IconX,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import "./prompt.css"

const DEFAULT_ACCEPTED_FILE_TYPES = [
  "image/*",
  ".pdf",
  ".docx",
  ".md",
  ".txt",
  ".xlsx",
].join(",")

const fileMatchesAcceptedTypes = (file: File, acceptedFileTypes: string) => {
  const fileName = file.name.toLowerCase()
  const mimeType = file.type.toLowerCase()

  return acceptedFileTypes
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
    .some((value) => {
      if (value.startsWith(".")) return fileName.endsWith(value)
      if (value.endsWith("/*")) return mimeType.startsWith(value.slice(0, -1))
      return mimeType === value
    })
}

type PromptAttachmentType = "file" | "image"
type PromptAttachmentState = "default" | "hover" | "uploading" | "error"

type PromptAttachmentItem = {
  id: string
  name: string
  type: PromptAttachmentType
  state?: PromptAttachmentState
}

type PromptAttachmentProps = PromptAttachmentItem & {
  onRemove?: (id: string) => void
}

function PromptAttachment({
  id,
  name,
  type,
  state = "default",
  onRemove,
}: PromptAttachmentProps) {
  const isUploading = state === "uploading"
  const statusLabel = isUploading
    ? `${name} is uploading`
    : state === "error"
      ? `${name} failed to upload`
      : undefined

  return (
    <div
      className={cn("vlight-prompt-attachment", state === "hover" && "is-hover")}
      data-state={state}
      aria-label={statusLabel}
      aria-live={statusLabel ? "polite" : undefined}
    >
      <span className="vlight-prompt-attachment__media" aria-hidden="true">
        {isUploading ? (
          <IconLoader2 className="vlight-prompt-attachment__spinner" />
        ) : type === "image" ? (
          <IconPhoto />
        ) : (
          <IconFile />
        )}
      </span>
      <span className="vlight-prompt-attachment__name" title={name}>
        {name}
      </span>
      <button
        className="vlight-prompt-attachment__remove"
        type="button"
        aria-label={`Remove ${name}`}
        onClick={() => onRemove?.(id)}
      >
        <IconX aria-hidden="true" />
      </button>
    </div>
  )
}

type PromptAttachmentListProps = {
  attachments: PromptAttachmentItem[]
  onRemove?: (id: string) => void
  className?: string
}

function PromptAttachmentList({
  attachments,
  onRemove,
  className,
}: PromptAttachmentListProps) {
  if (attachments.length === 0) return null

  return (
    <div className={cn("vlight-prompt-attachment-list", className)} role="list">
      {attachments.slice(0, 4).map((attachment) => (
        <div role="listitem" key={attachment.id}>
          <PromptAttachment {...attachment} onRemove={onRemove} />
        </div>
      ))}
    </div>
  )
}

type PromptTextAreaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> & {
  forceFocus?: boolean
  onValueChange?: (value: string) => void
}

function PromptTextArea({
  className,
  forceFocus = false,
  onValueChange,
  ...props
}: PromptTextAreaProps) {
  return (
    <textarea
      className={cn("vlight-prompt-textarea resize-none", forceFocus && "is-focus", className)}
      rows={2}
      onChange={(event) => onValueChange?.(event.currentTarget.value)}
      {...props}
    />
  )
}

type PromptComposerProps = {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onSubmit?: (value: string) => void
  onStop?: () => void
  onUpload?: () => void
  onFilesSelected?: (files: File[]) => void
  attachments?: PromptAttachmentItem[]
  onRemoveAttachment?: (id: string) => void
  placeholder?: string
  ariaLabel?: string
  uploadLabel?: string
  sendLabel?: string
  stopLabel?: string
  acceptedFileTypes?: string
  disabled?: boolean
  running?: boolean
  forceFocus?: boolean
  autoFocus?: boolean
  className?: string
}

function PromptComposer({
  value,
  defaultValue = "",
  onValueChange,
  onSubmit,
  onStop,
  onUpload,
  onFilesSelected,
  attachments = [],
  onRemoveAttachment,
  placeholder = "Ask anything…",
  ariaLabel = "Prompt message",
  uploadLabel = "Add attachment",
  sendLabel = "Send message",
  stopLabel = "Stop response",
  acceptedFileTypes = DEFAULT_ACCEPTED_FILE_TYPES,
  disabled = false,
  running = false,
  forceFocus = false,
  autoFocus = false,
  className,
}: PromptComposerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [internalValue, setInternalValue] = useState(defaultValue)
  const currentValue = value ?? internalValue
  const hasMessage = currentValue.trim().length > 0
  const hasSubmittableContent = hasMessage || attachments.length > 0
  const submitDisabled = disabled || running || !hasSubmittableContent

  const updateValue = (nextValue: string) => {
    if (value === undefined) setInternalValue(nextValue)
    onValueChange?.(nextValue)
  }

  const submit = () => {
    if (submitDisabled) return
    onSubmit?.(currentValue.trim())
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing &&
      !submitDisabled
    ) {
      event.preventDefault()
      submit()
    }
  }

  const handleFilesSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const availableSlots = Math.max(0, 4 - attachments.length)
    const files = Array.from(event.currentTarget.files ?? [])
      .filter((file) => fileMatchesAcceptedTypes(file, acceptedFileTypes))
      .slice(0, availableSlots)
    if (files.length > 0) onFilesSelected?.(files)
    event.currentTarget.value = ""
  }

  return (
    <div
      className={cn("vlight-prompt-composer", forceFocus && "is-focus", className)}
      data-filled={hasSubmittableContent || undefined}
      data-running={running || undefined}
      data-disabled={disabled || undefined}
      aria-busy={running || undefined}
    >
      <PromptAttachmentList attachments={attachments} onRemove={onRemoveAttachment} />

      <PromptTextArea
        value={currentValue}
        onValueChange={updateValue}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label={ariaLabel}
        disabled={disabled}
        autoFocus={autoFocus}
      />

      <div className="vlight-prompt-composer__actions">
        <input
          ref={fileInputRef}
          hidden
          type="file"
          multiple
          accept={acceptedFileTypes}
          aria-label={uploadLabel}
          disabled={disabled || attachments.length >= 4}
          onChange={handleFilesSelected}
        />
        <Button
          type="button"
          variant="ghost"
          tone="neutral"
          size="small"
          iconOnly
          leadingIcon={<IconPaperclip />}
          aria-label={uploadLabel}
          disabled={disabled || attachments.length >= 4}
          onClick={() => {
            if (onUpload) onUpload()
            else fileInputRef.current?.click()
          }}
        />
        <Button
          className="vlight-prompt-composer__submit"
          type="button"
          variant="primary"
          tone="neutral"
          size="small"
          iconOnly
          leadingIcon={running ? <IconPlayerStop /> : <IconArrowUp />}
          aria-label={running ? stopLabel : sendLabel}
          data-action={running ? "stop" : "send"}
          disabled={running ? disabled : submitDisabled}
          onClick={running ? onStop : submit}
        />
      </div>

      {running ? (
        <span className="vlight-prompt-sr-only">Response in progress. Stop response is available.</span>
      ) : null}
    </div>
  )
}

export {
  PromptAttachment,
  PromptAttachmentList,
  PromptComposer,
  PromptTextArea,
  type PromptAttachmentItem,
  type PromptAttachmentProps,
  type PromptAttachmentState,
  type PromptAttachmentType,
  type PromptComposerProps,
  type PromptTextAreaProps,
}
