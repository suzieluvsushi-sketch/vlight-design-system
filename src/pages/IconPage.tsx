import { useEffect } from "react"
import { IconPlus, type TablerIcon } from "@tabler/icons-react"

import { DocumentationAlert, useDocumentationAlert } from "@/components/docs/documentation-alert"
import {
  basicFilledIcons,
  basicOutlineIcons,
  productFilledIcons,
  productOutlineIcons,
  socialIconNames,
  type IconCatalogItem,
} from "@/lib/icon-catalog"

function IconBoard({
  title,
  tone,
  icons,
  onCopy,
}: {
  title: string
  tone: "outline" | "filled"
  icons: IconCatalogItem[]
  onCopy: (value: string, label: string) => void
}) {
  return (
    <section className={`icon-style-board is-${tone}`} aria-label={`${title} icon set`}>
      <header className="icon-style-board-heading">
        <h3>{title}</h3>
        <span>{icons.length}</span>
      </header>
      <div className="icon-library-grid">
        {icons.map(([label, exportName, Icon], index) => (
          <button
            className="icon-library-item"
            type="button"
            title={`${label} · Copy SVG`}
            aria-label={`Copy ${label} SVG`}
            onClick={(event) => {
              const svg = event.currentTarget.querySelector("svg")
              if (svg) onCopy(svg.outerHTML, label)
            }}
            key={`${exportName}-${index}`}
          >
            <Icon aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  )
}

function SocialBoard({
  title,
  tone,
  onCopy,
}: {
  title: string
  tone: "brand-color" | "inverse"
  onCopy: (value: string, label: string) => void
}) {
  return (
    <section className={`icon-style-board social-icon-board is-${tone}`} aria-label={`${title} social icons`}>
      <header className="icon-style-board-heading">
        <h3>{title}</h3>
        <span>{socialIconNames.length}</span>
      </header>
      <div className="icon-library-grid is-social">
        {socialIconNames.map((name) => {
          const assetPath = `./icon-assets/social/${name}-${tone}.svg`
          const label = `${name} ${title}`

          return (
            <button
              className="icon-library-item"
              type="button"
              title={label}
              aria-label={`Copy ${label} asset path`}
              onClick={() => onCopy(assetPath, label)}
              key={name}
            >
              <img src={assetPath} alt="" />
            </button>
          )
        })}
      </div>
    </section>
  )
}

const iconSizes = [12, 16, 20, 24, 32] as const

function IconSizeSample({ size, Icon }: { size: (typeof iconSizes)[number]; Icon: TablerIcon }) {
  return (
    <div className="icon-size-sample">
      <span className={`icon-size-glyph is-size-${size}`}>
        <Icon aria-hidden="true" />
      </span>
      <span>{size}</span>
    </div>
  )
}

export function IconPage() {
  const { notice, showAlert, dismissAlert } = useDocumentationAlert()

  useEffect(() => {
    document.title = "Icon · VLight Design System"
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
    <article className="docs-page icon-page">
      <div className="page-intro icon-hero">
        <div className="icon-hero-copy">
          <h1 className="docs-hero-title">Icon</h1>
          <p>
            VLight icons use Tabler as the canonical drawing source, organized into basic, product,
            social, and optical-size sets.
          </p>
        </div>
        <div className="icon-hero-art" aria-hidden="true">
          <img
            className="icon-hero-image"
            src="./icon-assets/icon-hero.png"
            srcSet="./icon-assets/icon-hero.png 1x, ./icon-assets/icon-hero@2x.png 2x"
            alt=""
          />
        </div>
      </div>

      <section className="page-section" id="basic-icons" aria-labelledby="basic-icons-title">
        <div className="section-heading">
          <h2 id="basic-icons-title">Basic Icons</h2>
          <p>
            Core interface actions and status symbols. Use the disabled icon token whenever the
            surrounding control is disabled.
          </p>
        </div>
        <div className="icon-style-grid">
          <IconBoard title="Outline" tone="outline" icons={basicOutlineIcons} onCopy={copyValue} />
          <IconBoard title="Filled" tone="filled" icons={basicFilledIcons} onCopy={copyValue} />
        </div>
      </section>

      <section className="page-section" id="product-icons" aria-labelledby="product-icons-title">
        <div className="section-heading">
          <h2 id="product-icons-title">Product Icons</h2>
          <p>
            Product, media, AI, scan, and automation concepts curated from the same Tabler source.
          </p>
        </div>
        <div className="icon-style-grid">
          <IconBoard title="Outline" tone="outline" icons={productOutlineIcons} onCopy={copyValue} />
          <IconBoard title="Filled" tone="filled" icons={productFilledIcons} onCopy={copyValue} />
        </div>
      </section>

      <section className="page-section" id="social-icons" aria-labelledby="social-icons-title">
        <div className="section-heading">
          <h2 id="social-icons-title">Social Icons</h2>
          <p>Use Brand Color on light surfaces and Inverse on dark or image-backed surfaces.</p>
        </div>
        <div className="icon-style-grid">
          <SocialBoard title="Brand Color" tone="brand-color" onCopy={copyValue} />
          <SocialBoard title="Inverse" tone="inverse" onCopy={copyValue} />
        </div>
      </section>

      <section className="page-section" id="icon-sizes" aria-labelledby="icon-sizes-title">
        <div className="section-heading">
          <h2 id="icon-sizes-title">Icon Sizes</h2>
          <p>Choose only from the five Layout icon-size tokens defined in the design system.</p>
        </div>
        <div className="icon-size-board">
          {iconSizes.map((size) => (
            <IconSizeSample size={size} Icon={IconPlus} key={size} />
          ))}
        </div>
      </section>

      <DocumentationAlert notice={notice} onDismiss={dismissAlert} />
    </article>
  )
}
