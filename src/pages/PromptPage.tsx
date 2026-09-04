import { useEffect, useState, type ReactNode } from "react"

import {
  PromptAttachment,
  PromptAttachmentList,
  PromptComposer,
  type PromptAttachmentItem,
  type PromptAttachmentState,
  type PromptAttachmentType,
} from "@/components/ui/prompt"

import "./prompt-page.css"

const sampleMessage = "Help me summarize the key findings in this report."

const initialAttachments: PromptAttachmentItem[] = [
  { id: "report", name: "Q3-report.pdf", type: "file" },
  { id: "chart", name: "Revenue-chart.png", type: "image" },
]

const uploadSamples = [
  { name: "Research-notes.txt", type: "file" as const },
  { name: "Dashboard-preview.png", type: "image" as const },
]

const promptPropsRows = [
  ["PromptComposer.value / defaultValue", "string"],
  ["PromptComposer.attachments", "PromptAttachmentItem[] · up to 4"],
  ["PromptComposer.disabled / running", "boolean"],
  ["PromptComposer.placeholder / ariaLabel", "string"],
  ["PromptComposer.uploadLabel / sendLabel / stopLabel", "string"],
  ["PromptComposer.acceptedFileTypes", "string · native input accept value"],
  ["PromptComposer.forceFocus / autoFocus", "boolean"],
  ["PromptComposer.onValueChange / onSubmit", "(value: string) => void"],
  ["PromptComposer.onStop / onUpload", "() => void"],
  ["PromptComposer.onFilesSelected", "(files: File[]) => void"],
  ["PromptComposer.onRemoveAttachment", "(id: string) => void"],
  ["PromptAttachment.id / name", "string"],
  ["PromptAttachment.type", "file | image"],
  ["PromptAttachment.state", "default | hover | uploading | error"],
  ["PromptAttachmentList.attachments", "PromptAttachmentItem[] · renders the first 4"],
  ["PromptTextArea.forceFocus", "boolean"],
  ["PromptTextArea.onValueChange", "(value: string) => void"],
] as const

function ExampleCard({
  title,
  children,
  wide = false,
}: {
  title: string
  children: ReactNode
  wide?: boolean
}) {
  return (
    <article className={`prompt-example-card${wide ? " is-wide" : ""}`}>
      <div className="prompt-example-meta">
        <h2>{title}</h2>
      </div>
      <div className="prompt-example-preview">{children}</div>
    </article>
  )
}

function Specimen({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="prompt-specimen">
      <span className="prompt-specimen__label">{label}</span>
      {children}
    </div>
  )
}

export function PromptPage() {
  const [message, setMessage] = useState("")
  const [attachments, setAttachments] = useState(initialAttachments)
  const [running, setRunning] = useState(false)
  const [status, setStatus] = useState("The live composer is ready.")

  useEffect(() => {
    document.title = "Prompt · VLight Design System"
  }, [])

  useEffect(() => {
    if (!running) return

    const timeout = window.setTimeout(() => {
      setRunning(false)
      setStatus("Response complete. The composer is ready for another message.")
    }, 1400)

    return () => window.clearTimeout(timeout)
  }, [running])

  const removeAttachment = (id: string) => {
    const attachment = attachments.find((item) => item.id === id)
    setAttachments((current) => current.filter((item) => item.id !== id))
    if (attachment) setStatus(`${attachment.name} removed.`)
  }

  const addDemoAttachments = (files: File[]) => {
    const additions = files.map((file, index) => ({
      id: `${file.name}-${file.lastModified}-${index}`,
      name: file.name,
      type: file.type.startsWith("image/") ? ("image" as const) : ("file" as const),
    }))
    setAttachments((current) => [...current, ...additions].slice(0, 4))
    setStatus(`${additions.length} attachment${additions.length === 1 ? "" : "s"} added.`)
  }

  const addSampleAttachment = () => {
    if (attachments.length >= 4) return
    const sample = uploadSamples[attachments.length % uploadSamples.length]
    const nextAttachment = {
      id: `sample-${attachments.length}-${sample.name}`,
      ...sample,
    }
    setAttachments((current) => [...current, nextAttachment].slice(0, 4))
    setStatus(`${sample.name} added.`)
  }

  const submitMessage = (submittedMessage: string) => {
    setRunning(true)
    setMessage("")
    setStatus(`Message sent: ${submittedMessage}`)
  }

  const stopResponse = () => {
    setRunning(false)
    setStatus("Response stopped. The composer is ready for another message.")
  }

  const attachmentStates: Array<{
    type: PromptAttachmentType
    state: PromptAttachmentState
  }> = [
    { type: "file", state: "default" },
    { type: "file", state: "hover" },
    { type: "file", state: "uploading" },
    { type: "file", state: "error" },
    { type: "image", state: "default" },
    { type: "image", state: "hover" },
    { type: "image", state: "uploading" },
    { type: "image", state: "error" },
  ]

  return (
    <article className="docs-page prompt-page">
      <div className="page-intro prompt-hero" aria-labelledby="prompt-title">
        <div className="prompt-hero-copy">
          <h1 id="prompt-title">Prompt</h1>
          <p>Compose a message with up to four file or image attachments.</p>
        </div>
        <div className="prompt-hero-art" aria-hidden="true">
          <div className="prompt-hero-artwork-frame">
            <img
              className="prompt-hero-image"
              src="./prompt-assets/prompt-hero@1x.png"
              srcSet="./prompt-assets/prompt-hero@1x.png 1x, ./prompt-assets/prompt-hero@2x.png 2x"
              width={306}
              height={306}
              alt=""
            />
          </div>
        </div>
      </div>

      <section className="page-section" id="when-to-use" aria-labelledby="prompt-when-to-use-title">
        <div className="section-heading">
          <h2 id="prompt-when-to-use-title">When to use</h2>
          <p>Use Prompt when people need one focused surface to compose a message and optionally attach files or images.</p>
        </div>
      </section>

      <section className="page-section prompt-page-section" id="examples" aria-labelledby="prompt-examples-title">
        <div className="section-heading prompt-examples-heading">
          <div>
            <h2 id="prompt-examples-title">Examples</h2>
            <p>Explore the live composer, its states, and attachment behavior using the real component.</p>
          </div>
          <output className="prompt-example-status" aria-live="polite">
            {status}
          </output>
        </div>

        <div className="prompt-example-grid">
          <ExampleCard title="Live composer" wide>
            <div className="prompt-live-board">
              <PromptComposer
                value={message}
                onValueChange={setMessage}
                onSubmit={submitMessage}
                onStop={stopResponse}
                onUpload={addSampleAttachment}
                onFilesSelected={addDemoAttachments}
                attachments={attachments}
                onRemoveAttachment={removeAttachment}
                running={running}
              />
            </div>
          </ExampleCard>

          <ExampleCard title="Composer states" wide>
            <div className="prompt-composer-board">
              <Specimen label="Default · Empty">
                <PromptComposer />
              </Specimen>
              <Specimen label="Focus · Empty">
                <PromptComposer forceFocus />
              </Specimen>
              <Specimen label="Default · Filled">
                <PromptComposer defaultValue={sampleMessage} />
              </Specimen>
              <Specimen label="Focus · Filled">
                <PromptComposer defaultValue={sampleMessage} forceFocus />
              </Specimen>
              <Specimen label="Running · Default">
                <PromptComposer
                  defaultValue={sampleMessage}
                  running
                  onStop={() => setStatus("Response stop action selected.")}
                />
              </Specimen>
              <Specimen label="Running · Focus">
                <PromptComposer
                  defaultValue={sampleMessage}
                  running
                  forceFocus
                  onStop={() => setStatus("Response stop action selected.")}
                />
              </Specimen>
              <Specimen label="Disabled">
                <PromptComposer disabled />
              </Specimen>
              <Specimen label="Filled · Attachments">
                <PromptComposer defaultValue={sampleMessage} attachments={initialAttachments} />
              </Specimen>
            </div>
          </ExampleCard>

          <ExampleCard title="Attachment states" wide>
            <div className="prompt-attachment-board">
              {attachmentStates.map(({ type, state }) => (
                <Specimen label={`${type === "file" ? "File" : "Image"} · ${state}`} key={`${type}-${state}`}>
                  <PromptAttachment
                    id={`${type}-${state}`}
                    name={type === "file" ? "Research.pdf" : "Chart.png"}
                    type={type}
                    state={state}
                    onRemove={(id) => setStatus(`${id} remove action selected.`)}
                  />
                </Specimen>
              ))}
            </div>
          </ExampleCard>

          <ExampleCard title="Attachment list">
            <PromptAttachmentList
              attachments={[
                initialAttachments[0],
                initialAttachments[1],
                { id: "uploading", name: "Notes.txt", type: "file", state: "uploading" },
                { id: "error", name: "Large-image.png", type: "image", state: "error" },
              ]}
              onRemove={(id) => setStatus(`${id} remove action selected.`)}
            />
          </ExampleCard>
        </div>
      </section>

      <section className="page-section prompt-props-section" id="prompt-props" aria-labelledby="prompt-props-title">
        <div className="section-heading">
          <h2 id="prompt-props-title">Props quick reference</h2>
          <p>Composer, attachment, list, and text-area props used by the Prompt component family.</p>
        </div>
        <div className="reference-table-shell" tabIndex={0} aria-label="Prompt props quick reference">
          <table className="reference-table prompt-props-table">
            <thead>
              <tr><th>Property</th><th>Supported values</th></tr>
            </thead>
            <tbody>
              {promptPropsRows.map(([property, values]) => (
                <tr key={property}><td><code>{property}</code></td><td>{values}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </article>
  )
}
