import { useCallback, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"
import {
  IconChevronDown,
  IconChevronRight,
  IconCopy,
  IconEdit,
  IconLoader2,
  IconRefresh,
  IconSearch,
  IconSparkles,
  IconThumbDown,
  IconThumbUp,
  IconWorld,
  IconX,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { PromptTextArea } from "@/components/ui/prompt"
import { cn } from "@/lib/utils"

import "./message.css"

type UserMessageState = "default" | "hover" | "edit"
type AiMessageStatus = "default" | "stopped" | "error"
type MessageProgressStatus = "thinking" | "generating" | "searching"
type MessageDisclosureState = "collapsed" | "expanded"
type MessageSourceState = "default" | "hover" | "focus"

type MessageSourceItem = {
  id: string
  label: string
  title?: string
  description?: string
  favicon?: string
}

type UserMessageProps = {
  text: string
  state?: UserMessageState
  timestamp?: string
  editHint?: string
  showEditHint?: boolean
  autoFocusEdit?: boolean
  className?: string
  onCopy?: (text: string) => void
  onEdit?: () => void
  onEditHintDismiss?: () => void
  onCancel?: () => void
  onConfirm?: (text: string) => void
}

function UserMessage({
  text,
  state = "default",
  timestamp = "2:14 PM",
  editHint,
  showEditHint = false,
  autoFocusEdit = true,
  className,
  onCopy,
  onEdit,
  onEditHintDismiss,
  onCancel,
  onConfirm,
}: UserMessageProps) {
  const [draft, setDraft] = useState(text)
  const editHintId = useId()
  const hasActions = state === "hover" || Boolean(onCopy || onEdit)

  const cancelEdit = () => {
    setDraft(text)
    onCancel?.()
  }

  const confirmEdit = () => {
    const nextText = draft.trim()
    if (nextText) onConfirm?.(nextText)
  }

  if (state === "edit") {
    return (
      <div className={cn("vlight-user-message is-edit", className)}>
        <PromptTextArea
          className="vlight-user-message__editor"
          aria-label="Edit message"
          aria-describedby={showEditHint && editHint ? editHintId : undefined}
          value={draft}
          rows={2}
          autoFocus={autoFocusEdit}
          onValueChange={setDraft}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault()
              cancelEdit()
            }
            if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
              event.preventDefault()
              confirmEdit()
            }
          }}
        />
        <div className="vlight-user-message__edit-actions">
          <Button
            type="button"
            variant="outlined"
            tone="neutral"
            size="small"
            onClick={cancelEdit}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            tone="neutral"
            size="small"
            disabled={!draft.trim()}
            onClick={confirmEdit}
          >
            OK
          </Button>
        </div>
        {showEditHint && editHint ? (
          <span className="vlight-user-message__edit-hint is-editor-hint" role="dialog" aria-label="Edit message hint">
            <span id={editHintId}>{editHint}</span>
            <button
              className="vlight-user-message__edit-hint-close"
              type="button"
              aria-label="Close edit message hint"
              onClick={onEditHintDismiss}
            >
              <IconX aria-hidden="true" />
            </button>
          </span>
        ) : null}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "vlight-user-message",
        state === "hover" && "is-hover",
        state !== "hover" && hasActions && "is-interactive",
        className,
      )}
    >
      <div className="vlight-user-message__content">
        <div className="vlight-user-message__bubble">{text}</div>
        {hasActions ? (
          <div className="vlight-message-actions" aria-label="User message actions">
            <Button
              type="button"
              variant="ghost"
              tone="neutral"
              size="small"
              iconOnly
              leadingIcon={<IconCopy />}
              aria-label="Copy message"
              onClick={() => onCopy?.(text)}
            />
            <span className="vlight-user-message__edit-control">
              <Button
                type="button"
                variant="ghost"
                tone="neutral"
                size="small"
                iconOnly
                leadingIcon={<IconEdit />}
                aria-label="Edit message"
                aria-describedby={showEditHint && editHint ? editHintId : undefined}
                onClick={onEdit}
              />
              {showEditHint && editHint ? (
                <span className="vlight-user-message__edit-hint" role="dialog" aria-label="Edit message hint">
                  <span id={editHintId}>{editHint}</span>
                  <button
                    className="vlight-user-message__edit-hint-close"
                    type="button"
                    aria-label="Close edit message hint"
                    onClick={onEditHintDismiss}
                  >
                    <IconX aria-hidden="true" />
                  </button>
                </span>
              ) : null}
            </span>
            <span className="vlight-message-timestamp">{timestamp}</span>
          </div>
        ) : null}
      </div>
    </div>
  )
}

type MessageSourceProps = {
  source: MessageSourceItem
  state?: MessageSourceState
  leadingIndex?: number
  className?: string
  onSelect?: (source: MessageSourceItem) => void
}

function MessageSource({
  source,
  state = "default",
  leadingIndex,
  className,
  onSelect,
}: MessageSourceProps) {
  const content = (
    <>
      {source.favicon ? (
        <img className="vlight-message-source__favicon" src={source.favicon} alt="" />
      ) : (
        <IconWorld aria-hidden="true" />
      )}
      <span>{leadingIndex ? `${leadingIndex} · ` : ""}{source.label}</span>
    </>
  )

  if (!onSelect) {
    return (
      <span className={cn("vlight-message-source", `is-${state}`, className)}>
        {content}
      </span>
    )
  }

  return (
    <button
      className={cn("vlight-message-source", `is-${state}`, className)}
      type="button"
      onClick={() => onSelect(source)}
    >
      {content}
    </button>
  )
}

type MessageSourcesProps = {
  sources: MessageSourceItem[]
  state?: MessageDisclosureState
  className?: string
  onStateChange?: (state: MessageDisclosureState) => void
  onSourceSelect?: (source: MessageSourceItem) => void
}

function MessageSources({
  sources,
  state,
  className,
  onStateChange,
  onSourceSelect,
}: MessageSourcesProps) {
  const [internalState, setInternalState] = useState<MessageDisclosureState>("collapsed")
  const currentState = state ?? internalState
  const expanded = currentState === "expanded"
  const contentId = useId()

  const toggle = () => {
    const nextState = expanded ? "collapsed" : "expanded"
    if (state === undefined) setInternalState(nextState)
    onStateChange?.(nextState)
  }

  return (
    <div className={cn("vlight-message-sources", className)}>
      <button
        className="vlight-message-sources__trigger"
        type="button"
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={toggle}
      >
        <IconWorld aria-hidden="true" />
        <span>Sources</span>
        {expanded ? <IconChevronDown aria-hidden="true" /> : <IconChevronRight aria-hidden="true" />}
      </button>
      {expanded ? (
        <div className="vlight-message-sources__list" id={contentId}>
          {sources.map((source, index) => (
            <MessageSource
              source={source}
              leadingIndex={index + 1}
              onSelect={onSourceSelect}
              key={source.id}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

type MessageInlineCitationProps = {
  index: number
  source?: MessageSourceItem
  state?: MessageSourceState
  forcePreview?: boolean
  className?: string
  onSelect?: (source?: MessageSourceItem) => void
}

function MessageInlineCitation({
  index,
  source,
  state = "default",
  forcePreview = false,
  className,
  onSelect,
}: MessageInlineCitationProps) {
  const previewId = useId()
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [previewPosition, setPreviewPosition] = useState({ left: 0, top: 0, visible: false })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const previewRef = useRef<HTMLSpanElement>(null)
  const showPreview = Boolean(source) && (forcePreview || hovered || focused)

  const updatePreviewPosition = useCallback(() => {
    const trigger = triggerRef.current
    const preview = previewRef.current
    if (!trigger || !preview) return

    const rootStyles = getComputedStyle(document.documentElement)
    const gap = Number.parseFloat(rootStyles.getPropertyValue("--layout-spacing-2"))
    const viewportPadding = Number.parseFloat(rootStyles.getPropertyValue("--layout-spacing-3"))
    const triggerRect = trigger.getBoundingClientRect()
    const previewRect = preview.getBoundingClientRect()
    const safeGap = Number.isFinite(gap) ? gap : 8
    const safePadding = Number.isFinite(viewportPadding) ? viewportPadding : 12

    let left = triggerRect.right + safeGap
    if (left + previewRect.width > window.innerWidth - safePadding) {
      left = triggerRect.left - previewRect.width - safeGap
    }

    left = Math.min(
      Math.max(safePadding, left),
      Math.max(safePadding, window.innerWidth - previewRect.width - safePadding),
    )

    setPreviewPosition({
      left: left + window.scrollX,
      top: triggerRect.top + window.scrollY,
      visible: true,
    })
  }, [])

  useLayoutEffect(() => {
    if (!showPreview) return

    updatePreviewPosition()
    window.addEventListener("resize", updatePreviewPosition)

    return () => {
      window.removeEventListener("resize", updatePreviewPosition)
    }
  }, [showPreview, updatePreviewPosition])

  const preview = showPreview && source && typeof document !== "undefined"
    ? createPortal(
        <span
          className="vlight-inline-citation__preview"
          id={previewId}
          ref={previewRef}
          role="tooltip"
          style={{
            left: previewPosition.left,
            top: previewPosition.top,
            visibility: previewPosition.visible ? "visible" : "hidden",
          }}
        >
          <MessageSource source={source} />
          <strong>{source.title ?? source.label}</strong>
          {source.description ? <span>{source.description}</span> : null}
        </span>,
        document.body,
      )
    : null

  return (
    <span className={cn("vlight-inline-citation", className)}>
      <button
        className={cn("vlight-inline-citation__trigger", `is-${state}`)}
        type="button"
        ref={triggerRef}
        aria-label={`Open citation ${index}${source ? `: ${source.label}` : ""}`}
        aria-describedby={showPreview ? previewId : undefined}
        aria-expanded={source ? showPreview : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setHovered(false)
            setFocused(false)
          }
        }}
        onClick={(event) => {
          onSelect?.(source)
          if (event.detail > 0) event.currentTarget.blur()
        }}
      >
        {index}
      </button>
      {preview}
    </span>
  )
}

type AiMessageProps = {
  text?: string
  children?: ReactNode
  status?: AiMessageStatus
  showActions?: boolean
  timestamp?: string
  errorMessage?: string
  sources?: MessageSourceItem[]
  sourcesState?: MessageDisclosureState
  className?: string
  onAction?: (action: "copy" | "like" | "dislike" | "regenerate") => void
  onSourcesStateChange?: (state: MessageDisclosureState) => void
  onSourceSelect?: (source: MessageSourceItem) => void
}

function AiMessage({
  text = "Here are the three biggest risks from the report: retention is down 8%, acquisition cost rose 22%, and gross margin slipped below target.",
  children,
  status = "default",
  showActions = false,
  timestamp = "2:14 PM",
  errorMessage = "Something went wrong. Try again.",
  sources = [],
  sourcesState = "collapsed",
  className,
  onAction,
  onSourcesStateChange,
  onSourceSelect,
}: AiMessageProps) {
  const isError = status === "error"

  return (
    <div className={cn("vlight-ai-message", `is-${status}`, className)}>
      {isError ? (
        <div className="vlight-ai-message__error" role="alert">{errorMessage}</div>
      ) : (
        <div className="vlight-ai-message__content">
          <div className="vlight-ai-message__response">{children ?? text}</div>
          {status === "stopped" ? (
            <span className="vlight-ai-message__stopped">Response stopped.</span>
          ) : null}
          {sources.length > 0 ? (
            <MessageSources
              sources={sources}
              state={sourcesState}
              onStateChange={onSourcesStateChange}
              onSourceSelect={onSourceSelect}
            />
          ) : null}
        </div>
      )}

      {showActions ? (
        <div className="vlight-message-actions" aria-label="AI message actions">
          {isError ? (
            <Button
              type="button"
              variant="ghost"
              tone="neutral"
              size="small"
              iconOnly
              leadingIcon={<IconRefresh />}
              aria-label="Regenerate response"
              onClick={() => onAction?.("regenerate")}
            />
          ) : (
            <>
              <Button
                type="button"
                variant="ghost"
                tone="neutral"
                size="small"
                iconOnly
                leadingIcon={<IconCopy />}
                aria-label="Copy response"
                onClick={() => onAction?.("copy")}
              />
              <Button
                type="button"
                variant="ghost"
                tone="neutral"
                size="small"
                iconOnly
                leadingIcon={<IconThumbUp />}
                aria-label="Like response"
                onClick={() => onAction?.("like")}
              />
              <Button
                type="button"
                variant="ghost"
                tone="neutral"
                size="small"
                iconOnly
                leadingIcon={<IconThumbDown />}
                aria-label="Dislike response"
                onClick={() => onAction?.("dislike")}
              />
              <Button
                type="button"
                variant="ghost"
                tone="neutral"
                size="small"
                iconOnly
                leadingIcon={<IconRefresh />}
                aria-label="Regenerate response"
                onClick={() => onAction?.("regenerate")}
              />
              <span className="vlight-message-timestamp">{timestamp}</span>
            </>
          )}
        </div>
      ) : null}
    </div>
  )
}

type MessageReasoningProps = {
  summary?: string
  state?: MessageDisclosureState
  className?: string
  onStateChange?: (state: MessageDisclosureState) => void
}

function MessageReasoning({
  summary = "The report shows retention declining for two quarters. I compared the key metrics and surfaced the three largest risks.",
  state,
  className,
  onStateChange,
}: MessageReasoningProps) {
  const [internalState, setInternalState] = useState<MessageDisclosureState>("collapsed")
  const currentState = state ?? internalState
  const expanded = currentState === "expanded"
  const summaryId = useId()

  const toggle = () => {
    const nextState = expanded ? "collapsed" : "expanded"
    if (state === undefined) setInternalState(nextState)
    onStateChange?.(nextState)
  }

  return (
    <div className={cn("vlight-message-reasoning", className)}>
      <button
        className="vlight-message-reasoning__trigger"
        type="button"
        aria-expanded={expanded}
        aria-controls={summaryId}
        onClick={toggle}
      >
        {expanded ? <IconChevronDown aria-hidden="true" /> : <IconChevronRight aria-hidden="true" />}
        <IconSparkles aria-hidden="true" />
        <span>Thought for 4s</span>
      </button>
      {expanded ? <p id={summaryId}>{summary}</p> : null}
    </div>
  )
}

type MessageStatusProps = {
  status?: MessageProgressStatus
  className?: string
}

function MessageStatus({ status = "thinking", className }: MessageStatusProps) {
  const copy = {
    thinking: "Thinking…",
    generating: "Generating…",
    searching: "Searching the web…",
  }[status]

  return (
    <div className={cn("vlight-message-status", `is-${status}`, className)} role="status">
      {status === "thinking" ? <IconSparkles aria-hidden="true" /> : null}
      {status === "generating" ? <IconLoader2 className="vlight-message-status__spinner" aria-hidden="true" /> : null}
      {status === "searching" ? <IconSearch aria-hidden="true" /> : null}
      <span>{copy}</span>
    </div>
  )
}

export {
  AiMessage,
  MessageInlineCitation,
  MessageReasoning,
  MessageSource,
  MessageSources,
  MessageStatus,
  UserMessage,
  type AiMessageProps,
  type AiMessageStatus,
  type MessageDisclosureState,
  type MessageInlineCitationProps,
  type MessageProgressStatus,
  type MessageReasoningProps,
  type MessageSourceItem,
  type MessageSourceProps,
  type MessageSourceState,
  type MessageSourcesProps,
  type MessageStatusProps,
  type UserMessageProps,
  type UserMessageState,
}
