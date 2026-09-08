import { useEffect, type CSSProperties, type ReactNode } from "react"

import {
  typographyTextStyles,
  type TypographyStyleToken,
} from "@/lib/design-tokens"
import { DocumentationLabel } from "@/components/docs/documentation-label"

type CustomProperties = CSSProperties & Record<`--${string}`, string>

const textStyles = typographyTextStyles()

const categoryStyles = (categories: string[]) =>
  textStyles
    .filter((style) => categories.includes(style.path[0] ?? ""))
    .sort((a, b) => b.fontSize - a.fontSize || a.name.localeCompare(b.name))

const displayStyles = categoryStyles(["display", "heading"])
const bodyStyles = categoryStyles(["body", "caption"])
const interfaceStyles = categoryStyles(["button", "tabs", "input", "badge", "tooltip"])
const numberStyles = categoryStyles(["number"])

const sampleFor = (style: TypographyStyleToken) => {
  const [category, variant] = style.path

  if (category === "display") return "Make it clear."
  if (category === "heading") {
    if (variant?.startsWith("page")) return "Primary page title"
    if (variant?.startsWith("section")) return "Major content region"
    if (variant?.startsWith("subheading")) return "Supporting content group"
    return "Component title"
  }
  if (category === "body") {
    if (variant?.startsWith("l-")) return "Important introductions and longer descriptions"
    if (variant?.startsWith("m-")) return "Default paragraphs and everyday interface content"
    return "Secondary information near primary content"
  }
  if (category === "caption") return "Updated today · Product metadata"
  if (category === "button") return "Continue"
  if (category === "tabs") return "Overview"
  if (category === "input") return variant === "helper" ? "Supporting guidance" : "Entered value"
  if (category === "badge") return "Active"
  if (category === "tooltip") return "More information"
  return "12,480"
}

const styleVariables = (style: TypographyStyleToken) =>
  ({
    "--specimen-family": style.css.fontFamily,
    "--specimen-size": style.css.fontSize,
    "--specimen-weight": style.css.fontWeight,
    "--specimen-line-height": style.css.lineHeight,
    "--specimen-tracking": style.css.letterSpacing,
  }) as CustomProperties

function TypeStyleBoard({
  title,
  styles,
}: {
  title: string
  styles: TypographyStyleToken[]
}) {
  return (
    <div className="type-style-board">
      <div className="type-style-board-heading">
        <h3>{title}</h3>
      </div>
      <div className="type-style-list">
        {styles.map((style) => (
          <article className="type-style-row" key={style.name}>
            <div className="type-style-row-heading">
              <code>{style.name}</code>
              <span>
                {style.fontFamily} · {style.fontStyle} {style.fontWeight} · {style.fontSize} /{" "}
                {style.lineHeight} · {style.letterSpacing}%
              </span>
            </div>
            <p
              className={`type-style-specimen${style.path[0] === "number" ? " is-number" : ""}`}
              style={styleVariables(style)}
            >
              {sampleFor(style)}
            </p>
            <p className="type-style-description">{style.description}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

function GuidanceCard({ title, children, tone }: { title: string; children: ReactNode; tone?: "do" | "dont" }) {
  return (
    <article className={`guidance-card${tone ? ` is-${tone}` : ""}`}>
      <h3>{title}</h3>
      {children}
    </article>
  )
}

const weightRows = [
  {
    marker: "reg",
    styleName: "Regular",
    value: textStyles.find((style) => style.fontStyle === "Regular")?.fontWeight,
    use: "Body copy, explanations, input content, and standard data.",
  },
  {
    marker: "med",
    styleName: "Medium",
    value: textStyles.find((style) => style.fontStyle === "Medium")?.fontWeight,
    use: "Short emphasis, secondary headings, and important data.",
  },
  {
    marker: "semi",
    styleName: "Semi Bold",
    value: textStyles.find((style) => style.fontStyle === "SemiBold")?.fontWeight,
    use: "Hero text and headings that require clear hierarchy.",
  },
]

export function TypographyPage() {
  useEffect(() => {
    document.title = "Typography · VLight Design System"
  }, [])

  return (
    <article className="docs-page typography-page">
      <div className="page-intro typography-hero">
        <div className="typography-hero-copy">
          <h1 className="docs-hero-title">Typography</h1>
          <p>
            VLight typography foundations, usage boundaries, and every Figma Text Style in the
            canonical token source.
          </p>
        </div>
        <div className="typography-hero-art" aria-hidden="true">
          <img
            className="typography-hero-image"
            src="./typography-assets/typography-hero.png"
            alt=""
          />
        </div>
      </div>

      <section className="page-section" id="scope" aria-labelledby="scope-title">
        <div className="section-heading">
          <h2 id="scope-title">Font family</h2>
          <p>
            The system standardizes typography selection, information hierarchy, data display, and
            design-to-development handoff for the VLight English desktop interface.
          </p>
        </div>
        <div className="font-family-grid">
          <article className="font-family-card is-display">
            <DocumentationLabel>Font 1</DocumentationLabel>
            <div className="font-family-glyph">Poppins</div>
            <p>Poppins gives the interface a recognizable geometric character.</p>
            <small>
              Display family · Hero, Page, Section, Subheading, and Component headings. Do not use
              for body copy, forms, buttons, tables, or dense data.
            </small>
          </article>
          <article className="font-family-card is-body">
            <DocumentationLabel>Font 2</DocumentationLabel>
            <div className="font-family-glyph">Inter</div>
            <p>Inter is the default product interface font.</p>
            <small>
              Functional family · Body, Caption, control labels, and Number Styles.
            </small>
          </article>
        </div>
      </section>

      <section className="page-section" id="weights" aria-labelledby="weights-title">
        <div className="section-heading">
          <h2 id="weights-title">Font weights</h2>
          <p>Three weights cover reading, emphasis, and hierarchy without introducing local variants.</p>
        </div>
        <div className="reference-table-shell" tabIndex={0} aria-label="Font weights table">
          <table className="reference-table">
            <thead>
              <tr><th>Marker</th><th>Value</th><th>Name</th><th>Recommended use</th></tr>
            </thead>
            <tbody>
              {weightRows.map((row) => (
                <tr key={row.marker}>
                  <td><code>{row.marker}</code></td>
                  <td>{row.value}</td>
                  <td>{row.styleName}</td>
                  <td>{row.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="page-section" id="display" aria-labelledby="display-title">
        <div className="section-heading">
          <h2 id="display-title">Display and heading styles</h2>
          <p>
            Poppins is reserved for visible hierarchy. Tracking, size, weight, and line height below
            are read directly from each Figma Text Style.
          </p>
        </div>
        <TypeStyleBoard title="Poppins hierarchy" styles={displayStyles} />
      </section>

      <section className="page-section" id="functional" aria-labelledby="functional-title">
        <div className="section-heading">
          <h2 id="functional-title">Body and interface styles</h2>
          <p>
            Inter is the functional family. Use body/m-reg for everyday reading and the named
            component roles for controls and compact interface copy.
          </p>
        </div>
        <div className="type-board-stack">
          <TypeStyleBoard title="Body and caption" styles={bodyStyles} />
          <TypeStyleBoard title="Interface roles" styles={interfaceStyles} />
        </div>
      </section>

      <section className="page-section" id="numbers" aria-labelledby="numbers-title">
        <div className="section-heading">
          <h2 id="numbers-title">Numbers and data display</h2>
          <p>
            Number Styles support standalone comparable data. Lining and tabular figures keep digits
            aligned as values change.
          </p>
        </div>
        <TypeStyleBoard title="Number styles" styles={numberStyles} />
        <div className="guidance-grid guidance-grid-spaced">
          <GuidanceCard title="Use Number Styles" tone="do">
            <ul>
              <li>Dashboard KPIs, metric cards, charts, and numeric table columns.</li>
              <li>Standalone currency, percentage, ranking, or time values.</li>
            </ul>
          </GuidanceCard>
          <GuidanceCard title="Continue using Body Styles" tone="dont">
            <ul>
              <li>Numbers inside sentences, buttons, inputs, and helper text.</li>
              <li>Dates, currency, or percentages embedded in paragraphs.</li>
            </ul>
          </GuidanceCard>
        </div>
      </section>

      <section className="page-section" id="typesetting" aria-labelledby="typesetting-title">
        <div className="section-heading">
          <h2 id="typesetting-title">Hierarchy and typesetting</h2>
        </div>
        <div className="reference-table-shell" tabIndex={0} aria-label="Typography hierarchy table">
          <table className="reference-table">
            <thead><tr><th>Hierarchy level</th><th>Text Style</th><th>Rule</th></tr></thead>
            <tbody>
              <tr><td>Page name</td><td><code>heading/page-med · heading/page-semi</code></td><td>No more than one Page Heading per page.</td></tr>
              <tr><td>Primary region</td><td><code>heading/section-med · heading/section-semi</code></td><td>One Section Heading per independent major region.</td></tr>
              <tr><td>Supporting group</td><td><code>heading/subheading-med</code></td><td>May repeat under a clear parent region.</td></tr>
              <tr><td>Default copy</td><td><code>body/m-reg</code></td><td>Use for continuous interface reading.</td></tr>
              <tr><td>Supporting information</td><td><code>body/s-reg · caption/reg</code></td><td>Keep content short and secondary.</td></tr>
            </tbody>
          </table>
        </div>
        <div className="principle-grid guidance-grid-spaced">
          {[
            ["Emphasis order", "Apply emphasis through semantic position, size, weight, then color."],
            ["Heading quantity", "Use Hero only for pages with a primary visual narrative, not as a routine product page title."],
            ["Alignment", "Left-align English headings and body copy. Right-align comparable numeric columns."],
            ["Line length and wrapping", "Keep body copy near 45–75 English characters per line and avoid forced word breaks."],
            ["Capitalization", "Use sentence case. Style names remain lowercase."],
            ["Tracking", "Use −2% for Hero, −1% for Page and Section, and 0% for all other Styles."],
          ].map(([title, description]) => (
            <GuidanceCard title={title} key={title}><p>{description}</p></GuidanceCard>
          ))}
        </div>
      </section>

      <section className="page-section" id="accessibility" aria-labelledby="accessibility-title">
        <div className="section-heading">
          <h2 id="accessibility-title">Accessibility and usage boundaries</h2>
        </div>
        <div className="metric-grid">
          {[
            ["4.5:1", "Standard text", "Minimum contrast against the actual background."],
            ["3:1", "Large text", "Minimum contrast against the actual background."],
            ["200%", "Text enlargement", "Content remains visible, usable, and free from clipping or overlap."],
          ].map(([value, title, description]) => (
            <article className="metric-card" key={title}>
              <strong>{value}</strong><h3>{title}</h3><p>{description}</p>
            </article>
          ))}
        </div>
        <div className="guidance-grid guidance-grid-spaced">
          <GuidanceCard title="Do" tone="do">
            <ul>
              <li>Use Regular for longer body copy.</li>
              <li>Use the smallest type token only for short supporting content.</li>
              <li>Pair state color with an icon, shape, or explicit label.</li>
            </ul>
          </GuidanceCard>
          <GuidanceCard title="Do not" tone="dont">
            <ul>
              <li>Set entire paragraphs in Medium or Semi Bold.</li>
              <li>Introduce interface text below the smallest defined Typography token.</li>
              <li>Communicate selected, error, or success state through weight alone.</li>
            </ul>
          </GuidanceCard>
        </div>
      </section>

      <section className="page-section" id="handoff" aria-labelledby="handoff-title">
        <div className="section-heading">
          <h2 id="handoff-title">Figma, code, and maintenance</h2>
          <p>Typography Variables own reusable values; Figma Text Styles compose them into named roles.</p>
        </div>
        <div className="guidance-grid">
          <GuidanceCard title="Figma checklist">
            <ol>
              <li>Select the Style that matches the content role.</li>
              <li>Keep Style names lowercase and preserve the naming convention.</li>
              <li>Do not detach a Style for local visual adjustment.</li>
              <li>Enable Lining and Tabular Figures for Number layers.</li>
              <li>Verify family, weight, size, line height, tracking, and description.</li>
            </ol>
          </GuidanceCard>
          <GuidanceCard title="Adding a Style">
            <ol>
              <li>Confirm that no existing Style fulfills the role.</li>
              <li>Confirm that the difference is typographic, not a copy or layout issue.</li>
              <li>Require a recurring use across multiple pages.</li>
              <li>Define a clear semantic role and migration path.</li>
            </ol>
          </GuidanceCard>
        </div>
        <div className="code-grid">
          <pre className="code-example">{`:root {
  --typography-font-family-display: "Poppins";
  --typography-font-family-body: "Inter";
  --typography-font-weight-regular: 400;
  --typography-font-weight-medium: 500;
  --typography-font-weight-semibold: 600;
}`}</pre>
          <pre className="code-example">{`.number-figures {
  font-family: var(--typography-font-family-body);
  font-variant-numeric: lining-nums tabular-nums;
}`}</pre>
        </div>
        <ol className="maintenance-list">
          <li>Confirm the meaning, name, and usage boundary.</li>
          <li>Update Figma Variables and Text Styles.</li>
          <li>Update the relevant guideline and Style table.</li>
          <li>Regenerate the web CSS and verify representative screens.</li>
        </ol>
      </section>
    </article>
  )
}
