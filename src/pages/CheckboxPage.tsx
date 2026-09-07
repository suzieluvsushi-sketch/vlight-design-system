import { useEffect, useState, type ReactNode } from "react"

import { CheckboxControl, CheckboxField } from "@/components/ui/checkbox"

import "./checkbox-page.css"

const propsRows = [
  ["Checked", "Controlled or uncontrolled boolean state"],
  ["Style", "Default, Box"],
  ["Placement", "Start, End"],
  ["Content", "Label, Optional description"],
  ["State", "Default, Focus, Pressed, Disabled, Invalid"],
  ["Form", "Name, Value, Required, ReadOnly"],
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
    <article className={`checkbox-example-card${wide ? " is-wide" : ""}`}>
      <div className="checkbox-example-meta">
        <h3>{title}</h3>
      </div>
      <div className="checkbox-example-preview">{children}</div>
    </article>
  )
}

function Specimen({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="checkbox-specimen">
      <div className="checkbox-specimen__content">{children}</div>
      <span className="checkbox-specimen__label">{label}</span>
    </div>
  )
}

export function CheckboxPage() {
  const [preferences, setPreferences] = useState({
    activity: true,
    releases: false,
    research: false,
  })
  const [status, setStatus] = useState("Activity summary enabled.")

  useEffect(() => {
    document.title = "Checkbox · VLight Design System"
  }, [])

  const updatePreference = (key: keyof typeof preferences, label: string) => (checked: boolean) => {
    setPreferences((current) => ({ ...current, [key]: checked }))
    setStatus(`${label} ${checked ? "enabled" : "disabled"}.`)
  }

  return (
    <article className="docs-page checkbox-page">
      <div className="page-intro checkbox-hero">
        <div className="checkbox-hero-copy">
          <h1>Checkbox</h1>
          <p>
            Checkbox lets people independently select one or more options, confirm a choice, or
            include an item in a larger set.
          </p>
        </div>
      </div>

      <section className="page-section" id="when-to-use" aria-labelledby="checkbox-when-title">
        <div className="section-heading checkbox-when-heading">
          <h2 id="checkbox-when-title">When to use</h2>
          <p>Use Checkbox when each option can be selected independently.</p>
        </div>
        <ul className="checkbox-usage-list">
          <li><strong>Checkbox</strong> supports independent choices, multiple selections, and confirmations.</li>
          <li><strong>Radio</strong> is clearer when exactly one option must be selected.</li>
          <li><strong>Switch</strong> is better when a setting takes effect immediately.</li>
        </ul>
      </section>

      <section className="page-section" id="examples" aria-labelledby="checkbox-examples-title">
        <div className="section-heading checkbox-examples-heading">
          <div>
            <h2 id="checkbox-examples-title">Examples</h2>
            <p>Every example uses the real component. Select an option or use Space to change it.</p>
          </div>
          <output className="checkbox-example-status" aria-live="polite">{status}</output>
        </div>

        <div className="checkbox-example-grid">
          <ExampleCard title="Preferences" wide>
            <div className="checkbox-live-board">
              <CheckboxField
                checked={preferences.activity}
                onCheckedChange={updatePreference("activity", "Activity summary")}
                label="Activity summary"
                description="Receive a weekly summary of project activity."
              />
              <CheckboxField
                checked={preferences.releases}
                onCheckedChange={updatePreference("releases", "Release notes")}
                label="Release notes"
              />
              <CheckboxField
                checked={preferences.research}
                onCheckedChange={updatePreference("research", "Research invitations")}
                label="Research invitations"
              />
            </div>
          </ExampleCard>

          <ExampleCard title="Control">
            <div className="checkbox-control-board">
              <Specimen label="Default · Unchecked">
                <CheckboxControl aria-label="Unchecked control" />
              </Specimen>
              <Specimen label="Default · Checked">
                <CheckboxControl aria-label="Checked control" defaultChecked />
              </Specimen>
            </div>
          </ExampleCard>

          <ExampleCard title="Placement & description">
            <div className="checkbox-comparison-board">
              <Specimen label="Default · Start">
                <CheckboxField label="Start placement" defaultChecked />
              </Specimen>
              <Specimen label="Default · End · Description on">
                <CheckboxField
                  label="End placement"
                  description="Supporting information for this choice."
                  controlPlacement="end"
                />
              </Specimen>
            </div>
          </ExampleCard>

          <ExampleCard title="Box style">
            <div className="checkbox-box-board">
              <CheckboxField
                label="Accept terms"
                className="checkbox-box-instance"
                description="Review the terms before continuing."
                fieldStyle="box"
                defaultChecked
              />
              <CheckboxField
                label="Share analytics"
                className="checkbox-box-instance"
                fieldStyle="box"
              />
            </div>
          </ExampleCard>

          <ExampleCard title="State boundaries">
            <div className="checkbox-state-board">
              <Specimen label="Invalid · Description on">
                <CheckboxField
                  label="Accept terms"
                  description="This field is required."
                  invalid
                />
              </Specimen>
              <Specimen label="Disabled · Checked">
                <CheckboxField label="Unavailable option" defaultChecked disabled />
              </Specimen>
            </div>
          </ExampleCard>
        </div>
      </section>

      <section className="page-section" id="props" aria-labelledby="checkbox-props-title">
        <div className="section-heading">
          <h2 id="checkbox-props-title">Props quick reference</h2>
          <p>Interaction states come from real behavior; Invalid is the only validation presentation prop.</p>
        </div>
        <div className="reference-table-shell" tabIndex={0} aria-label="Checkbox props quick reference">
          <table className="reference-table checkbox-props-table">
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
        <div className="checkbox-props-notes">
          <p>CheckboxField makes the complete label row interactive and links its optional description.</p>
          <p>CheckboxControl is available for compact contexts but always requires an accessible name.</p>
        </div>
      </section>
    </article>
  )
}
