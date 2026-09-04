import { useEffect, useState, type ReactNode } from "react"
import {
  IconArrowRight,
  IconDownload,
  IconPlus,
  IconSearch,
  IconSparkles,
  IconTrash,
} from "@tabler/icons-react"

import {
  Button,
  SplitButton,
  type ButtonProps,
  type SplitButtonMenuItem,
} from "@/components/ui/button"

const variants = ["primary", "secondary", "ghost", "outlined"] as const
const tones = ["brand", "neutral", "danger"] as const

const labelFor = (value: string) =>
  value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

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
    <article className={`button-example-card${wide ? " is-wide" : ""}`}>
      <div className="button-example-meta">
        <h3>{title}</h3>
      </div>
      <div className="button-example-preview">{children}</div>
    </article>
  )
}

function IconOnlySample({
  label,
  variant,
  tone,
  icon,
  onAction,
}: {
  label: string
  variant: NonNullable<ButtonProps["variant"]>
  tone: NonNullable<ButtonProps["tone"]>
  icon: ReactNode
  onAction: (label: string) => void
}) {
  return (
    <span className="button-tooltip" data-tooltip={label}>
      <Button
        type="button"
        variant={variant}
        tone={tone}
        size="small"
        iconOnly
        leadingIcon={icon}
        aria-label={label}
        onClick={() => onAction(label)}
      />
    </span>
  )
}

const propsRows = [
  ["Variant", "Primary, Secondary, Ghost, Outlined"],
  ["Tone", "Brand, Neutral, Danger"],
  ["Size", "Mini, Small, Medium, Large"],
  ["Content", "Text, Icon Only"],
  ["State", "Default, Hover, Pressed, Focus, Disabled, Loading"],
  ["Icons", "Leading, Trailing, Leading + Trailing"],
  ["Split variant", "Primary Neutral, Secondary Neutral"],
  ["Split size", "Small, Medium"],
] as const

const exportItems: SplitButtonMenuItem[] = [
  { label: "Export PNG", value: "PNG" },
  { label: "Export JPG", value: "JPG" },
  { label: "Export PDF", value: "PDF" },
]

export function ButtonPage() {
  const [status, setStatus] = useState("Choose an example to try it.")
  const [loading, setLoading] = useState(false)
  const [exportFormat, setExportFormat] = useState("PNG")

  useEffect(() => {
    document.title = "Button · VLight Design System"
  }, [])

  useEffect(() => {
    if (!loading) return
    const timeout = window.setTimeout(() => {
      setLoading(false)
      setStatus("Download complete")
    }, 1400)
    return () => window.clearTimeout(timeout)
  }, [loading])

  const announce = (label: string) => setStatus(`${label} selected`)

  const chooseFormat = (item: SplitButtonMenuItem) => {
    setExportFormat(item.value)
    setStatus(`${item.value} is now the default export format`)
  }

  return (
    <article className="docs-page button-page">
      <div className="page-intro button-hero">
        <div className="button-hero-copy">
          <h1>Button</h1>
          <p>
            Buttons trigger actions. VLight combines visual emphasis with semantic tone so each
            control communicates both priority and consequence.
          </p>
        </div>
        <img
          className="button-hero-image"
          src="./button-assets/button-hero.png"
          srcSet="./button-assets/button-hero.png 1x, ./button-assets/button-hero@2x.png 2x"
          alt=""
        />
      </div>

      <section className="page-section" id="when-to-use" aria-labelledby="when-to-use-title">
        <div className="section-heading button-when-heading">
          <h2 id="when-to-use-title">When to use</h2>
          <p>A button triggers an action or a series of actions.</p>
        </div>
        <ul className="button-usage-list">
          <li><strong>Primary</strong> marks the most important action in a section. Use one per action group.</li>
          <li><strong>Secondary</strong> supports or provides an alternative to the primary action.</li>
          <li><strong>Ghost</strong> keeps contextual actions quiet in dense interfaces.</li>
          <li><strong>Outlined</strong> adds a visible boundary without high visual emphasis.</li>
          <li><strong>Brand</strong> highlights product-defining actions; <strong>Neutral</strong> covers everyday work.</li>
          <li><strong>Danger</strong> is reserved for destructive, irreversible, or high-risk actions.</li>
        </ul>
      </section>

      <section className="page-section" id="examples" aria-labelledby="examples-title">
        <div className="section-heading button-examples-heading">
          <div>
            <h2 id="examples-title">Examples</h2>
            <p>Every example uses the real component. Hover, focus, press, and click to inspect its behavior.</p>
          </div>
          <output className="button-example-status" aria-live="polite">{status}</output>
        </div>

        <div className="button-example-grid">
          <ExampleCard
            title="Color & variant"
            wide
          >
            <div className="button-variant-board">
              {tones.map((tone) => (
                <div className="button-variant-row" key={tone}>
                  <span className="button-example-label">{labelFor(tone)}</span>
                  <div className="button-example-actions">
                    {variants.map((variant) => (
                      <Button
                        type="button"
                        variant={variant}
                        tone={tone}
                        key={`${tone}-${variant}`}
                        onClick={() => announce(`${labelFor(tone)} ${labelFor(variant)}`)}
                      >
                        {labelFor(variant)}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="button-combination">
                <span className="button-example-label">Recommended group</span>
                <div className="button-example-actions">
                  <Button type="button" variant="primary" tone="neutral" onClick={() => announce("Save changes")}>Save changes</Button>
                  <Button type="button" variant="secondary" tone="neutral" onClick={() => announce("Preview")}>Preview</Button>
                  <Button type="button" variant="ghost" tone="neutral" onClick={() => announce("Cancel")}>Cancel</Button>
                </div>
              </div>
            </div>
          </ExampleCard>

          <ExampleCard
            title="Sizes"
          >
            <div className="button-size-board">
              {([
                ["mini", "24", "button/s"],
                ["small", "32", "button/m"],
                ["medium", "36", "button/m"],
                ["large", "40", "button/l"],
              ] as const).map(([size, height, labelStyle]) => (
                <div className="button-size-sample" key={size}>
                  <Button
                    type="button"
                    variant="primary"
                    tone="brand"
                    size={size}
                    leadingIcon={<IconPlus />}
                    onClick={() => announce(`${labelFor(size)} button`)}
                  >
                    {labelFor(size)}
                  </Button>
                  <span>{height} px · {labelStyle}</span>
                </div>
              ))}
            </div>
          </ExampleCard>

          <ExampleCard
            title="States"
          >
            <div className="button-state-board">
              <div className="button-example-subgroup">
                <span className="button-example-label">Loading</span>
                <div className="button-example-actions">
                  <Button
                    type="button"
                    tone="brand"
                    leadingIcon={<IconDownload />}
                    loading={loading}
                    onClick={() => {
                      setLoading(true)
                      setStatus("Downloading…")
                    }}
                  >
                    Download
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    tone="neutral"
                    iconOnly
                    leadingIcon={<IconDownload />}
                    loading={loading}
                    aria-label="Download file"
                    onClick={() => {
                      setLoading(true)
                      setStatus("Downloading…")
                    }}
                  />
                </div>
              </div>
              <div className="button-example-subgroup">
                <span className="button-example-label">Disabled</span>
                <div className="button-example-actions">
                  {variants.map((variant) => (
                    <Button type="button" variant={variant} tone="neutral" disabled key={variant}>
                      {labelFor(variant)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </ExampleCard>

          <ExampleCard
            title="Icons"
          >
            <div className="button-icon-board">
              <div className="button-example-subgroup">
                <span className="button-example-label">Text button</span>
                <div className="button-example-actions">
                  <Button type="button" tone="brand" leadingIcon={<IconPlus />} onClick={() => announce("Create project")}>Create project</Button>
                  <Button type="button" variant="secondary" tone="brand" trailingIcon={<IconArrowRight />} onClick={() => announce("Continue")}>Continue</Button>
                  <Button type="button" variant="outlined" tone="neutral" leadingIcon={<IconSparkles />} trailingIcon={<IconArrowRight />} onClick={() => announce("Generate draft")}>Generate draft</Button>
                </div>
              </div>
              <div className="button-example-subgroup">
                <span className="button-example-label">Icon only · Small 32px / icon 16px</span>
                <div className="button-example-actions">
                  <IconOnlySample label="Primary brand search" variant="primary" tone="brand" icon={<IconSearch />} onAction={announce} />
                  <IconOnlySample label="Primary neutral search" variant="primary" tone="neutral" icon={<IconSearch />} onAction={announce} />
                  <IconOnlySample label="Secondary brand search" variant="secondary" tone="brand" icon={<IconSearch />} onAction={announce} />
                  <IconOnlySample label="Secondary neutral search" variant="secondary" tone="neutral" icon={<IconSearch />} onAction={announce} />
                  <IconOnlySample label="Ghost neutral search" variant="ghost" tone="neutral" icon={<IconSearch />} onAction={announce} />
                </div>
              </div>
            </div>
          </ExampleCard>

          <ExampleCard
            title="Split button"
          >
            <div className="button-split-board">
              <div className="button-example-subgroup">
                <span className="button-example-label">Small · Primary</span>
                <SplitButton
                  variant="primary"
                  size="small"
                  label={`Export ${exportFormat}`}
                  leadingIcon={<IconDownload />}
                  menuItems={exportItems}
                  onMainAction={() => setStatus(`Exported ${exportFormat}`)}
                  onMenuAction={chooseFormat}
                />
              </div>
              <div className="button-example-subgroup">
                <span className="button-example-label">Medium · Secondary</span>
                <SplitButton
                  variant="secondary"
                  size="medium"
                  label={`Export ${exportFormat}`}
                  leadingIcon={<IconDownload />}
                  menuItems={exportItems}
                  onMainAction={() => setStatus(`Exported ${exportFormat}`)}
                  onMenuAction={chooseFormat}
                />
              </div>
            </div>
          </ExampleCard>
        </div>
      </section>

      <section className="page-section" id="props" aria-labelledby="props-title">
        <div className="section-heading">
          <h2 id="props-title">Props quick reference</h2>
          <p>A compact inventory of the combinations maintained by the component.</p>
        </div>
        <div className="reference-table-shell" tabIndex={0} aria-label="Button props quick reference">
          <table className="reference-table button-props-table">
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
        <div className="button-props-notes">
          <p><IconSearch aria-hidden="true" /> Icon Only supports Primary Brand, Primary Neutral, Secondary Brand, Secondary Neutral, and Ghost Neutral.</p>
          <p><IconTrash aria-hidden="true" /> Danger actions require an explicit text label; Split Button is Neutral only.</p>
        </div>
      </section>
    </article>
  )
}
