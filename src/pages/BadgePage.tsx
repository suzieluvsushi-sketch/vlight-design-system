import { useEffect, type ReactNode } from "react"
import {
  IconAlertTriangle,
  IconBuildingFactory2,
  IconChevronRight,
  IconCircleCheck,
  IconCircleX,
  IconTag,
} from "@tabler/icons-react"

import { Badge, type BadgeProps } from "@/components/ui/badge"

import "./badge-page.css"

type BadgeTone = NonNullable<BadgeProps["tone"]>
type BadgeTreatment = NonNullable<BadgeProps["treatment"]>

const tones: readonly BadgeTone[] = [
  "neutral",
  "purple",
  "violet",
  "blue",
  "success",
  "warning",
  "error",
]

const treatments: readonly BadgeTreatment[] = ["soft", "outline", "solid"]

const propsRows = [
  ["tone", "neutral, purple, violet, blue, success, warning, error"],
  ["treatment", "soft, outline, solid"],
  ["size", "small (24px), medium (32px)"],
  ["children", "Short, sentence-case label"],
  ["leadingIcon", "ReactNode"],
  ["trailingIcon", "ReactNode"],
] as const

const labelFor = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

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
    <article className={`badge-example-card${wide ? " is-wide" : ""}`}>
      <div className="badge-example-meta">
        <h3>{title}</h3>
      </div>
      <div className="badge-example-preview">{children}</div>
    </article>
  )
}

function Specimen({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="badge-specimen">
      <div className="badge-specimen__content">{children}</div>
      <span className="badge-specimen__label">{label}</span>
    </div>
  )
}

function GuidelineCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="badge-guideline-card">
      <h3>{title}</h3>
      <ul>{children}</ul>
    </article>
  )
}

export function BadgePage() {
  useEffect(() => {
    document.title = "Badge · VLight Design System"
  }, [])

  return (
    <article className="docs-page badge-page">
      <div className="page-intro badge-hero">
        <div className="badge-hero-copy">
          <h1 className="docs-hero-title">Badge</h1>
          <p>
            Badges communicate compact metadata, qualifications, categories, and status without
            interrupting the surrounding task.
          </p>
        </div>
        <img
          className="badge-hero-image"
          src="./badge-assets/badge-hero.png"
          alt=""
          aria-hidden="true"
        />
      </div>

      <section className="page-section" id="when-to-use" aria-labelledby="badge-when-title">
        <div className="section-heading badge-when-heading">
          <h2 id="badge-when-title">When to use</h2>
          <p>Choose Tone by meaning, then keep Treatment and Size consistent with peer Badges.</p>
        </div>
        <ul className="badge-usage-list">
          <li><strong>Use for</strong> factory names, qualifications, product categories, and short semantic status.</li>
          <li><strong>Neutral</strong> is the default metadata tone; Purple, Violet, and Blue need stable product meanings.</li>
          <li><strong>Semantic tones</strong> communicate success, attention, or failure with explicit label text.</li>
          <li><strong>Do not use for</strong> actions, filters, navigation controls, or long explanations.</li>
        </ul>
      </section>

      <section className="page-section" id="examples" aria-labelledby="badge-examples-title">
        <div className="section-heading badge-examples-heading">
          <div>
            <h2 id="badge-examples-title">Examples</h2>
            <p>Every specimen uses the real component and the published Badge token chain.</p>
          </div>
        </div>

        <div className="badge-example-grid">
          <ExampleCard title="Tone & treatment" wide>
            <div className="badge-matrix-shell" tabIndex={0} aria-label="Badge tone and treatment matrix">
              <table className="badge-variant-matrix">
                <thead>
                  <tr>
                    <th scope="col">Tone</th>
                    {treatments.map((treatment) => (
                      <th scope="col" key={treatment}>{labelFor(treatment)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tones.map((tone) => (
                    <tr key={tone}>
                      <th scope="row">{labelFor(tone)}</th>
                      {treatments.map((treatment) => (
                        <td key={treatment}>
                          <Badge tone={tone} treatment={treatment} size="small">Badge</Badge>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ExampleCard>

          <ExampleCard title="Size scale">
            <div className="badge-size-board">
              <Specimen label="Small · 24 px · 12 px icon">
                <Badge leadingIcon={<IconTag />}>Badge</Badge>
              </Specimen>
              <Specimen label="Medium · 32 px · 16 px icon">
                <Badge size="medium" leadingIcon={<IconTag />}>Badge</Badge>
              </Specimen>
            </div>
          </ExampleCard>

          <ExampleCard title="Icon composition">
            <div className="badge-icon-board">
              <Specimen label="Label only">
                <Badge tone="purple">Category</Badge>
              </Specimen>
              <Specimen label="Leading icon">
                <Badge tone="purple" leadingIcon={<IconBuildingFactory2 />}>Factory</Badge>
              </Specimen>
              <Specimen label="Trailing icon">
                <Badge tone="blue" treatment="outline" trailingIcon={<IconChevronRight />}>Details</Badge>
              </Specimen>
              <Specimen label="Leading + trailing">
                <Badge tone="success" leadingIcon={<IconCircleCheck />} trailingIcon={<IconChevronRight />}>Verified</Badge>
              </Specimen>
            </div>
          </ExampleCard>

          <ExampleCard title="Semantic examples" wide>
            <div className="badge-semantic-board">
              <Specimen label="Metadata · Neutral">
                <Badge leadingIcon={<IconBuildingFactory2 />}>Factory</Badge>
              </Specimen>
              <Specimen label="Approved · Success">
                <Badge tone="success" treatment="outline" leadingIcon={<IconCircleCheck />}>Verified</Badge>
              </Specimen>
              <Specimen label="Attention · Warning">
                <Badge tone="warning" leadingIcon={<IconAlertTriangle />}>Pending review</Badge>
              </Specimen>
              <Specimen label="Failed · Error">
                <Badge tone="error" treatment="solid" leadingIcon={<IconCircleX />}>Rejected</Badge>
              </Specimen>
            </div>
          </ExampleCard>
        </div>
      </section>

      <section className="page-section" id="guidelines" aria-labelledby="badge-guidelines-title">
        <div className="section-heading badge-guidelines-heading">
          <h2 id="badge-guidelines-title">Usage guidelines</h2>
          <p>Preserve meaning, static behavior, and legibility when composing Badges.</p>
        </div>
        <div className="badge-guideline-grid">
          <GuidelineCard title="Static behavior">
            <li>No Hover, Focus, Pressed, Selected, or Disabled variants.</li>
            <li>Keep static Badges out of the keyboard tab order.</li>
            <li>Use a semantic Button or Link when interaction is required.</li>
          </GuidelineCard>
          <GuidelineCard title="Content & icons">
            <li>Use short, sentence-case labels with no ending punctuation.</li>
            <li>Keep labels on one line and make each meaning specific.</li>
            <li>Use icons only when they clarify category, status, or access.</li>
          </GuidelineCard>
          <GuidelineCard title="Accessibility">
            <li>Do not communicate status through color alone.</li>
            <li>Use readable text such as Verified, Pending, or Rejected.</li>
            <li>Solid Violet, Blue, Success, and Warning are below AA contrast.</li>
          </GuidelineCard>
        </div>
      </section>

      <section className="page-section" id="props" aria-labelledby="badge-props-title">
        <div className="section-heading">
          <h2 id="badge-props-title">Props quick reference</h2>
          <p>Badge is a static span and accepts native span attributes in addition to the props below.</p>
        </div>
        <div className="reference-table-shell" tabIndex={0} aria-label="Badge props quick reference">
          <table className="reference-table badge-props-table">
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
        <div className="badge-props-notes">
          <p>Default configuration: <code>neutral / soft / small</code>.</p>
          <p>Figma source: Badge Component Set <code>737:306</code>; Hero artwork frame <code>1968:6669</code>.</p>
        </div>
      </section>
    </article>
  )
}
