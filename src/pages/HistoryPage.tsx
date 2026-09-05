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
  const entries = (historyLog.entries as HistoryEntry[]).toReversed()

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
        <ol className="history-list" aria-label="History entries">
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
