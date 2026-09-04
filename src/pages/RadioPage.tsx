import { useEffect, useState, type ReactNode } from "react"

import { RadioField, RadioGroup } from "@/components/ui/radio"

import "./radio-page.css"

const propsRows = [
  ["Style", "Default, Box"],
  ["Placement", "Start, End"],
  ["Tone", "Brand, Neutral"],
  ["Content", "Label, Optional description"],
  ["State", "Default, Hover, Pressed, Focus, Disabled, Invalid"],
  ["Group", "Controlled or uncontrolled single selection"],
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
    <article className={`radio-example-card${wide ? " is-wide" : ""}`}>
      <div className="radio-example-meta">
        <h3>{title}</h3>
      </div>
      <div className="radio-example-preview">{children}</div>
    </article>
  )
}

function Specimen({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="radio-specimen">
      <div className="radio-specimen__content">{children}</div>
      <span className="radio-specimen__label">{label}</span>
    </div>
  )
}

export function RadioPage() {
  const [delivery, setDelivery] = useState("scheduled")

  useEffect(() => {
    document.title = "Radio · VLight Design System"
  }, [])

  return (
    <article className="docs-page radio-page">
      <div className="page-intro radio-hero">
        <div className="radio-hero-copy">
          <h1>Radio</h1>
          <p>
            Radio lets people select one option from a visible set, keeping labels, supporting
            information, and selection state in one accessible control.
          </p>
        </div>
      </div>

      <section className="page-section" id="when-to-use" aria-labelledby="radio-when-title">
        <div className="section-heading radio-when-heading">
          <h2 id="radio-when-title">When to use</h2>
          <p>Use Radio when choices are mutually exclusive and useful to compare at a glance.</p>
        </div>
        <ul className="radio-usage-list">
          <li><strong>Radio</strong> works best for short lists where every option should remain visible.</li>
          <li><strong>Select</strong> is more compact when the option list is long or secondary.</li>
          <li>Start with a sensible default only when one choice is genuinely safe for most people.</li>
        </ul>
      </section>

      <section className="page-section" id="examples" aria-labelledby="radio-examples-title">
        <div className="section-heading radio-examples-heading">
          <div>
            <h2 id="radio-examples-title">Examples</h2>
            <p>Use Tab and arrow keys, or select an option directly, to inspect real group behavior.</p>
          </div>
        </div>

        <div className="radio-example-grid">
          <ExampleCard title="Radio group" wide>
            <div className="radio-live-board">
              <RadioGroup
                aria-label="Delivery method"
                value={delivery}
                onValueChange={setDelivery}
              >
                <RadioField value="instant" label="Instant delivery" />
                <RadioField
                  value="scheduled"
                  label="Scheduled delivery"
                  description="Choose a date and time after checkout."
                />
                <RadioField value="pickup" label="Store pickup" />
              </RadioGroup>
            </div>
          </ExampleCard>

          <ExampleCard title="Placement & description">
            <div className="radio-comparison-board">
              <Specimen label="Default · Start">
                <RadioGroup aria-label="Start placement example" defaultValue="start">
                  <RadioField value="start" label="Start placement" />
                </RadioGroup>
              </Specimen>
              <Specimen label="Default · End · Description on">
                <RadioGroup aria-label="End placement example" defaultValue="end">
                  <RadioField
                    value="end"
                    label="End placement"
                    description="Supporting information for this choice."
                    controlPlacement="end"
                  />
                </RadioGroup>
              </Specimen>
            </div>
          </ExampleCard>

          <ExampleCard title="Box style">
            <div className="radio-box-board">
              <RadioGroup aria-label="Plan" defaultValue="pro">
                <RadioField
                  value="starter"
                  label="Starter"
                  description="For personal projects."
                  fieldStyle="box"
                />
                <RadioField
                  value="pro"
                  label="Professional"
                  description="For growing teams."
                  fieldStyle="box"
                />
                <RadioField
                  value="enterprise"
                  label="Enterprise"
                  description="Custom security and support."
                  fieldStyle="box"
                />
              </RadioGroup>
            </div>
          </ExampleCard>

          <ExampleCard title="State boundaries">
            <div className="radio-state-board">
              <Specimen label="Invalid · Description on">
                <RadioGroup aria-label="Invalid example">
                  <RadioField
                    value="invalid"
                    label="Choose an option"
                    description="Select one valid option."
                    invalid
                  />
                </RadioGroup>
              </Specimen>
              <Specimen label="Disabled · Selected">
                <RadioGroup aria-label="Disabled example" defaultValue="disabled" disabled>
                  <RadioField value="disabled" label="Unavailable option" disabled />
                </RadioGroup>
              </Specimen>
            </div>
          </ExampleCard>

          <ExampleCard title="Tone">
            <div className="radio-tone-board">
              <Specimen label="Brand · Selected">
                <RadioGroup aria-label="Brand tone example" defaultValue="brand">
                  <RadioField value="brand" label="Brand tone" />
                </RadioGroup>
              </Specimen>
              <Specimen label="Neutral · Selected">
                <RadioGroup aria-label="Neutral tone example" defaultValue="neutral">
                  <RadioField value="neutral" label="Neutral tone" tone="neutral" />
                </RadioGroup>
              </Specimen>
            </div>
          </ExampleCard>
        </div>
      </section>

      <section className="page-section" id="props" aria-labelledby="radio-props-title">
        <div className="section-heading">
          <h2 id="radio-props-title">Props quick reference</h2>
          <p>Visual state follows real group behavior; consumers provide values, content, and validation.</p>
        </div>
        <div className="reference-table-shell" tabIndex={0} aria-label="Radio props quick reference">
          <table className="reference-table radio-props-table">
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
        <div className="radio-props-notes">
          <p>RadioField must be used inside RadioGroup so arrow-key navigation and mutual exclusion stay connected.</p>
          <p>Labels are required. Descriptions are optional and linked to the control for assistive technology.</p>
        </div>
      </section>
    </article>
  )
}
