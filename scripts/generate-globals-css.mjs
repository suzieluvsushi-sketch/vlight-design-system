import { readFile, writeFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import path from "node:path"

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const tokenFile = path.join(projectRoot, "tokens", "design-tokens.json")
const outputFile = path.join(projectRoot, "src", "globals.css")

const collectionPrefixes = {
  "Color Base": "color-base",
  "Color Semantic": "color-semantic",
  Typography: "typography",
  Layout: "layout",
  Component: "component",
}

const source = JSON.parse(await readFile(tokenFile, "utf8"))

const slug = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

const cssVariableName = (collectionName, tokenName) => {
  const prefix = collectionPrefixes[collectionName]

  if (!prefix) {
    throw new Error(`No CSS namespace configured for collection: ${collectionName}`)
  }

  return `--${prefix}-${slug(tokenName)}`
}

const formatNumber = (value) =>
  Number.isInteger(value) ? String(value) : String(Number(value.toFixed(3)))

const formatShadowColor = ({ r, g, b, a }) =>
  `rgb(${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)} / ${formatNumber(a)})`

const formatShadow = (effect) =>
  `${formatNumber(effect.offset.x)}px ${formatNumber(effect.offset.y)}px ${formatNumber(effect.radius)}px ${formatNumber(effect.spread)}px ${formatShadowColor(effect.color)}`

const formatLiteral = (collectionName, token) => {
  const modeValues = Object.values(token.valuesByMode)

  if (modeValues.length !== 1) {
    throw new Error(
      `${collectionName}/${token.name} has ${modeValues.length} modes; this generator currently supports the light mode only.`,
    )
  }

  const value = modeValues[0].value

  if (value && typeof value === "object" && "$alias" in value) {
    return `var(${cssVariableName(value.$target.collection, value.$target.name)})`
  }

  if (token.$type === "color") {
    return value.hex
  }

  if (token.$type === "string") {
    return JSON.stringify(value)
  }

  if (token.$type === "float") {
    const unitless =
      collectionName === "Typography" && token.name.startsWith("font-weight/")

    return `${formatNumber(value)}${unitless ? "" : "px"}`
  }

  throw new Error(`Unsupported token type: ${collectionName}/${token.name} (${token.$type})`)
}

const collections = new Map(source.collections.map((collection) => [collection.name, collection]))

const tokenRef = (collectionName, tokenName) => {
  const collection = collections.get(collectionName)

  if (!collection?.tokens.some((token) => token.name === tokenName)) {
    throw new Error(`Missing token: ${collectionName}/${tokenName}`)
  }

  return `var(${cssVariableName(collectionName, tokenName)})`
}

const shadcnMappings = {
  background: tokenRef("Color Semantic", "background/canvas"),
  foreground: tokenRef("Color Semantic", "text/primary"),
  card: tokenRef("Color Semantic", "background/surface"),
  "card-foreground": tokenRef("Color Semantic", "text/primary"),
  popover: tokenRef("Color Semantic", "background/surface"),
  "popover-foreground": tokenRef("Color Semantic", "text/primary"),
  primary: tokenRef("Color Semantic", "background/brand"),
  "primary-foreground": tokenRef("Color Semantic", "text/inverse"),
  secondary: tokenRef("Color Semantic", "background/muted"),
  "secondary-foreground": tokenRef("Color Semantic", "text/primary"),
  muted: tokenRef("Color Semantic", "background/muted"),
  "muted-foreground": tokenRef("Color Semantic", "text/tertiary"),
  accent: tokenRef("Color Semantic", "background/subtle"),
  "accent-foreground": tokenRef("Color Semantic", "text/primary"),
  destructive: tokenRef("Color Semantic", "danger/content"),
  "destructive-foreground": tokenRef("Color Semantic", "text/inverse"),
  border: tokenRef("Color Semantic", "border/default"),
  input: tokenRef("Color Semantic", "border/default"),
  ring: tokenRef("Color Semantic", "border/focus"),
  "chart-1": tokenRef("Color Semantic", "brand/purple"),
  "chart-2": tokenRef("Color Semantic", "brand/blue"),
  "chart-3": tokenRef("Color Semantic", "success/contentlight"),
  "chart-4": tokenRef("Color Semantic", "warning/contentlight"),
  "chart-5": tokenRef("Color Semantic", "brand/violet"),
  sidebar: tokenRef("Color Semantic", "background/surface"),
  "sidebar-foreground": tokenRef("Color Semantic", "text/primary"),
  "sidebar-primary": tokenRef("Color Semantic", "background/brand"),
  "sidebar-primary-foreground": tokenRef("Color Semantic", "text/inverse"),
  "sidebar-accent": tokenRef("Color Semantic", "background/subtle"),
  "sidebar-accent-foreground": tokenRef("Color Semantic", "text/primary"),
  "sidebar-border": tokenRef("Color Semantic", "border/subtle"),
  "sidebar-ring": tokenRef("Color Semantic", "border/focus"),
}

const collectionBlocks = source.collections.map((collection) => {
  const variables = collection.tokens
    .map(
      (token) =>
        `  ${cssVariableName(collection.name, token.name)}: ${formatLiteral(collection.name, token)};`,
    )
    .join("\n")

  return `  /* ${collection.name} */\n${variables}`
})

const effectVariables = source.styles.effect
  .map((style) => {
    const shadows = style.effects.filter(
      (effect) => effect.visible && effect.type === "DROP_SHADOW",
    )

    if (shadows.length === 0) return null

    return `  --effect-${slug(style.name)}: ${shadows.map(formatShadow).join(", ")};`
  })
  .filter(Boolean)
  .join("\n")

const shadcnVariables = Object.entries(shadcnMappings)
  .map(([name, value]) => `  --${name}: ${value};`)
  .join("\n")

const shadcnThemeVariables = Object.keys(shadcnMappings)
  .map((name) => `  --color-${name}: var(--${name});`)
  .join("\n")

const css = `/* This file is generated by scripts/generate-globals-css.mjs. */
/* Source: tokens/design-tokens.json. Edit the token source or generator, then run npm run tokens:css. */

@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@fontsource/inter/latin-300.css";
@import "@fontsource/inter/latin-400.css";
@import "@fontsource/inter/latin-500.css";
@import "@fontsource/inter/latin-600.css";
@import "@fontsource/poppins/latin-400.css";
@import "@fontsource/poppins/latin-500.css";
@import "@fontsource/poppins/latin-600.css";

/* Kept for future dark tokens; no dark-mode values are defined yet. */
@custom-variant dark (&:is(.dark *));

:root {
  color-scheme: light;

${collectionBlocks.join("\n\n")}

  /* Effect Styles */
${effectVariables}

  /* shadcn semantic adapter */
${shadcnVariables}
  --radius: ${tokenRef("Layout", "radius/sm")};
}

@theme inline {
  --font-sans: var(--typography-font-family-body), sans-serif;
  --font-heading: var(--typography-font-family-display), sans-serif;
${shadcnThemeVariables}
  --radius-sm: var(--layout-radius-xs);
  --radius-md: var(--layout-radius-sm);
  --radius-lg: var(--layout-radius-md);
  --radius-xl: var(--layout-radius-lg);
  --radius-2xl: var(--layout-radius-xl);
  --radius-3xl: var(--layout-radius-2xl);
  --radius-4xl: var(--layout-radius-2xl);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }

  html {
    font-family: var(--typography-font-family-body), sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    @apply bg-background text-foreground;
    min-width: calc(var(--component-menu-surface-width) + var(--layout-spacing-16) + var(--layout-spacing-4));
    min-height: 100svh;
    margin: 0;
  }
}

@media (forced-colors: none) {
  * {
    scrollbar-color: var(--color-semantic-text-tertiary)
      var(--color-semantic-background-subtle);
    scrollbar-width: thin;
  }

  *::-webkit-scrollbar {
    width: var(--layout-spacing-2);
    height: var(--layout-spacing-2);
  }

  *::-webkit-scrollbar-track {
    background: var(--color-semantic-background-subtle);
  }

  *::-webkit-scrollbar-thumb {
    background: var(--color-semantic-text-tertiary);
    border: var(--layout-stroke-width-2) solid var(--color-semantic-background-subtle);
    border-radius: var(--layout-radius-full);
  }

  *::-webkit-scrollbar-thumb:hover {
    background: var(--color-semantic-text-secondary);
  }

  *::-webkit-scrollbar-thumb:active {
    background: var(--color-semantic-text-primary);
  }
}
`

await writeFile(outputFile, css)
console.log(`Generated ${path.relative(projectRoot, outputFile)} from ${path.relative(projectRoot, tokenFile)}`)
