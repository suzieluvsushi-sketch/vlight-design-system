import { useEffect } from "react"

import historyLog from "../../history-log.json"

import "./history-page.css"

type ChangeState = {
  reference?: string
  value?: string
} | null

type HistoryChange = {
  kind: string
  property: string
  before: ChangeState
  after: ChangeState
}

type HistoryEntry = {
  id: string
  date: string
  object: {
    type: "foundation" | "icon" | "component"
    id: string
    name: string
  }
  summary: string
  reason: string
  changes: HistoryChange[]
  affectedAssets: string[]
}

const previewEntries: HistoryEntry[] = [
  {
    id: "2026-09-04-button-medium-height",
    date: "2026-09-04",
    object: { type: "component", id: "component.button", name: "Button / Medium" },
    summary: "Adjusted the default control height and its token reference.",
    reason: "Improve touch comfort and align medium controls across forms.",
    changes: [
      {
        kind: "token-reference",
        property: "Height",
        before: { reference: "layout/control-height-medium", value: "36px" },
        after: { reference: "layout/control-height-large", value: "40px" },
      },
    ],
    affectedAssets: ["component.button"],
  },
  {
    id: "2026-09-04-brand-token-alias",
    date: "2026-09-04",
    object: { type: "foundation", id: "foundation.color.semantic", name: "Color / Brand" },
    summary: "Updated the Brand color alias while keeping the semantic name stable.",
    reason: "Increase contrast in primary actions and selected states.",
    changes: [
      {
        kind: "token-reference",
        property: "Alias",
        before: { reference: "color/base/primary/100", value: "Primary 100" },
        after: { reference: "color/base/primary/200", value: "Primary 200" },
      },
    ],
    affectedAssets: ["foundation.color.semantic"],
  },
  {
    id: "2026-09-04-button-tertiary-added",
    date: "2026-09-04",
    object: { type: "component", id: "component.button", name: "Button / Tertiary" },
    summary: "Added a reusable tertiary Button variant.",
    reason: "Support low-emphasis actions without using a custom page-level style.",
    changes: [
      {
        kind: "asset-added",
        property: "Variant",
        before: null,
        after: { value: "Tertiary" },
      },
    ],
    affectedAssets: ["component.button"],
  },
]

const entryTypeLabel = {
  foundation: "Foundation",
  icon: "Icon",
  component: "Component",
} as const

const stateLabel = (state: ChangeState, fallback: string) => {
  if (!state) return fallback
  if (state.reference && state.value) return `${state.reference} · ${state.value}`
  return state.reference ?? state.value ?? fallback
}

const formatDate = (date: string) => date.replaceAll("-", "–")

export function HistoryPage() {
  const publishedEntries = historyLog.entries as HistoryEntry[]
  const isPreview = publishedEntries.length === 0
  const entries = isPreview ? previewEntries : publishedEntries.toReversed()

  useEffect(() => {
    document.title = "History Log · VLight Design System"
  }, [])

  return (
    <article className="docs-page history-page">
      <header className="history-heading">
        <div>
          <h1>History Log</h1>
          <p>
            Approved changes to Foundation tokens, icons, and reusable components from{" "}
            <code>history-log.json</code>.
          </p>
        </div>
      </header>

      <div className="history-table">
        <div className="history-table-header" aria-hidden="true">
          <span>Date</span>
          <span>Category</span>
          <span>Reason</span>
          <span>Detail</span>
        </div>
        <ol className="history-list" aria-label={isPreview ? "Preview history entries" : "History entries"}>
          {entries.map((entry) => (
            <li className="history-entry" key={entry.id}>
              <time className="history-date" dateTime={entry.date}>{formatDate(entry.date)}</time>
              <div className="history-entry-summary">
                <span className="history-object-type">{entryTypeLabel[entry.object.type]}</span>
                <h2>{entry.object.name}</h2>
                <p>{entry.summary}</p>
              </div>
              <div className="history-entry-reason">
                <span className="history-column-label">Reason</span>
                <p>{entry.reason}</p>
              </div>
              <ul className="history-changes" aria-label={`Changes to ${entry.object.name}`}>
                {entry.changes.map((change) => (
                  <li key={`${entry.id}-${change.kind}-${change.property}`}>
                    <span className="history-property">{change.property}</span>
                    <div className="history-diff">
                      <span className={`history-before${change.before ? "" : " is-empty"}`}>
                        {stateLabel(change.before, "—")}
                      </span>
                      <span className="history-arrow" aria-hidden="true">→</span>
                      <span className={`history-after${change.after ? "" : " is-removed"}`}>
                        {stateLabel(change.after, "Removed")}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </article>
  )
}
