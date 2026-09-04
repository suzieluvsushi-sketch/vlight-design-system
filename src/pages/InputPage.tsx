import { useEffect, useState, type FormEvent, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import "./input-page.css"

const propsRows = [
  ["Kind", "Text, Search, Password"],
  ["Size", "Small (32px), Medium (40px), Large (48px)"],
  ["Content", "Label, Required, Placeholder, Value"],
  ["Guidance", "Helper Text, Error Message"],
  ["State", "Default, Hover, Focus, Error, Disabled, ReadOnly"],
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
    <article className={`input-example-card${wide ? " is-wide" : ""}`}>
      <div className="input-example-meta">
        <h3>{title}</h3>
      </div>
      <div className="input-example-preview">{children}</div>
    </article>
  )
}

function Specimen({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="input-specimen">
      <div className="input-specimen__content">{children}</div>
      <span className="input-specimen__label">{label}</span>
    </div>
  )
}

const isEmailAddress = (value: string) => /^\S+@\S+\.\S+$/.test(value)

export function InputPage() {
  const [email, setEmail] = useState("")
  const [validated, setValidated] = useState(false)
  const [status, setStatus] = useState("Try the live field to inspect its behavior.")
  const emailError = validated && !isEmailAddress(email)
    ? "Enter a valid email address"
    : undefined

  useEffect(() => {
    document.title = "Input · VLight Design System"
  }, [])

  const validateEmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setValidated(true)

    if (isEmailAddress(email)) {
      setStatus("Email address is valid.")
      return
    }

    setStatus("Email address needs attention.")
    event.currentTarget.querySelector<HTMLInputElement>("input")?.focus()
  }

  return (
    <article className="docs-page input-page">
      <div className="page-intro input-hero">
        <div className="input-hero-copy">
          <h1>Input</h1>
          <p>
            Inputs collect short values and keep labels, guidance, validation, and interaction
            feedback connected as one field.
          </p>
        </div>
        <div className="input-hero-art" aria-hidden="true">
          <img
            className="input-hero-image"
            src="./input-assets/input-hero.png"
            srcSet="./input-assets/input-hero.png 1x, ./input-assets/input-hero@2x.png 2x"
            alt=""
          />
        </div>
      </div>

      <section className="page-section" id="when-to-use" aria-labelledby="input-when-title">
        <div className="section-heading input-when-heading">
          <h2 id="input-when-title">When to use</h2>
          <p>Choose the field by intent, then use Medium unless density or prominence calls for another size.</p>
        </div>
        <ul className="input-usage-list">
          <li><strong>Text</strong> collects a general short value such as a name, email address, or URL.</li>
          <li><strong>Search</strong> filters or queries existing content and is available in Medium only.</li>
          <li><strong>Password</strong> masks credentials and provides an accessible visibility control.</li>
        </ul>
      </section>

      <section className="page-section" id="examples" aria-labelledby="input-examples-title">
        <div className="section-heading input-examples-heading">
          <div>
            <h2 id="input-examples-title">Examples</h2>
            <p>Three focused examples cover the system without repeating the full variant matrix.</p>
          </div>
          <output className="input-example-status" aria-live="polite">{status}</output>
        </div>

        <div className="input-example-grid">
          <ExampleCard
            title="Field types"
            wide
          >
            <div className="input-type-board">
              <Specimen label="Text · Empty · Helper text">
                <Input
                  label="Project name"
                  placeholder="Enter project name"
                  helperText="Use a short, recognizable name."
                />
              </Specimen>
              <Specimen label="Search · Filled · Leading icon">
                <Input
                  kind="search"
                  label="Search"
                  defaultValue="Project Atlas"
                />
              </Specimen>
              <Specimen label="Password · Filled · Visibility control">
                <Input
                  kind="password"
                  label="Password"
                  defaultValue="design-system-2026"
                  autoComplete="current-password"
                />
              </Specimen>
            </div>
          </ExampleCard>

          <ExampleCard
            title="Size scale"
          >
            <div className="input-size-board">
              <Specimen label="Small · 32 px">
                <Input size="small" label="Label" defaultValue="Example value" />
              </Specimen>
              <Specimen label="Medium · 40 px · Default">
                <Input size="medium" label="Label" defaultValue="Example value" />
              </Specimen>
              <Specimen label="Large · 48 px">
                <Input size="large" label="Label" defaultValue="Example value" />
              </Specimen>
            </div>
          </ExampleCard>

          <ExampleCard
            title="State behavior"
          >
            <div className="input-state-board">
              <form className="input-live-form" noValidate onSubmit={validateEmail}>
                <span className="input-board-label">Live · Default / Hover / Focus / Error</span>
                <Input
                  label="Email address"
                  placeholder="name@company.com"
                  required
                  value={email}
                  helperText="Use your work email address."
                  errorMessage={emailError}
                  inputMode="email"
                  autoComplete="email"
                  onBlur={() => setValidated(true)}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <Button type="submit" variant="secondary" tone="neutral" size="small">
                  Validate email
                </Button>
              </form>

              <div className="input-fixed-states">
                <Specimen label="Disabled">
                  <Input label="Workspace" placeholder="Unavailable" disabled />
                </Specimen>
                <Specimen label="ReadOnly">
                  <Input label="Workspace ID" defaultValue="VL-2048" readOnly />
                </Specimen>
              </div>
            </div>
          </ExampleCard>
        </div>
      </section>

      <section className="page-section" id="props" aria-labelledby="input-props-title">
        <div className="section-heading">
          <h2 id="input-props-title">Props quick reference</h2>
          <p>Visual states follow real input behavior; consumers do not set a presentation-only state prop.</p>
        </div>
        <div className="reference-table-shell" tabIndex={0} aria-label="Input props quick reference">
          <table className="reference-table input-props-table">
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
        <div className="input-props-notes">
          <p>Search and Password are restricted to Medium so their 24px icons remain unchanged.</p>
          <p>Error messages are connected with <code>aria-invalid</code> and <code>aria-describedby</code>; Password visibility is keyboard operable.</p>
        </div>
      </section>
    </article>
  )
}
