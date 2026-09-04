import tokenSource from "../../tokens/design-tokens.json"

type AliasValue = {
  $alias: string
  $target: {
    collection: string
    name: string
  }
}

type ColorValue = {
  hex: string
}

type Token = {
  name: string
  path: string[]
  description: string
  valuesByMode: Record<string, { value: AliasValue | ColorValue | number | string }>
}

type TokenCollection = {
  name: string
  tokens: Token[]
}

type TextStyle = {
  name: string
  path: string[]
  description: string
  value: {
    fontFamily: string
    fontStyle: string
    fontSize: number
    lineHeight: { unit: string; value: number }
    letterSpacing: { unit: string; value: number }
  }
  boundVariables: Record<string, AliasValue>
}

type TokenFile = {
  collections: TokenCollection[]
  styles: {
    text: TextStyle[]
  }
}

export type ColorToken = {
  name: string
  path: string[]
  description: string
  cssVariable: string
  resolvedHex: string
  source?: string
}

export type TypographyStyleToken = {
  name: string
  path: string[]
  description: string
  fontFamily: string
  fontStyle: string
  fontSize: number
  fontWeight: number
  lineHeight: number
  letterSpacing: number
  css: {
    fontFamily: string
    fontSize: string
    fontWeight: string
    lineHeight: string
    letterSpacing: string
  }
}

const designTokens = tokenSource as unknown as TokenFile
const collections = new Map(
  designTokens.collections.map((collection) => [collection.name, collection]),
)

const collectionPrefixes: Record<string, string> = {
  "Color Base": "color-base",
  "Color Semantic": "color-semantic",
  Typography: "typography",
}

const slug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

const getToken = (collectionName: string, tokenName: string) => {
  const token = collections
    .get(collectionName)
    ?.tokens.find((item) => item.name === tokenName)

  if (!token) throw new Error(`Missing token: ${collectionName}/${tokenName}`)

  return token
}

const getValue = (token: Token) => {
  const mode = Object.values(token.valuesByMode)[0]

  if (!mode) throw new Error(`Token has no light-mode value: ${token.name}`)

  return mode.value
}

const isAlias = (value: AliasValue | ColorValue | number | string): value is AliasValue =>
  typeof value === "object" && value !== null && "$alias" in value

const isColor = (value: AliasValue | ColorValue | number | string): value is ColorValue =>
  typeof value === "object" && value !== null && "hex" in value

const resolveColor = (collectionName: string, tokenName: string, visited = new Set<string>()): string => {
  const key = `${collectionName}/${tokenName}`

  if (visited.has(key)) throw new Error(`Circular token reference: ${key}`)
  visited.add(key)

  const value = getValue(getToken(collectionName, tokenName))

  if (isColor(value)) return value.hex
  if (isAlias(value)) {
    return resolveColor(value.$target.collection, value.$target.name, visited)
  }

  throw new Error(`Token is not a color: ${key}`)
}

export const cssVariableFor = (collectionName: string, tokenName: string) => {
  const prefix = collectionPrefixes[collectionName]

  if (!prefix) throw new Error(`No CSS namespace for collection: ${collectionName}`)

  return `--${prefix}-${slug(tokenName)}`
}

export const colorTokensFor = (collectionName: "Color Base" | "Color Semantic"): ColorToken[] => {
  const collection = collections.get(collectionName)

  if (!collection) throw new Error(`Missing collection: ${collectionName}`)

  return collection.tokens.map((token) => {
    const value = getValue(token)

    return {
      name: token.name,
      path: token.path,
      description: token.description,
      cssVariable: cssVariableFor(collectionName, token.name),
      resolvedHex: resolveColor(collectionName, token.name),
      source: isAlias(value) ? value.$alias.replace("Color Base/", "") : undefined,
    }
  })
}

const boundVariable = (style: TextStyle, property: string) => {
  const binding = style.boundVariables[property]

  if (!binding) throw new Error(`Missing ${property} binding for text style: ${style.name}`)

  return `var(${cssVariableFor(binding.$target.collection, binding.$target.name)})`
}

const boundNumber = (style: TextStyle, property: string) => {
  const binding = style.boundVariables[property]

  if (!binding) throw new Error(`Missing ${property} binding for text style: ${style.name}`)

  const value = getValue(getToken(binding.$target.collection, binding.$target.name))

  if (typeof value !== "number") {
    throw new Error(`Bound ${property} token is not numeric: ${binding.$alias}`)
  }

  return value
}

export const typographyTextStyles = (): TypographyStyleToken[] =>
  designTokens.styles.text.map((style) => {
    const tracking = style.value.letterSpacing.value

    return {
      name: style.name,
      path: style.path,
      description: style.description,
      fontFamily: style.value.fontFamily,
      fontStyle: style.value.fontStyle,
      fontSize: style.value.fontSize,
      fontWeight: boundNumber(style, "fontWeight"),
      lineHeight: style.value.lineHeight.value,
      letterSpacing: tracking,
      css: {
        fontFamily: boundVariable(style, "fontFamily"),
        fontSize: boundVariable(style, "fontSize"),
        fontWeight: boundVariable(style, "fontWeight"),
        lineHeight: boundVariable(style, "lineHeight"),
        letterSpacing: tracking === 0 ? "0" : `${tracking / 100}em`,
      },
    }
  })
