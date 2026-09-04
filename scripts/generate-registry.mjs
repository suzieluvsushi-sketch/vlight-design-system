import { readFile, readdir, writeFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import path from "node:path"

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const tokenSourcePath = "tokens/design-tokens.json"
const tokenRuntimePath = "src/globals.css"
const iconCatalogPath = "src/lib/icon-catalog.ts"
const iconStylePath = "src/iconography.css"

const readProjectFile = (relativePath) =>
  readFile(path.join(projectRoot, relativePath), "utf8")

const [tokenSourceText, globalsCss, iconCatalogSource] = await Promise.all([
  readProjectFile(tokenSourcePath),
  readProjectFile(tokenRuntimePath),
  readProjectFile(iconCatalogPath),
])

const tokenSource = JSON.parse(tokenSourceText)

const slug = (value) =>
  value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

const unique = (values) => [...new Set(values)]
const sortedUnique = (values) => unique(values).sort((a, b) => a.localeCompare(b))

const collectionDefinitions = [
  {
    id: "foundation.color.base",
    name: "Color Base",
    collectionName: "Color Base",
    cssPrefix: "color-base",
    role: "Primitive color palette",
  },
  {
    id: "foundation.color.semantic",
    name: "Color Semantic",
    collectionName: "Color Semantic",
    cssPrefix: "color-semantic",
    role: "Semantic color roles consumed by product UI",
  },
  {
    id: "foundation.typography.variables",
    name: "Typography Variables",
    collectionName: "Typography",
    cssPrefix: "typography",
    role: "Font family, weight, size, and line-height primitives",
  },
  {
    id: "foundation.layout",
    name: "Layout",
    collectionName: "Layout",
    cssPrefix: "layout",
    role: "Radius, spacing, padding, blur, control height, icon size, and stroke width",
  },
  {
    id: "foundation.component-tokens",
    name: "Component Tokens",
    collectionName: "Component",
    cssPrefix: "component",
    role: "Component-level visual tokens; kept in Foundation because these are tokens, not React components",
  },
]

const cssVariableDefinitions = new Set(
  [...globalsCss.matchAll(/^\s*(--[a-zA-Z0-9_-]+)\s*:/gm)].map((match) => match[1]),
)

const foundationVariableLookup = new Map()

const foundationCollections = collectionDefinitions.map((definition) => {
  const collection = tokenSource.collections.find(
    (candidate) => candidate.name === definition.collectionName,
  )

  if (!collection) {
    throw new Error(`Missing token collection: ${definition.collectionName}`)
  }

  const tokens = collection.tokens.map((token) => {
    const cssVariable = `--${definition.cssPrefix}-${slug(token.name)}`
    const entry = {
      name: token.name,
      path: token.path,
      type: token.$type,
      cssVariable,
      runtimeStatus: cssVariableDefinitions.has(cssVariable) ? "available" : "missing",
    }

    foundationVariableLookup.set(cssVariable, {
      foundationId: definition.id,
      tokenName: token.name,
    })

    return entry
  })

  const missingRuntimeTokens = tokens
    .filter((token) => token.runtimeStatus === "missing")
    .map((token) => token.name)

  return {
    id: definition.id,
    name: definition.name,
    kind: definition.collectionName === "Component" ? "component-token-collection" : "token-collection",
    role: definition.role,
    sourcePath: tokenSourcePath,
    sourceSelector: `collections[name=${JSON.stringify(definition.collectionName)}]`,
    runtimePath: tokenRuntimePath,
    runtimeGeneratedBy: "scripts/generate-globals-css.mjs",
    editAt: tokenSourcePath,
    tokenCount: tokens.length,
    subgroups: unique(tokens.map((token) => token.path[0])),
    runtimeStatus: missingRuntimeTokens.length === 0 ? "complete" : "incomplete",
    missingRuntimeTokens,
    tokens,
  }
})

const textStyles = tokenSource.styles.text.map((style) => ({
  name: style.name,
  subgroup: style.name.split("/")[0],
  type: "typography-style",
  runtimeStatus: "not-exported",
}))

const textStyleEntry = {
  id: "foundation.typography.text-styles",
  name: "Typography Text Styles",
  kind: "composite-style-collection",
  role: "Composite Figma text styles",
  sourcePath: tokenSourcePath,
  sourceSelector: "styles.text",
  runtimePath: tokenRuntimePath,
  runtimeGeneratedBy: "scripts/generate-globals-css.mjs",
  editAt: tokenSourcePath,
  tokenCount: textStyles.length,
  subgroups: unique(textStyles.map((style) => style.subgroup)),
  runtimeStatus: "not-exported",
  runtimeNote: "The current CSS generator does not export composite text styles. Components should not assume text-style CSS variables exist unless the generator is extended.",
  tokens: textStyles,
}

const effectStyles = tokenSource.styles.effect.map((style) => {
  const hasDropShadow = style.effects.some(
    (effect) => effect.visible && effect.type === "DROP_SHADOW",
  )
  const cssVariable = hasDropShadow ? `--effect-${slug(style.name)}` : null

  if (cssVariable) {
    foundationVariableLookup.set(cssVariable, {
      foundationId: "foundation.effects",
      tokenName: style.name,
    })
  }

  return {
    name: style.name,
    subgroup: style.name.split("/")[0],
    type: "effect-style",
    cssVariable,
    runtimeStatus:
      cssVariable && cssVariableDefinitions.has(cssVariable) ? "available" : "not-exported",
  }
})

const exportedEffectCount = effectStyles.filter(
  (style) => style.runtimeStatus === "available",
).length

const effectStyleEntry = {
  id: "foundation.effects",
  name: "Effect Styles",
  kind: "composite-style-collection",
  role: "Figma shadows, background blurs, and modal overlay effects",
  sourcePath: tokenSourcePath,
  sourceSelector: "styles.effect",
  runtimePath: tokenRuntimePath,
  runtimeGeneratedBy: "scripts/generate-globals-css.mjs",
  editAt: tokenSourcePath,
  tokenCount: effectStyles.length,
  exportedTokenCount: exportedEffectCount,
  subgroups: unique(effectStyles.map((style) => style.subgroup)),
  runtimeStatus: exportedEffectCount === effectStyles.length ? "complete" : "partial",
  runtimeNote: "The current CSS generator exports visible DROP_SHADOW styles only.",
  tokens: effectStyles,
}

const foundationEntries = [
  foundationCollections[0],
  foundationCollections[1],
  foundationCollections[2],
  textStyleEntry,
  foundationCollections[3],
  effectStyleEntry,
  foundationCollections[4],
]

const shadcnAdapterBlock =
  globalsCss.match(/\/\* shadcn semantic adapter \*\/([\s\S]*?)\n\s*--radius:/)?.[1] ?? ""
const shadcnAliases = [...shadcnAdapterBlock.matchAll(/^\s*(--[a-zA-Z0-9_-]+)\s*:/gm)].map(
  (match) => match[1],
)
const tailwindThemeBlock = globalsCss.match(/@theme inline \{([\s\S]*?)\n\}/)?.[1] ?? ""
const tailwindThemeAliases = [
  ...tailwindThemeBlock.matchAll(/^\s*(--[a-zA-Z0-9_-]+)\s*:/gm),
].map((match) => match[1])

const iconCatalogs = [
  { exportName: "basicOutlineIcons", category: "basic", style: "outline" },
  { exportName: "basicFilledIcons", category: "basic", style: "filled" },
  { exportName: "productOutlineIcons", category: "product", style: "outline" },
  { exportName: "productFilledIcons", category: "product", style: "filled" },
]

const iconByExportName = new Map()

for (const catalog of iconCatalogs) {
  const block = iconCatalogSource.match(
    new RegExp(`export const ${catalog.exportName}: IconCatalogItem\\[\\] = \\[([\\s\\S]*?)\\n\\]`),
  )?.[1]

  if (!block) {
    throw new Error(`Missing icon catalog: ${catalog.exportName}`)
  }

  for (const match of block.matchAll(/\["([^"]+)",\s*"([^"]+)",\s*([A-Za-z0-9_]+)\]/g)) {
    const [, displayName, exportName, componentName] = match

    if (exportName !== componentName) {
      throw new Error(`Icon catalog mismatch: ${exportName} != ${componentName}`)
    }

    const existing = iconByExportName.get(exportName) ?? {
      id: `icon.tabler.${slug(exportName)}`,
      name: exportName,
      kind: "react-component",
      filePath: iconCatalogPath,
      sharedStylePath: iconStylePath,
      sourcePackage: "@tabler/icons-react",
      exportName,
      displayNames: [],
      catalogMemberships: [],
    }

    existing.displayNames = unique([...existing.displayNames, displayName])
    existing.catalogMemberships.push({
      catalog: catalog.exportName,
      category: catalog.category,
      style: catalog.style,
      displayName,
    })
    iconByExportName.set(exportName, existing)
  }
}

const socialBlock = iconCatalogSource.match(
  /export const socialIconNames = \[([\s\S]*?)\]\s+as const/,
)?.[1]

if (!socialBlock) {
  throw new Error("Missing socialIconNames catalog")
}

const socialNames = [...socialBlock.matchAll(/"([^"]+)"/g)].map((match) => match[1])
const socialIcons = []

for (const name of socialNames) {
  const variants = ["brand-color", "inverse"].map((variant) => ({
    name: variant,
    filePath: `public/icon-assets/social/${name}-${variant}.svg`,
  }))

  for (const variant of variants) {
    await readProjectFile(variant.filePath)
  }

  socialIcons.push({
    id: `icon.social.${slug(name)}`,
    name: name,
    displayName: name === "x" ? "X" : name[0].toUpperCase() + name.slice(1),
    kind: "svg-asset",
    catalogPath: iconCatalogPath,
    variants,
  })
}

const tablerIcons = [...iconByExportName.values()].sort((a, b) =>
  a.name.localeCompare(b.name),
)

const componentModules = [
  {
    id: "component.alert",
    name: "Alert",
    module: "alert",
    exports: ["Alert"],
  },
  {
    id: "component.badge",
    name: "Badge",
    module: "badge",
    exports: ["Badge"],
  },
  {
    id: "component.button",
    name: "Button",
    module: "button",
    exports: ["Button", "SplitButton"],
  },
  {
    id: "component.checkbox",
    name: "Checkbox",
    module: "checkbox",
    exports: ["CheckboxControl", "CheckboxField"],
  },
  {
    id: "component.input",
    name: "Input",
    module: "input",
    exports: ["Input"],
  },
  {
    id: "component.menu",
    name: "Menu",
    module: "menu",
    exports: ["Menu", "MenuItem", "MenuSubmenu", "MenuGroup", "MenuDivider"],
  },
  {
    id: "component.message",
    name: "Message",
    module: "message",
    exports: [
      "UserMessage",
      "AiMessage",
      "MessageSource",
      "MessageSources",
      "MessageInlineCitation",
      "MessageReasoning",
      "MessageStatus",
    ],
    componentDependencies: [
      { componentId: "component.button", exports: ["Button"] },
      { componentId: "component.prompt", exports: ["PromptTextArea"] },
    ],
  },
  {
    id: "component.prompt",
    name: "Prompt",
    module: "prompt",
    exports: ["PromptComposer", "PromptTextArea", "PromptAttachment", "PromptAttachmentList"],
    componentDependencies: [{ componentId: "component.button", exports: ["Button"] }],
  },
  {
    id: "component.radio",
    name: "Radio",
    module: "radio",
    exports: ["RadioGroup", "RadioField"],
  },
  {
    id: "component.select",
    name: "Select",
    module: "select",
    exports: ["Select"],
  },
  {
    id: "component.tabs",
    name: "Tabs",
    module: "tabs",
    exports: ["Tabs"],
  },
]

const uiSourceFiles = (await readdir(path.join(projectRoot, "src/components/ui")))
  .filter((file) => file.endsWith(".tsx"))
  .map((file) => file.replace(/\.tsx$/, ""))
  .sort()
const registeredModules = componentModules.map((component) => component.module).sort()

if (JSON.stringify(uiSourceFiles) !== JSON.stringify(registeredModules)) {
  throw new Error(
    `Component module registry is incomplete. Found ${uiSourceFiles.join(", ")}; registered ${registeredModules.join(", ")}`,
  )
}

const runtimeProvidedVariables = new Set([
  "--anchor-width",
  "--available-height",
  "--transform-origin",
])

const components = []

for (const definition of componentModules) {
  const filePath = `src/components/ui/${definition.module}.tsx`
  const stylePath = `src/components/ui/${definition.module}.css`
  const [source, css] = await Promise.all([
    readProjectFile(filePath),
    readProjectFile(stylePath),
  ])
  const cssVariables = sortedUnique(
    [...css.matchAll(/var\((--[a-zA-Z0-9_-]+)/g)].map((match) => match[1]),
  )
  const dependenciesByFoundation = new Map()
  const localCssVariables = []
  const nonFoundationDependencies = []
  const platformRuntimeVariables = []
  const unresolvedCssVariables = []
  const missingTextStyleVariables = []

  for (const cssVariable of cssVariables) {
    const foundationToken = foundationVariableLookup.get(cssVariable)

    if (foundationToken) {
      const current = dependenciesByFoundation.get(foundationToken.foundationId) ?? []
      current.push({
        name: foundationToken.tokenName,
        cssVariable,
      })
      dependenciesByFoundation.set(foundationToken.foundationId, current)
    } else if (cssVariable.startsWith("--vlight-")) {
      localCssVariables.push(cssVariable)
    } else if (cssVariable.startsWith("--docs-")) {
      nonFoundationDependencies.push({
        cssVariable,
        classification: "storybook-shell",
        status: "should-be-decoupled",
      })
    } else if (runtimeProvidedVariables.has(cssVariable)) {
      platformRuntimeVariables.push(cssVariable)
    } else if (cssVariable.startsWith("--typography-tabs-item-")) {
      missingTextStyleVariables.push(cssVariable)
    } else {
      unresolvedCssVariables.push(cssVariable)
    }
  }

  const foundationDependencies = [...dependenciesByFoundation.entries()]
    .map(([foundationId, tokens]) => ({
      foundationId,
      tokens: tokens.sort((a, b) => a.cssVariable.localeCompare(b.cssVariable)),
    }))
    .sort((a, b) => a.foundationId.localeCompare(b.foundationId))

  if (missingTextStyleVariables.length > 0) {
    foundationDependencies.push({
      foundationId: "foundation.typography.text-styles",
      tokens: [
        {
          name: "tabs/item",
          cssVariables: missingTextStyleVariables,
          runtimeStatus: "missing-from-globals.css",
        },
      ],
    })
  }

  const iconDependencies = []
  for (const importMatch of source.matchAll(
    /import\s*\{([^}]+)\}\s*from\s*"@tabler\/icons-react"/g,
  )) {
    for (const imported of importMatch[1].split(",")) {
      const exportName = imported.trim().replace(/^type\s+/, "").split(/\s+as\s+/)[0]
      if (exportName.startsWith("Icon")) iconDependencies.push(exportName)
    }
  }

  components.push({
    id: definition.id,
    name: definition.name,
    kind: "react-component-module",
    filePath,
    stylePath,
    exports: definition.exports,
    foundationDependencies,
    iconDependencies: sortedUnique(iconDependencies),
    componentDependencies: definition.componentDependencies ?? [],
    localCssVariables,
    platformRuntimeVariables,
    nonFoundationDependencies,
    unresolvedCssVariables,
  })
}

const componentExportCount = components.reduce(
  (count, component) => count + component.exports.length,
  0,
)
const collectionTokenCount = tokenSource.collections.reduce(
  (count, collection) => count + collection.tokens.length,
  0,
)

if (collectionTokenCount !== tokenSource.metadata.counts.variables) {
  throw new Error(
    `Foundation token count mismatch: ${collectionTokenCount} != ${tokenSource.metadata.counts.variables}`,
  )
}

const registry = {
  schemaVersion: "1.0.0",
  name: "VLight Design System Registry",
  description:
    "Index of published VLight design-system Foundation tokens, icons, and reusable UI components. Documentation-site shell assets are intentionally excluded.",
  governance: {
    publishedTruth: "The reviewed and published Design System website represented by this repository",
    tokenAuthoringSource: {
      type: tokenSource.metadata.source.type,
      name: "VLight Design System Figma file",
      url: tokenSource.metadata.source.url,
      fileKey: tokenSource.metadata.source.fileKey,
    },
    tokenMachineSource: tokenSourcePath,
    tokenRuntimeArtifact: tokenRuntimePath,
    tokenRuntimeGeneratedBy: "scripts/generate-globals-css.mjs",
    conflictRule:
      "The reviewed published website defines the accepted experience. Token values are edited in the authoring source and synchronized through design-tokens.json; generated CSS must not be edited directly.",
  },
  scope: {
    included: [
      "Foundation token collections and Figma composite styles",
      "Curated Tabler React icon components",
      "Published social SVG icon assets",
      "Reusable React UI components under src/components/ui",
    ],
    excluded: [
      "src/App.tsx",
      "src/main.tsx",
      "src/app.css",
      "src/pages/**",
      "src/components/docs/**",
      "src/lib/design-tokens.ts",
      "public/*-assets/** except public/icon-assets/social/**",
      "static-preview/**",
      "OPEN-PREVIEW.html",
      "Documentation navigation, routing, page layout, preview canvases, and documentation-only feedback wrappers",
    ],
  },
  summary: {
    foundationEntries: foundationEntries.length,
    foundationVariables: collectionTokenCount,
    typographyTextStyles: textStyles.length,
    effectStyles: effectStyles.length,
    tablerReactIcons: tablerIcons.length,
    socialIcons: socialIcons.length,
    socialIconFileVariants: socialIcons.reduce(
      (count, icon) => count + icon.variants.length,
      0,
    ),
    componentModules: components.length,
    componentExports: componentExportCount,
  },
  foundation: {
    sourceOfTruth: tokenSourcePath,
    runtimeArtifact: tokenRuntimePath,
    runtimeArtifactGenerated: true,
    runtimeAdapters: [
      {
        id: "foundation.adapter.shadcn-semantic",
        name: "shadcn semantic adapter",
        filePath: tokenRuntimePath,
        generatedBy: "scripts/generate-globals-css.mjs",
        aliases: [...shadcnAliases, "--radius"],
      },
      {
        id: "foundation.adapter.tailwind-theme",
        name: "Tailwind theme adapter",
        filePath: tokenRuntimePath,
        generatedBy: "scripts/generate-globals-css.mjs",
        aliases: tailwindThemeAliases,
      },
    ],
    entries: foundationEntries,
  },
  icons: {
    canonicalDrawingSource: "Tabler",
    catalogPath: iconCatalogPath,
    sharedStylePath: iconStylePath,
    supportedSizeTokens: [
      "layout/icon-size/12",
      "layout/icon-size/16",
      "layout/icon-size/20",
      "layout/icon-size/24",
      "layout/icon-size/32",
    ],
    tabler: tablerIcons,
    social: socialIcons,
  },
  components,
}

await writeFile(
  path.join(projectRoot, "registry.json"),
  `${JSON.stringify(registry, null, 2)}\n`,
)

console.log(
  `Generated registry.json: ${collectionTokenCount} variables, ${textStyles.length + effectStyles.length} composite styles, ${tablerIcons.length} Tabler icons, ${socialIcons.length} social icons, ${components.length} component modules / ${componentExportCount} exports.`,
)
