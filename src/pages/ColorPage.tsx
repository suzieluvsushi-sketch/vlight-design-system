import { useEffect, useMemo, useState, type CSSProperties } from "react"
import { ArrowRight, ArrowUp } from "lucide-react"

import { DocumentationAlert, useDocumentationAlert } from "@/components/docs/documentation-alert"
import { DocumentationLabel } from "@/components/docs/documentation-label"
import { colorTokensFor, type ColorToken } from "@/lib/design-tokens"

type CustomProperties = CSSProperties & Record<`--${string}`, string>

const baseDescriptions: Record<string, string> = {
  primary: "Core brand color for primary actions, recognition, and high-attention interactions.",
  violet: "Expressive accent for creative content and high-energy moments.",
  blue: "Supporting color for information, links, data, and technology-led experiences.",
  mint: "Supporting color for positive feedback and success states.",
  orange: "Supporting color for caution, attention, and warning states.",
  red: "High-attention color for critical and destructive states.",
  neutral: "A blue-violet neutral scale anchored by Brand Dark.",
  "alpha-black": "Transparent black for overlays, scrims, shadows, and contrast on light surfaces.",
  "alpha-white": "Transparent white for highlights, borders, and overlays on dark surfaces.",
}

const semanticDescriptions: Record<string, string> = {
  brand: "Fixed identity roles that connect the VLight brand to its supporting base scales.",
  info: "Informational feedback roles referencing Blue.",
  success: "Positive confirmation roles referencing Mint.",
  warning: "Caution and attention roles referencing Orange.",
  danger: "Critical feedback roles referencing Red.",
  background: "Canvas and surface roles for light and inverse contexts.",
  text: "Readable content hierarchy for default and inverse surfaces.",
  icon: "Icon hierarchy separated from text for independent contrast control.",
  border: "Structural separation, focus, brand emphasis, and inverse outlines.",
  overlay: "Scrims and overlays that control background focus.",
  glass: "Light-theme translucent fills, borders, and highlights.",
}

const gradientRecipes = [
  {
    name: "Neutral to White",
    token: "background-neutral-to-white",
    description: "Neutral 50 to Neutral 0 · vertical",
    css: "linear-gradient(180deg, var(--color-base-neutral-50) 0%, var(--color-base-neutral-0) 100%)",
  },
  {
    name: "White to Neutral",
    token: "background-white-to-neutral",
    description: "Neutral 0 to Neutral 50 · vertical",
    css: "linear-gradient(180deg, var(--color-base-neutral-0) 0%, var(--color-base-neutral-50) 100%)",
  },
  {
    name: "Soft Horizontal",
    token: "brand-soft-horizontal",
    description: "Primary 50 to Blue 50 · horizontal",
    css: "linear-gradient(90deg, var(--color-base-primary-50) 0%, var(--color-base-blue-50) 100%)",
  },
  {
    name: "Soft Diagonal",
    token: "brand-soft-diagonal",
    description: "Primary 50 to Blue 50 · diagonal",
    css: "linear-gradient(135deg, var(--color-base-primary-50) -10%, var(--color-base-blue-50) 110%)",
  },
  {
    name: "Vivid Horizontal",
    token: "brand-vivid-horizontal",
    description: "Primary 400 through Primary 300 to Blue 500",
    css: "linear-gradient(90deg, var(--color-base-primary-400) 0%, var(--color-base-primary-300) 62%, var(--color-base-blue-500) 110%)",
  },
  {
    name: "Vivid Diagonal",
    token: "brand-vivid-diagonal",
    description: "Primary 500 through Primary 400 to Blue 500",
    css: "linear-gradient(135deg, var(--color-base-primary-500) -5%, var(--color-base-primary-400) 58%, var(--color-base-blue-500) 110%)",
  },
]

const groupTokens = (tokens: ColorToken[]) => {
  const groups = new Map<string, ColorToken[]>()

  tokens.forEach((token) => {
    const group = token.path[0]
    if (!group || token.path.length < 2) return
    groups.set(group, [...(groups.get(group) ?? []), token])
  })

  return [...groups.entries()]
}

const TokenCard = ({ token, onCopy }: { token: ColorToken; onCopy: (value: string, label: string) => void }) => {
  const label = token.path.slice(1).join("/")
  const swatchStyle = {
    "--swatch-color": `var(${token.cssVariable})`,
    "--swatch-backdrop":
      token.name.startsWith("alpha-white/") || token.source?.startsWith("alpha-white/")
        ? "var(--color-semantic-background-inverse)"
        : "var(--color-semantic-background-surface)",
  } as CustomProperties

  return (
    <button
      className="token-card"
      type="button"
      onClick={() => onCopy(token.resolvedHex, token.name)}
      aria-label={`Copy ${token.name} ${token.resolvedHex}`}
    >
      <span className="token-card-preview" style={swatchStyle} />
      <span className="token-card-data">
        <strong>{label}</strong>
        <code>{token.resolvedHex}</code>
        {token.source ? <small>{token.source}</small> : null}
      </span>
    </button>
  )
}

export function ColorPage() {
  const { notice, showAlert, dismissAlert } = useDocumentationAlert()
  const [showBackTop, setShowBackTop] = useState(false)
  const baseGroups = useMemo(() => groupTokens(colorTokensFor("Color Base")), [])
  const semanticGroups = useMemo(() => groupTokens(colorTokensFor("Color Semantic")), [])
  const foundations = semanticGroups.find(([group]) => group === "brand")?.[1] ?? []

  useEffect(() => {
    document.title = "Color · VLight Design System"

    const onScroll = () => setShowBackTop(window.scrollY > window.innerHeight)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const copyValue = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value)
      showAlert(`${label} copied`, "success")
    } catch {
      showAlert("Copy unavailable", "error", "Allow clipboard access and try again.")
    }
  }

  return (
    <article className="docs-page color-page">
      <div className="page-intro color-hero">
        <div className="color-hero-copy">
          <h1 className="docs-hero-title">Color</h1>
          <p>
            VLight color foundations, base palettes, semantic roles, and approved gradients. Select any
            color or gradient to copy its value.
          </p>
        </div>
        <div className="color-hero-art" aria-hidden="true">
          <div className="color-hero-artwork-frame">
            <img
              className="color-hero-image"
              src="./color-assets/color-hero.png"
              srcSet="./color-assets/color-hero.png 1x, ./color-assets/color-hero@2x.png 2x"
              alt=""
            />
          </div>
        </div>
      </div>

      <section className="page-section" id="architecture" aria-labelledby="architecture-title">
        <div className="section-heading">
          <h2 id="architecture-title">Color architecture</h2>
          <p>The canonical reference chain is Base Color → Semantic Token → Product UI.</p>
        </div>
        <div className="architecture-grid">
          {[
            ["Base", "Atomic color assets", "Brand foundations and scales define the complete spectrum."],
            ["Semantic", "Meaning and roles", "Purpose-led roles reference Base colors instead of independent values."],
            ["Product UI", "Interface application", "Product surfaces and components consume Semantic tokens."],
          ].map(([step, title, description], index) => (
            <div className="architecture-step" key={step}>
              <article className="architecture-card">
                <DocumentationLabel>{step}</DocumentationLabel>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
              {index < 2 ? <ArrowRight aria-hidden="true" /> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="page-section" id="foundations" aria-labelledby="foundations-title">
        <div className="section-heading">
          <h2 id="foundations-title">Brand foundations</h2>
          <p>Four fixed semantic anchors establish VLight’s identity and preserve their Base references.</p>
        </div>
        <div className="token-group">
          <div className="token-group-meta">
            <h3>Brand anchors</h3>
            <p>Fixed identity colors</p>
          </div>
          <div className="token-grid">
            {foundations.map((token) => (
              <TokenCard token={token} onCopy={copyValue} key={token.name} />
            ))}
          </div>
        </div>
      </section>

      <section className="page-section" id="base" aria-labelledby="base-title">
        <div className="section-heading">
          <h2 id="base-title">Base palettes</h2>
          <p>Atomic scales provide every available VLight color. Select a card to copy its Hex value.</p>
        </div>
        <div className="token-board">
          {baseGroups.map(([group, tokens]) => (
            <div className="token-group" key={group}>
              <div className="token-group-meta">
                <h3>{group.replace("alpha-", "Alpha ")}</h3>
                <p>{baseDescriptions[group]}</p>
              </div>
              <div className="token-grid">
                {tokens.map((token) => (
                  <TokenCard token={token} onCopy={copyValue} key={token.name} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section" id="semantic" aria-labelledby="semantic-title">
        <div className="section-heading">
          <h2 id="semantic-title">Semantic palettes</h2>
          <p>Semantic tokens turn Base values into stable interface roles while preserving every alias.</p>
        </div>
        <div className="token-board">
          {semanticGroups
            .filter(([group]) => group !== "brand")
            .map(([group, tokens]) => (
              <div className="token-group" key={group}>
                <div className="token-group-meta">
                  <h3>{group}</h3>
                  <p>{semanticDescriptions[group]}</p>
                </div>
                <div className="token-grid">
                  {tokens.map((token) => (
                    <TokenCard token={token} onCopy={copyValue} key={token.name} />
                  ))}
                </div>
              </div>
            ))}
        </div>
      </section>

      <section className="page-section" id="gradients" aria-labelledby="gradients-title">
        <div className="section-heading">
          <h2 id="gradients-title">Background and brand gradients</h2>
          <p>Reference recipes composed only from canonical Base color variables.</p>
        </div>
        <div className="gradient-grid">
          {gradientRecipes.map((gradient) => (
            <button
              className="gradient-card"
              type="button"
              key={gradient.token}
              onClick={() => copyValue(gradient.css, gradient.token)}
              aria-label={`Copy ${gradient.name} CSS gradient`}
            >
              <span
                className="gradient-preview"
                style={{ "--gradient": gradient.css } as CustomProperties}
              />
              <span className="gradient-data">
                <strong>{gradient.name}</strong>
                <code>{gradient.token}</code>
                <small>{gradient.description}</small>
              </span>
            </button>
          ))}
        </div>
      </section>

      {showBackTop ? (
        <button
          className="back-top"
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0 })}
        >
          <ArrowUp aria-hidden="true" />
        </button>
      ) : null}

      <DocumentationAlert notice={notice} onDismiss={dismissAlert} />
    </article>
  )
}
