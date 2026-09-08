import { useEffect, useState, type ReactNode } from "react"
import {
  IconArchive,
  IconChevronDown,
  IconChevronRight,
  IconCopy,
  IconFolder,
  IconPencil,
  IconPlus,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Menu,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuSubmenu,
} from "@/components/ui/menu"

import "./menu-page.css"

type ProjectMenuContentProps = {
  onAction: (label: string) => void
}

type MenuItemKind = "default" | "danger" | "submenu" | "leading-icon"
type MenuItemDemoState = "default" | "hover" | "focus" | "disabled"

const menuItemKinds: readonly { kind: MenuItemKind; title: string }[] = [
  { kind: "default", title: "Default action" },
  { kind: "danger", title: "Danger / error action" },
  { kind: "submenu", title: "Submenu item" },
  { kind: "leading-icon", title: "Leading icon" },
]

const menuItemStates: readonly MenuItemDemoState[] = ["default", "hover", "focus", "disabled"]

function sentenceCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function MenuItemSpecimen({
  kind,
  state,
  onAction,
}: {
  kind: MenuItemKind
  state: MenuItemDemoState
  onAction: (label: string) => void
}) {
  const disabled = state === "disabled"
  const label = kind === "danger"
    ? "Delete project"
    : kind === "submenu"
      ? "Move to"
      : kind === "leading-icon"
        ? "Create project"
        : "Menu item"
  const leadingIcon: ReactNode = kind === "leading-icon" ? <IconPlus /> : null
  const trailingIcon: ReactNode = kind === "submenu" ? <IconChevronRight /> : null

  return (
    <div className="menu-state-sample">
      <button
        type="button"
        className="vlight-menu__item menu-item-specimen"
        data-tone={kind === "danger" ? "danger" : "neutral"}
        data-demo-state={state}
        data-disabled={disabled || undefined}
        disabled={disabled}
        onClick={() => onAction(`${label} · ${sentenceCase(state)}`)}
      >
        {leadingIcon ? <span className="vlight-menu__icon" aria-hidden="true">{leadingIcon}</span> : null}
        <span className="vlight-menu__item-label">{label}</span>
        {trailingIcon ? <span className="vlight-menu__icon" aria-hidden="true">{trailingIcon}</span> : null}
      </button>
      <span className="menu-specimen-label">{sentenceCase(state)}</span>
    </div>
  )
}

function ProjectMenuContent({ onAction }: ProjectMenuContentProps) {
  return (
    <>
      <MenuGroup label="Project">
        <MenuItem
          label="Create project"
          leadingIcon={<IconPlus />}
          onSelect={() => onAction("Create project")}
        />
        <MenuItem
          label="Rename"
          leadingIcon={<IconPencil />}
          onSelect={() => onAction("Rename")}
        />
        <MenuSubmenu label="Move to" leadingIcon={<IconFolder />}>
          <MenuGroup label="Workspace">
            <MenuItem label="Personal" onSelect={() => onAction("Move to Personal")} />
            <MenuItem label="Shared projects" onSelect={() => onAction("Move to Shared projects")} />
            <MenuItem label="Archive" disabled />
          </MenuGroup>
        </MenuSubmenu>
      </MenuGroup>
      <MenuDivider />
      <MenuItem
        label="Duplicate"
        leadingIcon={<IconCopy />}
        onSelect={() => onAction("Duplicate")}
      />
      <MenuItem label="Archive" leadingIcon={<IconArchive />} disabled />
      <MenuItem
        label="Delete project"
        tone="danger"
        onSelect={() => onAction("Delete project")}
      />
    </>
  )
}

const guidelines = [
  {
    title: "Use for temporary actions",
    body: "Open Menu from a clear trigger when a compact set of contextual commands is needed.",
  },
  {
    title: "Keep labels direct",
    body: "Use short, sentence-case, verb-led labels without terminal punctuation.",
  },
  {
    title: "Separate destructive actions",
    body: "Place Danger actions after a divider and avoid mixing them with routine commands.",
  },
]

const props = [
  ["trigger", "ReactElement", "—", "The control that opens and anchors the menu."],
  ["open", "boolean", "—", "Controlled open state."],
  ["defaultOpen", "boolean", "false", "Initial state for uncontrolled use."],
  ["modal", "boolean", "true", "Restricts interaction to the open menu when enabled."],
  ["loopFocus", "boolean", "true", "Wraps keyboard focus from the last item to the first."],
  ["side", "top | bottom | left | right", "bottom", "Preferred placement relative to the trigger."],
  ["align", "start | center | end", "start", "Alignment along the selected side."],
  ["sideOffset", "number", "8", "Distance between the trigger and menu surface."],
]

export function MenuPage() {
  const [status, setStatus] = useState("Open the interactive example to inspect Menu behavior.")

  useEffect(() => {
    document.title = "Menu · VLight Design System"
  }, [])

  const announce = (label: string) => setStatus(`${label} selected`)

  return (
    <article className="docs-page menu-page">
      <div className="page-intro menu-hero" aria-labelledby="menu-title">
        <div className="menu-hero-copy">
          <h1 className="docs-hero-title" id="menu-title">Menu</h1>
          <p>
            Menus present a concise set of temporary actions near their trigger while preserving
            context and predictable keyboard behavior.
          </p>
        </div>
      </div>

      <section className="page-section menu-usage-section" aria-labelledby="menu-usage-title">
        <div className="section-heading">
          <h2 id="menu-usage-title">When to use</h2>
          <p>
            Use Menu for contextual commands that do not need to remain visible. Keep the list
            concise and use a Submenu only when a second level is necessary.
          </p>
        </div>
      </section>

      <section className="page-section" id="examples" aria-labelledby="menu-examples-title">
        <div className="section-heading menu-examples-heading">
          <div>
            <h2 id="menu-examples-title">Examples</h2>
            <p>Inspect the complete Menu, then compare every Menu Item type and state.</p>
          </div>
          <output className="menu-example-status" aria-live="polite">{status}</output>
        </div>

        <div className="menu-example-grid">
          <article className="menu-example-card is-wide">
            <div className="menu-example-meta"><h3>Interactive surface</h3></div>
            <div className="menu-example-preview menu-live-preview">
              <Menu
                trigger={(
                  <Button
                    type="button"
                    variant="secondary"
                    tone="neutral"
                    trailingIcon={<IconChevronDown />}
                  >
                    Project actions
                  </Button>
                )}
                modal={false}
                onOpenChange={(open) => {
                  if (open) setStatus("Menu opened")
                }}
              >
                <ProjectMenuContent onAction={announce} />
              </Menu>
            </div>
          </article>

          {menuItemKinds.map(({ kind, title }) => (
            <article className="menu-example-card" key={kind}>
              <div className="menu-example-meta"><h3>{title}</h3></div>
              <div className="menu-example-preview menu-state-board">
                {menuItemStates.map((state) => (
                  <MenuItemSpecimen
                    key={state}
                    kind={kind}
                    state={state}
                    onAction={announce}
                  />
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section" aria-labelledby="menu-behavior-title">
        <div className="section-heading">
          <h2 id="menu-behavior-title">Keyboard interaction</h2>
          <p>
            Enter, Space, or Arrow Down opens the Menu. Arrow keys move through enabled items,
            Arrow Right opens a Submenu, Escape closes, and focus returns to the trigger.
          </p>
        </div>
      </section>

      <section className="page-section" aria-labelledby="menu-guidelines-title">
        <div className="section-heading">
          <h2 id="menu-guidelines-title">Guidelines</h2>
          <p>Keep menus compact, scannable, and easy to dismiss.</p>
        </div>
        <div className="menu-guideline-grid">
          {guidelines.map((guideline) => (
            <article key={guideline.title}>
              <h3>{guideline.title}</h3>
              <p>{guideline.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section" aria-labelledby="menu-api-title">
        <div className="section-heading">
          <h2 id="menu-api-title">Component props</h2>
        </div>
        <div className="menu-props-table-wrap">
          <table className="menu-props-table">
            <thead>
              <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
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
