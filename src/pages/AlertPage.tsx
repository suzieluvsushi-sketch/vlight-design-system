import { useEffect, useState, type ReactNode } from "react"

import { DocumentationAlert, useDocumentationAlert } from "@/components/docs/documentation-alert"
import { Alert, type AlertProps } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

import "./alert-page.css"

type AlertTone = NonNullable<AlertProps["tone"]>

const tones: readonly AlertTone[] = ["info", "success", "warning", "error"]

const toneCopy: Record<AlertTone, { title: string; description: string }> = {
  info: {
    title: "Information",
    description: "Additional details about this message.",
  },
  success: {
    title: "Changes saved",
    description: "Your settings were saved successfully.",
  },
  warning: {
    title: "Review required",
    description: "Check these details before continuing.",
  },
  error: {
    title: "Connection failed",
    description: "Try again or check your network connection.",
  },
}

const configurations = [
  { id: "default", label: "Icon on · Description on", showIcon: true, showDescription: true, showAction: false },
  { id: "title", label: "Icon on · Description off", showIcon: true, showDescription: false, showAction: false },
  { id: "no-icon", label: "Icon off · Description on", showIcon: false, showDescription: true, showAction: false },
  { id: "action", label: "Button on · Icon on · Description on", showIcon: true, showDescription: true, showAction: true },
] as const

const propsRows = [
  ["tone", "info, success, warning, error"],
  ["title", "ReactNode · required"],
  ["description", "ReactNode · optional"],
  ["icon", "ReactNode, false · defaults by Tone"],
  ["action", "ReactNode · use Button or Link"],
  ["role", "status for Info / Success; alert for Warning / Error"],
] as const

const labelFor = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

function ExampleCard({ title, children, wide = false }: { title: string; children: ReactNode; wide?: boolean }) {
  return (
    <article className={`alert-example-card${wide ? " is-wide" : ""}`}>
      <div className="alert-example-meta">
        <h3>{title}</h3>
      </div>
      <div className="alert-example-preview">{children}</div>
    </article>
  )
}

function GuidelineCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="alert-guideline-card">
      <h3>{title}</h3>
      <ul>{children}</ul>
    </article>
  )
}

export function AlertPage() {
  const [status, setStatus] = useState("")
  const { notice, showAlert, dismissAlert } = useDocumentationAlert()

  useEffect(() => {
    document.title = "Alert · VLight Design System"
  }, [])

  const actionFor = (tone: AlertTone) => (
    <Button
      type="button"
      size="small"
      variant={tone === "error" ? "ghost" : "outlined"}
      tone={tone === "error" ? "danger" : "neutral"}
      onClick={() => setStatus(`${labelFor(tone)} alert action selected.`)}
    >
      View details
    </Button>
  )

  return (
    <article className="docs-page alert-page">
      <div className="page-intro alert-hero">
        <div className="alert-hero-copy">
          <h1 className="docs-hero-title">Alert</h1>
          <p>
            Alerts communicate important contextual information with a semantic tone, concise
            message, and an optional next action.
          </p>
        </div>
      </div>

      <section className="page-section" id="when-to-use" aria-labelledby="alert-when-title">
        <div className="section-heading alert-when-heading">
          <h2 id="alert-when-title">When to use</h2>
          <p>Choose Tone by urgency and outcome, then keep the message focused on one situation.</p>
        </div>
        <ul className="alert-usage-list">
          <li><strong>Info</strong> provides neutral context that helps people understand the current task.</li>
          <li><strong>Success</strong> confirms that an operation completed as expected.</li>
          <li><strong>Warning</strong> calls attention to a possible risk or decision before continuing.</li>
          <li><strong>Error</strong> explains a failure and, when possible, provides a clear recovery step.</li>
        </ul>
      </section>

      <section className="page-section" id="examples" aria-labelledby="alert-examples-title">
        <div className="section-heading alert-examples-heading">
          <div>
            <h2 id="alert-examples-title">Examples</h2>
            <p>The full 16-configuration matrix mirrors the approved Figma source set.</p>
          </div>
          <div className="alert-example-controls">
            <Button
              type="button"
              size="small"
              variant="outlined"
              tone="neutral"
              onClick={() => showAlert(
                toneCopy.info.title,
                "info",
                toneCopy.info.description,
              )}
            >
              Show info alert
            </Button>
            <output className="alert-example-announcement" aria-live="polite">{status}</output>
          </div>
        </div>

        <div className="alert-example-grid">
          <ExampleCard title="Configuration matrix · 16 combinations" wide>
            <div className="alert-configuration-board">
              {configurations.map((configuration) => (
                <section className="alert-configuration-group" key={configuration.id}>
                  <h4>{configuration.label}</h4>
                  <div className="alert-configuration-grid">
                    {tones.map((tone) => {
                      const copy = toneCopy[tone]
                      return (
                        <div className="alert-specimen" key={tone}>
                          <Alert
                            tone={tone}
                            title={copy.title}
                            description={configuration.showDescription ? copy.description : undefined}
                            icon={configuration.showIcon ? undefined : false}
                            action={configuration.showAction ? actionFor(tone) : undefined}
                          />
                          <span>{labelFor(tone)}</span>
                        </div>
                      )
                    })}
                  </div>
                </section>
              ))}
            </div>
          </ExampleCard>

          <ExampleCard title="Custom title & description">
            <div className="alert-copy-board">
              <Alert
                title="System update"
                description="A new version will be installed tonight."
              />
              <Alert
                title="Connection restored"
                description="You can continue working."
              />
            </div>
          </ExampleCard>

          <ExampleCard title="Content boundaries">
            <div className="alert-copy-board">
              <Alert tone="success" title="Upload complete" />
              <Alert
                tone="warning"
                title="Review required"
                description="Two fields still need attention."
                icon={false}
              />
            </div>
          </ExampleCard>
        </div>
      </section>

      <section className="page-section" id="guidelines" aria-labelledby="alert-guidelines-title">
        <div className="section-heading alert-guidelines-heading">
          <h2 id="alert-guidelines-title">Usage guidelines</h2>
          <p>Keep alerts meaningful, concise, and proportional to the situation.</p>
        </div>
        <div className="alert-guideline-grid">
          <GuidelineCard title="Tone">
            <li>Use one Tone for one consistent semantic meaning.</li>
            <li>Do not use Warning or Error only to attract attention.</li>
            <li>Match the icon, copy, and recovery path to the selected Tone.</li>
          </GuidelineCard>
          <GuidelineCard title="Content & actions">
            <li>Lead with the outcome or issue, then add only useful detail.</li>
            <li>Use one short action when people need a clear next step.</li>
            <li>Do not add a close control unless the product defines dismissal behavior.</li>
          </GuidelineCard>
          <GuidelineCard title="Accessibility">
            <li>Info and Success use polite status semantics.</li>
            <li>Warning and Error use assertive alert semantics.</li>
            <li>Never rely on color or the status icon without explanatory text.</li>
          </GuidelineCard>
        </div>
      </section>

      <section className="page-section" id="props" aria-labelledby="alert-props-title">
        <div className="section-heading">
          <h2 id="alert-props-title">Props quick reference</h2>
          <p>Optional regions are controlled by content presence rather than presentation-only booleans.</p>
        </div>
        <div className="reference-table-shell" tabIndex={0} aria-label="Alert props quick reference">
          <table className="reference-table alert-props-table">
            <thead>
              <tr><th>Property</th><th>Supported values</th></tr>
            </thead>
            <tbody>
              {propsRows.map(([property, values]) => (
                <tr key={property}><td><code>{property}</code></td><td>{values}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="alert-props-notes">
          <p>Default Tone is <code>info</code>; Title remains required so placeholder copy cannot ship accidentally.</p>
          <p>Width: <code>390px</code> without an action. With an action, the component hugs <code>390px + 12px gap + the action width</code>.</p>
          <p>Layout: <code>12px</code> horizontal and vertical padding; <code>12px</code> body/action gap; <code>8px</code> icon/content gap; <code>20px</code> icon.</p>
          <p>Title/description gap: <code>0px</code> for every Tone.</p>
          <p>Figma component source: <code>1334:16</code>.</p>
        </div>
      </section>

      <DocumentationAlert notice={notice} onDismiss={dismissAlert} />
    </article>
  )
}
