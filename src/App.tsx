import { lazy, Suspense, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react"
import {
  LoaderCircle,
  Menu as MenuIcon,
  X,
} from "lucide-react"
import { IconDownload } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { ColorPage } from "@/pages/ColorPage"
import { TypographyPage } from "@/pages/TypographyPage"
import designTokensUrl from "../tokens/design-tokens.json?url"

import "./app.css"

const IconPage = lazy(() =>
  import("@/pages/IconPage").then(({ IconPage: IconPageComponent }) => ({
    default: IconPageComponent,
  })),
)

const ButtonPage = lazy(() =>
  import("@/pages/ButtonPage").then(({ ButtonPage: ButtonPageComponent }) => ({
    default: ButtonPageComponent,
  })),
)

const PromptPage = lazy(() =>
  import("@/pages/PromptPage").then(({ PromptPage: PromptPageComponent }) => ({
    default: PromptPageComponent,
  })),
)

const MessagePage = lazy(() =>
  import("@/pages/MessagePage").then(({ MessagePage: MessagePageComponent }) => ({
    default: MessagePageComponent,
  })),
)

const InputPage = lazy(() =>
  import("@/pages/InputPage").then(({ InputPage: InputPageComponent }) => ({
    default: InputPageComponent,
  })),
)

const SelectPage = lazy(() =>
  import("@/pages/SelectPage").then(({ SelectPage: SelectPageComponent }) => ({
    default: SelectPageComponent,
  })),
)

const RadioPage = lazy(() =>
  import("@/pages/RadioPage").then(({ RadioPage: RadioPageComponent }) => ({
    default: RadioPageComponent,
  })),
)

const CheckboxPage = lazy(() =>
  import("@/pages/CheckboxPage").then(({ CheckboxPage: CheckboxPageComponent }) => ({
    default: CheckboxPageComponent,
  })),
)

const BadgePage = lazy(() =>
  import("@/pages/BadgePage").then(({ BadgePage: BadgePageComponent }) => ({
    default: BadgePageComponent,
  })),
)

const AlertPage = lazy(() =>
  import("@/pages/AlertPage").then(({ AlertPage: AlertPageComponent }) => ({
    default: AlertPageComponent,
  })),
)

const TabPage = lazy(() =>
  import("@/pages/TabPage").then(({ TabPage: TabPageComponent }) => ({
    default: TabPageComponent,
  })),
)

const MenuPage = lazy(() =>
  import("@/pages/MenuPage").then(({ MenuPage: MenuPageComponent }) => ({
    default: MenuPageComponent,
  })),
)

const HistoryPage = lazy(() =>
  import("@/pages/HistoryPage").then(({ HistoryPage: HistoryPageComponent }) => ({
    default: HistoryPageComponent,
  })),
)

const pageIds = [
  "color",
  "typography",
  "icon",
  "button",
  "input",
  "select",
  "radio",
  "checkbox",
  "menu",
  "tab",
  "badge",
  "alert",
  "prompt",
  "message",
  "history",
] as const

type PageId = (typeof pageIds)[number]

const pageFromLocation = (): PageId => {
  const requestedPage = new URLSearchParams(window.location.search).get("page")
  return pageIds.find((page) => page === requestedPage) ?? "color"
}

const navigation = [
  {
    label: "Foundation",
    items: [
      { label: "Color", href: "?page=color", page: "color" },
      { label: "Typography", href: "?page=typography", page: "typography" },
      { label: "Icon", href: "?page=icon", page: "icon" },
    ],
  },
  {
    label: "Component",
    items: [
      {
        label: "Prompt",
        href: "?page=prompt",
        page: "prompt",
      },
      {
        label: "Message",
        href: "?page=message",
        page: "message",
      },
      {
        label: "Button",
        href: "?page=button",
        page: "button",
      },
      {
        label: "Input",
        href: "?page=input",
        page: "input",
      },
      {
        label: "Select",
        href: "?page=select",
        page: "select",
      },
      {
        label: "Radio",
        href: "?page=radio",
        page: "radio",
      },
      {
        label: "Checkbox",
        href: "?page=checkbox",
        page: "checkbox",
      },
      {
        label: "Menu",
        href: "?page=menu",
        page: "menu",
      },
      {
        label: "Tabs",
        href: "?page=tab",
        page: "tab",
      },
      {
        label: "Badge",
        href: "?page=badge",
        page: "badge",
      },
      {
        label: "Alert",
        href: "?page=alert",
        page: "alert",
      },
    ],
  },
] as const

function App() {
  const [navigationOpen, setNavigationOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState<PageId>(pageFromLocation)
  const [pageLoading, setPageLoading] = useState(true)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const isHistoryPage = currentPage === "history"
  const usesPreviewPageLayout =
    currentPage === "color" ||
    currentPage === "typography" ||
    currentPage === "icon" ||
    currentPage === "button" ||
    currentPage === "input" ||
    currentPage === "select" ||
    currentPage === "radio" ||
    currentPage === "checkbox" ||
    currentPage === "menu" ||
    currentPage === "tab" ||
    currentPage === "badge" ||
    currentPage === "alert" ||
    currentPage === "prompt" ||
    currentPage === "message"

  const closeNavigation = () => {
    setNavigationOpen(false)
    window.requestAnimationFrame(() => menuButtonRef.current?.focus())
  }

  const downloadDesignTokens = () => {
    const link = document.createElement("a")
    link.href = designTokensUrl
    link.download = "design-tokens.json"
    link.click()
  }

  const transitionToPage = (
    event: ReactMouseEvent<HTMLAnchorElement>,
    page: PageId,
    href: string,
  ) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    if (page === currentPage) {
      event.preventDefault()
      setNavigationOpen(false)
      return
    }

    event.preventDefault()
    setNavigationOpen(false)
    setPageLoading(true)

    window.setTimeout(() => {
      window.history.pushState({}, "", href)
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: "auto" })
      window.setTimeout(() => setPageLoading(false), 220)
    }, 140)
  }

  useEffect(() => {
    const initialLoadTimer = window.setTimeout(() => setPageLoading(false), 480)

    const handleHistoryNavigation = () => {
      setPageLoading(true)
      window.setTimeout(() => {
        setCurrentPage(pageFromLocation())
        window.scrollTo({ top: 0, behavior: "auto" })
        window.setTimeout(() => setPageLoading(false), 220)
      }, 140)
    }

    window.addEventListener("popstate", handleHistoryNavigation)

    return () => {
      window.clearTimeout(initialLoadTimer)
      window.removeEventListener("popstate", handleHistoryNavigation)
    }
  }, [])

  useEffect(() => {
    if (!navigationOpen) return

    const previousOverflow = document.body.style.overflow
    const mobileNavigation = window.matchMedia("(max-width: 49rem)")
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeNavigation()
    }
    const handleBreakpointChange = (event: MediaQueryListEvent) => {
      if (!event.matches) setNavigationOpen(false)
    }
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)
    mobileNavigation.addEventListener("change", handleBreakpointChange)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
      mobileNavigation.removeEventListener("change", handleBreakpointChange)
    }
  }, [navigationOpen])

  return (
    <div className="docs-app">
      <header
        className="docs-header"
        style={{
          backdropFilter: 'blur(var(--layout-blur-background-sm))',
          WebkitBackdropFilter: 'blur(var(--layout-blur-background-sm))',
        }}
      >
        <div className="docs-header-brand">
          <a
            className="brand-lockup"
            href="?page=color"
            aria-label="VLight Design System home"
            onClick={(event) => transitionToPage(event, "color", "?page=color")}
          >
            <picture>
              <source media="(max-width: 549px)" srcSet="./vlight-logo-mark@3x.png" />
              <img className="brand-logo" src="./vlight-logo-frame.png" alt="VLight" />
            </picture>
          </a>
          <nav className="docs-top-navigation" aria-label="Documentation views">
            <a
              className="docs-top-nav-link"
              href="?page=color"
              aria-current={!isHistoryPage ? "page" : undefined}
              onClick={(event) => transitionToPage(event, "color", "?page=color")}
            >
              Component
            </a>
            <a
              className="docs-top-nav-link"
              href="?page=history"
              aria-current={isHistoryPage ? "page" : undefined}
              onClick={(event) => transitionToPage(event, "history", "?page=history")}
            >
              History
            </a>
          </nav>
        </div>
        <div className="docs-header-actions">
          <Button
            className="docs-token-download docs-token-download--desktop"
            variant="primary"
            tone="neutral"
            size="small"
            leadingIcon={<IconDownload />}
            aria-label="Download Design token.json"
            type="button"
            onClick={downloadDesignTokens}
          >
            Token.json
          </Button>
          <Button
            className="docs-token-download docs-token-download--compact"
            variant="primary"
            tone="neutral"
            size="small"
            iconOnly
            leadingIcon={<IconDownload />}
            aria-label="Download Design token.json"
            data-tooltip="Download Design token.json"
            type="button"
            onClick={downloadDesignTokens}
          />
          {!isHistoryPage ? (
            <button
              className="docs-menu-button"
              type="button"
              aria-label={navigationOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-controls="docs-navigation-panel"
              aria-expanded={navigationOpen}
              data-open={navigationOpen}
              ref={menuButtonRef}
              onClick={() => navigationOpen ? closeNavigation() : setNavigationOpen(true)}
            >
              <MenuIcon className="docs-menu-button__open-icon" aria-hidden="true" />
              <X className="docs-menu-button__close-icon" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </header>

      <div className="docs-shell">
        {!isHistoryPage ? (
          <>
            <button
              className="docs-nav-backdrop"
              type="button"
              aria-label="Close navigation menu"
              data-open={navigationOpen}
              onClick={closeNavigation}
            />
            <aside
              className="docs-sidebar"
              id="docs-navigation-panel"
              aria-label="Documentation navigation"
              data-open={navigationOpen}
            >
              <nav className="docs-navigation" aria-label="Design system sections">
                {navigation.map((group) => (
                  <section className="navigation-group" key={group.label}>
                    <h2>{group.label}</h2>
                    <ul>
                      {group.items.map((item) => {
                        const isActive = item.page === currentPage

                        return (
                          <li key={item.label}>
                            <a
                              className={`navigation-link${isActive ? " is-active" : ""}`}
                              href={item.href}
                              aria-current={isActive ? "page" : undefined}
                              onClick={(event) => transitionToPage(event, item.page, item.href)}
                            >
                              <span className="navigation-link__label">{item.label}</span>
                              {!isActive && (item.page === "prompt" || item.page === "message") ? (
                                <span className="navigation-link__new-tag" aria-hidden="true">
                                  AI
                                </span>
                              ) : null}
                              {isActive ? (
                                <span className="navigation-link__active-art" aria-hidden="true">
                                  <img
                                    src="./menu-assets/navigation-selected-art-transparent@3x.png"
                                    alt=""
                                  />
                                </span>
                              ) : null}
                            </a>
                          </li>
                        )
                      })}
                    </ul>
                  </section>
                ))}
              </nav>
            </aside>
          </>
        ) : null}

        <main
          className={`docs-main${usesPreviewPageLayout ? " is-component-preview" : ""}${isHistoryPage ? " is-history" : ""}`}
          id="main-content"
          aria-busy={pageLoading}
        >
          <div
            className="docs-page-loader"
            data-active={pageLoading}
            role="status"
            aria-live="polite"
            aria-hidden={!pageLoading}
          >
            <LoaderCircle className="docs-page-loader__ring" strokeWidth={2} aria-hidden="true" />
            <span className="sr-only">Loading page</span>
          </div>
          <Suspense fallback={null}>
            {currentPage === "typography" ? (
              <TypographyPage />
            ) : currentPage === "icon" ? (
              <IconPage />
            ) : currentPage === "button" ? (
              <ButtonPage />
            ) : currentPage === "input" ? (
              <InputPage />
            ) : currentPage === "select" ? (
              <SelectPage />
            ) : currentPage === "radio" ? (
              <RadioPage />
            ) : currentPage === "checkbox" ? (
              <CheckboxPage />
            ) : currentPage === "menu" ? (
              <MenuPage />
            ) : currentPage === "tab" ? (
              <TabPage />
            ) : currentPage === "badge" ? (
              <BadgePage />
            ) : currentPage === "alert" ? (
              <AlertPage />
            ) : currentPage === "prompt" ? (
              <PromptPage />
            ) : currentPage === "message" ? (
              <MessagePage />
            ) : currentPage === "history" ? (
              <HistoryPage />
            ) : (
              <ColorPage />
            )}
          </Suspense>
        </main>
      </div>
    </div>
  )
}

export default App
