import { useEffect, useState, type ReactNode } from "react"

import { DocumentationAlert, useDocumentationAlert } from "@/components/docs/documentation-alert"
import {
  AiMessage,
  MessageInlineCitation,
  MessageReasoning,
  MessageSource,
  MessageSources,
  MessageStatus,
  UserMessage,
  type MessageSourceItem,
} from "@/components/ui/message"

import "./message-page.css"

const userCopy = "Summarize the attached report and pull out the three biggest risks. Thank you."
const aiCopy = "Here are the three biggest risks from the report: retention is down 8%, acquisition cost rose 22%, and gross margin slipped below target."
const editHintStorageKey = "vlight-message-edit-hint-seen"

const messagePropsRows = [
  ["UserMessage.text / timestamp", "string"],
  ["UserMessage.state", "default | hover | edit"],
  ["UserMessage.editHint / showEditHint", "string / boolean"],
  ["UserMessage.autoFocusEdit", "boolean"],
  ["UserMessage.onCopy", "(text: string) => void"],
  ["UserMessage.onEdit / onCancel", "() => void"],
  ["UserMessage.onConfirm", "(text: string) => void"],
  ["AiMessage.text / children", "string / ReactNode"],
  ["AiMessage.status", "default | stopped | error"],
  ["AiMessage.showActions / timestamp", "boolean / string"],
  ["AiMessage.errorMessage", "string"],
  ["AiMessage.sources / sourcesState", "MessageSourceItem[] / collapsed | expanded"],
  ["AiMessage.onAction", "copy | like | dislike | regenerate"],
  ["MessageSource.source / leadingIndex", "MessageSourceItem / number"],
  ["MessageSource.state", "default | hover | focus"],
  ["MessageSources.sources / state", "MessageSourceItem[] / collapsed | expanded"],
  ["MessageSources.onStateChange", "(state: collapsed | expanded) => void"],
  ["MessageInlineCitation.index / source", "number / MessageSourceItem"],
  ["MessageInlineCitation.state / forcePreview", "default | hover | focus / boolean"],
  ["MessageReasoning.summary / state", "string / collapsed | expanded"],
  ["MessageStatus.status", "thinking | generating | searching"],
] as const

const sources: MessageSourceItem[] = [
  {
    id: "openai",
    label: "OpenAI Research",
    title: "Customer Retention 2026",
    description: "Retention declined for two and three consecutive quarters. The said retention trend is the largest risk.",
    favicon: "./message-assets/openai.png",
  },
  {
    id: "assistant-ui",
    label: "assistant-ui",
    title: "Assistant UI patterns",
    description: "Interaction guidance for composable AI response interfaces.",
    favicon: "./message-assets/assistant-ui.png",
  },
  {
    id: "figma",
    label: "Figma Docs",
    title: "Figma component source",
    description: "The canonical Message component set and its documented variants.",
    favicon: "./message-assets/figma.png",
  },
]

function ExampleCard({ title, children, wide = false }: { title: string; children: ReactNode; wide?: boolean }) {
  return (
    <article className={`message-example-card${wide ? " is-wide" : ""}`}>
      <div className="message-example-meta">
        <h3>{title}</h3>
      </div>
      <div className="message-example-preview">{children}</div>
    </article>
  )
}

function Specimen({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="message-specimen">
      <div className="message-specimen__content">{children}</div>
      <span className="message-specimen__label">{label}</span>
    </div>
  )
}

function CitedResponse() {
  return (
    <>
      Customer retention declined for two consecutive quarters. <MessageInlineCitation index={1} source={sources[0]} />{" "}
      While acquisition costs increased by 22%. <MessageInlineCitation index={2} source={sources[1]} />{" "}
      Gross margin slipped below target. <MessageInlineCitation index={3} source={sources[2]} />
    </>
  )
}

export function MessagePage() {
  const [status, setStatus] = useState("")
  const { notice, showAlert, dismissAlert } = useDocumentationAlert()
  const [conversationUserText, setConversationUserText] = useState(userCopy)
  const [conversationUserEditing, setConversationUserEditing] = useState(false)
  const [conversationSourcesState, setConversationSourcesState] = useState<"collapsed" | "expanded">("collapsed")
  const [userMessageText, setUserMessageText] = useState(userCopy)
  const [hoverMessageEditing, setHoverMessageEditing] = useState(false)
  const [userMessageEditing, setUserMessageEditing] = useState(true)
  const [userMessageEditAutoFocus, setUserMessageEditAutoFocus] = useState(false)
  const [showEditHint, setShowEditHint] = useState(() => {
    try {
      return sessionStorage.getItem(editHintStorageKey) !== "true"
    } catch {
      return true
    }
  })
  const [reasoningState, setReasoningState] = useState<"collapsed" | "expanded">("collapsed")
  const [sourcesState, setSourcesState] = useState<"collapsed" | "expanded">("collapsed")

  useEffect(() => {
    document.title = "Message · VLight Design System"
  }, [])

  const announce = (message: string) => setStatus(message)
  const copyUserMessage = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      showAlert("Message copied", "success")
    } catch {
      showAlert("Copy unavailable", "error", "Allow clipboard access and try again.")
    }
  }
  const handleConversationAiAction = async (action: "copy" | "like" | "dislike" | "regenerate") => {
    if (action === "copy") {
      try {
        await navigator.clipboard.writeText(aiCopy)
        showAlert("Response copied", "success")
      } catch {
        showAlert("Copy unavailable", "error", "Allow clipboard access and try again.")
      }
      return
    }

    const feedback = {
      like: "Response liked",
      dislike: "Response disliked",
      regenerate: "Regenerate selected",
    }[action]
    showAlert(feedback, "success")
  }
  const dismissEditHint = () => {
    setShowEditHint(false)
    try {
      sessionStorage.setItem(editHintStorageKey, "true")
    } catch {
      // The hint still dismisses when session storage is unavailable.
    }
  }

  return (
    <article className="docs-page message-page">
      <div className="page-intro message-hero">
        <div className="message-hero-copy">
          <h1 className="docs-hero-title" id="message-title">Message</h1>
          <p>Conversation messages for user input, AI progress, reasoning, and response actions.</p>
        </div>
        <div className="message-hero-art" aria-hidden="true">
          <div className="message-hero-artwork-frame">
            <img
              className="message-hero-image"
              src="./message-assets/message-hero.png"
              srcSet="./message-assets/message-hero.png 1x, ./message-assets/message-hero@2x.png 2x"
              alt=""
            />
          </div>
        </div>
      </div>

      <section className="page-section" id="when-to-use" aria-labelledby="message-when-to-use-title">
        <div className="section-heading">
          <h2 id="message-when-to-use-title">When to use</h2>
          <p>Use Message to present user input, AI responses, progress, reasoning, citations, and response actions in a conversation.</p>
        </div>
      </section>

      <section className="page-section message-page-section" id="examples" aria-labelledby="message-examples-title">
        <div className="section-heading">
          <h2 id="message-examples-title">Examples</h2>
          <p>Explore user and AI message states, sources, citations, reasoning, and actions using the real components.</p>
        </div>
        <div className="message-example-grid">
            <ExampleCard title="One-turn conversation" wide>
              <div className="message-conversation-example">
                <UserMessage
                  text={conversationUserText}
                  className="message-conversation-instance"
                  state={conversationUserEditing ? "edit" : "default"}
                  onCopy={copyUserMessage}
                  onEdit={() => {
                    setConversationUserEditing(true)
                    announce("Conversation message edit selected")
                  }}
                  onCancel={() => {
                    setConversationUserEditing(false)
                    announce("Conversation message edit cancelled")
                  }}
                  onConfirm={(text) => {
                    setConversationUserText(text)
                    setConversationUserEditing(false)
                    announce("Conversation message updated")
                  }}
                />
                <AiMessage
                  showActions
                  className="message-conversation-instance"
                  sources={sources}
                  sourcesState={conversationSourcesState}
                  onSourcesStateChange={setConversationSourcesState}
                  onSourceSelect={(source) => {
                    showAlert(`${source.label} selected`, "info")
                  }}
                  onAction={handleConversationAiAction}
                >
                  <CitedResponse />
                </AiMessage>
              </div>
            </ExampleCard>

            <ExampleCard title="User Message" wide>
              <div className="message-source-stack is-subtle is-message-centered">
                <Specimen label="Default">
                  <UserMessage text={userMessageText} />
                </Specimen>
                <Specimen label={hoverMessageEditing ? "Edit · From hover" : "Hover · Actions on"}>
                  <UserMessage
                    text={userMessageText}
                    state={hoverMessageEditing ? "edit" : "hover"}
                    onCopy={copyUserMessage}
                    onEdit={() => {
                      dismissEditHint()
                      setHoverMessageEditing(true)
                      announce("Edit selected")
                    }}
                    onCancel={() => {
                      setHoverMessageEditing(false)
                      announce("Edit cancelled; message returned to hover")
                    }}
                    onConfirm={(text) => {
                      setUserMessageText(text)
                      setHoverMessageEditing(false)
                      announce("Edit saved; message returned to hover")
                    }}
                  />
                </Specimen>
                <Specimen label={userMessageEditing ? "Edit · Interactive" : "Default · Actions on hover"}>
                  <UserMessage
                    text={userMessageText}
                    state={userMessageEditing ? "edit" : "default"}
                    autoFocusEdit={userMessageEditAutoFocus}
                    editHint="try to edit this message"
                    showEditHint={showEditHint}
                    onEditHintDismiss={dismissEditHint}
                    onCopy={copyUserMessage}
                    onEdit={() => {
                      setUserMessageEditAutoFocus(true)
                      setUserMessageEditing(true)
                      announce("Edit selected")
                    }}
                    onCancel={() => {
                      setUserMessageEditAutoFocus(false)
                      setUserMessageEditing(false)
                      announce("Edit cancelled; message returned to default")
                    }}
                    onConfirm={(text) => {
                      setUserMessageText(text)
                      setUserMessageEditAutoFocus(false)
                      setUserMessageEditing(false)
                      announce("Edit saved; message returned to default")
                    }}
                  />
                </Specimen>
              </div>
            </ExampleCard>

            <ExampleCard title="AI Message" wide>
              <div className="message-variant-board is-message-centered">
                <Specimen label="Default · Actions off">
                  <AiMessage text={aiCopy} />
                </Specimen>
                <Specimen label="Default · Actions on">
                  <AiMessage text={aiCopy} showActions onAction={(action) => announce(`${action} selected`)} />
                </Specimen>
                <Specimen label="Default · Citations · Sources · Actions on">
                  <AiMessage
                    showActions
                    sources={sources}
                    onAction={(action) => announce(`${action} selected`)}
                  >
                    <CitedResponse />
                  </AiMessage>
                </Specimen>
                <Specimen label="Default · Citations · Sources expanded · Actions on">
                  <AiMessage
                    showActions
                    sources={sources}
                    sourcesState="expanded"
                    onAction={(action) => announce(`${action} selected`)}
                    onSourceSelect={(source) => announce(`${source.label} selected`)}
                  >
                    <CitedResponse />
                  </AiMessage>
                </Specimen>
                <Specimen label="Stopped · Actions on">
                  <AiMessage
                    text={`${aiCopy.slice(0, 102)}…`}
                    status="stopped"
                    showActions
                    onAction={(action) => announce(`${action} selected`)}
                  />
                </Specimen>
                <Specimen label="Error · Regenerate">
                  <AiMessage status="error" showActions onAction={() => announce("Regenerate selected")} />
                </Specimen>
              </div>
            </ExampleCard>

            <ExampleCard title="Reasoning">
              <div className="message-source-stack is-subtle">
                <MessageReasoning />
                <MessageReasoning state="expanded" />
                <div className="message-interactive-sample">
                  <span>Interactive</span>
                  <MessageReasoning state={reasoningState} onStateChange={setReasoningState} />
                </div>
              </div>
            </ExampleCard>

            <ExampleCard title="Status">
              <div className="message-status-stack">
                <MessageStatus status="thinking" />
                <MessageStatus status="generating" />
                <MessageStatus status="searching" />
              </div>
            </ExampleCard>

            <ExampleCard title="Inline Citation">
              <div className="message-citation-states">
                <Specimen label="Default">
                  <MessageInlineCitation index={1} source={sources[0]} />
                </Specimen>
                <Specimen label="Hover">
                  <MessageInlineCitation index={1} source={sources[0]} state="hover" />
                </Specimen>
                <Specimen label="Focus">
                  <MessageInlineCitation index={1} source={sources[0]} state="focus" />
                </Specimen>
              </div>
            </ExampleCard>

            <ExampleCard title="Citation preview">
              <div className="message-citation-preview-stage">
                <MessageInlineCitation index={1} source={sources[0]} state="hover" forcePreview />
              </div>
            </ExampleCard>

            <ExampleCard title="Sources" wide>
              <div className="message-sources-board">
                <div className="message-source-state-row">
                  <MessageSource source={sources[0]} />
                  <MessageSource source={sources[0]} state="hover" />
                  <MessageSource source={sources[0]} state="focus" />
                  {sources.map((source) => <MessageSource source={source} key={source.id} />)}
                </div>
                <MessageSources sources={sources} />
                <MessageSources sources={sources} state="expanded" />
                <div className="message-interactive-sample">
                  <span>Interactive</span>
                  <MessageSources
                    sources={sources}
                    state={sourcesState}
                    onStateChange={setSourcesState}
                    onSourceSelect={(source) => announce(`${source.label} selected`)}
                  />
                </div>
              </div>
            </ExampleCard>
        </div>

        <output className="message-page-status" aria-live="polite">{status}</output>
      </section>

      <section className="page-section message-props-section" id="message-props" aria-labelledby="message-props-title">
        <div className="section-heading">
          <h2 id="message-props-title">Props quick reference</h2>
          <p>User, AI, source, citation, reasoning, and status props used by the Message component family.</p>
        </div>
        <div className="reference-table-shell" tabIndex={0} aria-label="Message props quick reference">
          <table className="reference-table message-props-table">
            <thead>
              <tr><th>Property</th><th>Supported values</th></tr>
            </thead>
            <tbody>
              {messagePropsRows.map(([property, values]) => (
                <tr key={property}><td><code>{property}</code></td><td>{values}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <DocumentationAlert notice={notice} onDismiss={dismissAlert} />
    </article>
  )
}
