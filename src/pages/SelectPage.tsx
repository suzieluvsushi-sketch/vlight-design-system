import { useEffect, useState, type ReactNode } from "react"

import { Select, type SelectOption } from "@/components/ui/select"

import "./select-page.css"

const teamOptions: readonly SelectOption[] = [
  { label: "Design", value: "design" },
  { label: "Engineering", value: "engineering" },
  { label: "Research", value: "research" },
  { label: "Finance (unavailable)", value: "finance", disabled: true },
]

const propsRows = [
  ["Size", "Small (32px), Medium (40px), Large (48px)"],
  ["Content", "Label, Required, Placeholder, Selected value"],
  ["Guidance", "Helper text, Error message"],
  ["State", "Default, Hover, Focus, Open, Disabled, ReadOnly, Error"],
  ["Options", "Default, Hover / Focus, Selected, Disabled"],
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
    <article className={`select-example-card${wide ? " is-wide" : ""}`}>
      <div className="select-example-meta">
        <h3>{title}</h3>
      </div>
      <div className="select-example-preview">{children}</div>
    </article>
  )
}

function Specimen({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="select-specimen">
      <div className="select-specimen__content">{children}</div>
      <span className="select-specimen__label">{label}</span>
    </div>
  )
}

export function SelectPage() {
  const [team, setTeam] = useState<string | null>(null)
  const [status, setStatus] = useState("Open the live select to inspect its behavior.")

  useEffect(() => {
    document.title = "Select · VLight Design System"
  }, [])

  const chooseTeam = (nextValue: string | null) => {
    setTeam(nextValue)
    const selected = teamOptions.find((option) => option.value === nextValue)
    setStatus(selected ? `${selected.label} selected.` : "Selection cleared.")
  }

  return (
    <article className="docs-page select-page">
      <div className="page-intro select-hero">
        <div className="select-hero-copy">
          <h1>Select</h1>
          <p>
            Select lets people choose one value from a predefined list while keeping the field,
            listbox, and option states connected.
          </p>
        </div>
        <div className="select-hero-art" aria-hidden="true">
          <div className="select-hero-artwork-frame">
            <img
              className="select-hero-image"
              src="./select-assets/select-hero.png"
              alt=""
            />
          </div>
        </div>
      </div>

      <section className="page-section" id="when-to-use" aria-labelledby="select-when-title">
        <div className="section-heading select-when-heading">
          <h2 id="select-when-title">When to use</h2>
          <p>Use Select for a single choice when showing every option at once would add noise.</p>
        </div>
        <ul className="select-usage-list">
          <li><strong>Select</strong> works best for a predefined list with one chosen value.</li>
          <li><strong>Radio</strong> is clearer when the list is short and every option should remain visible.</li>
          <li><strong>Input or autocomplete</strong> is better when people need to enter or search many possible values.</li>
        </ul>
      </section>

      <section className="page-section" id="examples" aria-labelledby="select-examples-title">
        <div className="section-heading select-examples-heading">
          <div>
            <h2 id="select-examples-title">Examples</h2>
            <p>Seven focused specimens cover the system without repeating the full variant matrix.</p>
          </div>
          <output className="select-example-status" aria-live="polite">{status}</output>
        </div>

        <div className="select-example-grid">
          <ExampleCard title="Live selection" wide>
            <div className="select-live-board">
              <Specimen label="Medium · Empty / Filled · Default / Hover / Focus / Open">
                <Select
                  label="Team"
                  options={teamOptions}
                  placeholder="Select a team"
                  helperText="Use arrow keys to move through the list."
                  required
                  value={team}
                  onValueChange={chooseTeam}
                />
              </Specimen>
            </div>
          </ExampleCard>

          <ExampleCard title="Size scale">
            <div className="select-size-board">
              <Specimen label="Small · 32 px">
                <Select
                  size="small"
                  label="Label"
                  options={teamOptions}
                  defaultValue="design"
                />
              </Specimen>
              <Specimen label="Medium · 40 px · Default">
                <Select
                  label="Label"
                  options={teamOptions}
                  defaultValue="engineering"
                />
              </Specimen>
              <Specimen label="Large · 48 px">
                <Select
                  size="large"
                  label="Label"
                  options={teamOptions}
                  defaultValue="research"
                />
              </Specimen>
            </div>
          </ExampleCard>

          <ExampleCard title="State boundaries">
            <div className="select-state-board">
              <Specimen label="Error · Required">
                <Select
                  label="Team"
                  options={teamOptions}
                  required
                  errorMessage="Select a valid option"
                />
              </Specimen>
              <div className="select-fixed-states">
                <Specimen label="Disabled">
                  <Select label="Team" options={teamOptions} disabled />
                </Specimen>
                <Specimen label="ReadOnly">
                  <Select
                    label="Team"
                    options={teamOptions}
                    defaultValue="design"
                    readOnly
                  />
                </Specimen>
              </div>
            </div>
          </ExampleCard>
        </div>
      </section>

      <section className="page-section" id="props" aria-labelledby="select-props-title">
        <div className="section-heading">
          <h2 id="select-props-title">Props quick reference</h2>
          <p>Interaction states come from real behavior; consumers do not set a presentation-only state prop.</p>
        </div>
        <div className="reference-table-shell" tabIndex={0} aria-label="Select props quick reference">
          <table className="reference-table select-props-table">
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
        <div className="select-props-notes">
          <p>Single selection only. Search, custom values, and multiple selection are intentionally out of scope.</p>
          <p>Base UI supplies listbox semantics, typeahead, arrow-key navigation, Home / End, Enter / Space, and Escape.</p>
        </div>
      </section>
    </article>
  )
}
