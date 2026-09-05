import { useState } from "react"
import { IconPlus } from "@tabler/icons-react"

import { Tabs, type TabItem } from "../components/ui/tabs"
import "./tab-page.css"

const liveItems: readonly TabItem[] = [
  {
    value: "overview",
    label: "Overview",
    icon: <IconPlus />,
    content: (
      <div className="tab-panel-content">
        <strong>Overview</strong>
        <p>A concise summary of the selected workspace.</p>
      </div>
    ),
  },
  {
    value: "activity",
    label: "Activity",
    icon: <IconPlus />,
    content: (
      <div className="tab-panel-content">
        <strong>Activity</strong>
        <p>Recent changes and updates appear in this view.</p>
      </div>
    ),
  },
  {
    value: "files",
    label: "Files",
    icon: <IconPlus />,
    content: (
      <div className="tab-panel-content">
        <strong>Files</strong>
        <p>Browse the files attached to this workspace.</p>
      </div>
    ),
  },
  {
    value: "settings",
    label: "Settings",
    icon: <IconPlus />,
    content: (
      <div className="tab-panel-content">
        <strong>Settings</strong>
        <p>Configure preferences without leaving the current context.</p>
      </div>
    ),
  },
]

const configurationLabels = ["Overview", "Activity", "Files", "History", "Settings"]

function createItems(count: number, disabledIndex?: number): TabItem[] {
  return configurationLabels.slice(0, count).map((label, index) => ({
    value: label.toLowerCase(),
    label,
    icon: <IconPlus />,
    disabled: index === disabledIndex,
  }))
}

const configurations = [
  { label: "2 items · Icons off", items: createItems(2), selected: "overview", icons: false },
  { label: "3 items · Icons on", items: createItems(3), selected: "overview", icons: true },
  { label: "4 items · Selected first", items: createItems(4), selected: "overview", icons: true },
  { label: "4 items · Selected third", items: createItems(4), selected: "files", icons: true },
  { label: "4 items · Disabled second", items: createItems(4, 1), selected: "overview", icons: true },
  { label: "5 items · Selected last", items: createItems(5), selected: "settings", icons: true },
] as const

const guidelines = [
  {
    title: "Keep the choices related",
    body: "Use Tabs for two to five peer views that share the same surrounding context.",
  },
  {
    title: "Use short labels",
    body: "Prefer one or two words. Labels should describe the content, not an action.",
  },
  {
    title: "Keep one item selected",
    body: "Always provide a selected tab and preserve it while content is loading. Do not override the component's internal color, spacing, or icon tokens.",
  },
]

const props = [
  ["items", "readonly TabItem[]", "—", "Two to five tab labels, icons, states, and optional panels."],
  ["ariaLabel", "string", "—", "Accessible name for the tab list."],
  ["showIcons", "boolean", "true", "Shows an item's icon when one is provided."],
  ["value", "string | null", "—", "Controlled selected value."],
  ["defaultValue", "string | null", "first enabled", "Initial value for uncontrolled use."],
  ["onValueChange", "(value) => void", "—", "Runs whenever the selected tab changes."],
  ["activateOnFocus", "boolean", "true", "Selects a tab as keyboard focus moves."],
  ["loopFocus", "boolean", "true", "Wraps arrow-key focus at either end."],
]

export function TabPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const activeLabel = liveItems.find((item) => item.value === activeTab)?.label

  return (
    <article className="docs-page tab-page">
      <div className="page-intro tab-hero" aria-labelledby="tab-title">
        <div className="tab-hero-copy">
          <h1 id="tab-title">Tabs</h1>
          <p>
            Tabs switch between related views while keeping people in the same context.
            Use the contained style for compact, clearly grouped navigation.
          </p>
        </div>
      </div>

      <section className="page-section tab-usage-section" aria-labelledby="tab-usage-title">
        <div className="section-heading">
          <h2 id="tab-usage-title">When to use</h2>
          <p>
            Use two to five tabs for peer sections. Do not use them for sequential steps,
            primary page navigation, or choices that immediately submit a value. Preserve
            the contained 36px control height and tokenized spacing in every context.
          </p>
        </div>
      </section>

      <section className="page-section" id="examples" aria-labelledby="tab-examples-title">
        <div className="section-heading tab-examples-heading">
          <div>
            <h2 id="tab-examples-title">Examples</h2>
            <p>Every specimen uses the production component and published Tabs tokens.</p>
          </div>
          <output className="tab-example-status" aria-live="polite">
            Selected: {activeLabel}
          </output>
        </div>

        <div className="tab-example-grid">
          <article className="tab-example-card is-wide">
            <div className="tab-example-meta">
              <h3>Interactive</h3>
            </div>
            <div className="tab-example-preview tab-live-preview">
              <Tabs
                ariaLabel="Workspace sections"
                items={liveItems}
                value={activeTab}
                onValueChange={(value) => value && setActiveTab(value)}
              />
            </div>
          </article>

          <article className="tab-example-card is-wide">
            <div className="tab-example-meta">
              <h3>Configurations</h3>
            </div>
            <div className="tab-configuration-list">
              {configurations.map((configuration) => (
                <div className="tab-configuration-row" key={configuration.label}>
                  <div className="tab-configuration-scroll">
                    <Tabs
                      ariaLabel={configuration.label}
                      items={configuration.items}
                      defaultValue={configuration.selected}
                      showIcons={configuration.icons}
                    />
                  </div>
                  <span className="tab-specimen-label">{configuration.label}</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="page-section" aria-labelledby="tab-behavior-title">
        <div className="section-heading">
          <h2 id="tab-behavior-title">Keyboard interaction</h2>
          <p>
            Tab enters and leaves the list. Left and Right move and activate selection,
            Home and End jump to the edges, and Disabled items are skipped.
          </p>
        </div>
      </section>

      <section className="page-section" aria-labelledby="tab-guidelines-title">
        <div className="section-heading">
          <h2 id="tab-guidelines-title">Guidelines</h2>
          <p>Keep tab navigation concise, related, and predictable.</p>
        </div>
        <div className="tab-guideline-grid">
          {guidelines.map((guideline) => (
            <article key={guideline.title}>
              <h3>{guideline.title}</h3>
              <p>{guideline.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section" aria-labelledby="tab-api-title">
        <div className="section-heading">
          <h2 id="tab-api-title">Component props</h2>
        </div>
        <div className="tab-props-table-wrap">
          <table className="tab-props-table">
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {props.map(([name, type, defaultValue, description]) => (
                <tr key={name}>
                  <td><code>{name}</code></td>
                  <td><code>{type}</code></td>
                  <td><code>{defaultValue}</code></td>
                  <td>{description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </article>
  )
}
