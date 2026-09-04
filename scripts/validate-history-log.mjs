import { readFile } from "node:fs/promises"

const allowedKinds = new Set([
  "asset-added",
  "asset-removed",
  "asset-renamed",
  "token-value",
  "token-reference",
  "token-renamed",
  "dimension",
  "visual",
  "behavior",
  "guideline",
])

const allowedObjectTypes = new Set(["foundation", "icon", "component"])
const datePattern = /^\d{4}-\d{2}-\d{2}$/
const idPattern = /^\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/

const [history, registry] = await Promise.all([
  readFile(new URL("../history-log.json", import.meta.url), "utf8").then(JSON.parse),
  readFile(new URL("../registry.json", import.meta.url), "utf8").then(JSON.parse),
])

const errors = []
const entries = Array.isArray(history.entries) ? history.entries : []
const registryIds = new Set([
  ...registry.foundation.entries.map(({ id }) => id),
  ...registry.icons.tabler.map(({ id }) => id),
  ...registry.icons.social.map(({ id }) => id),
  ...registry.components.map(({ id }) => id),
])
const seenIds = new Set()

if (history.schemaVersion !== "1.0.0") errors.push("schemaVersion must be 1.0.0")
if (!Array.isArray(history.entries)) errors.push("entries must be an array")

entries.forEach((entry, entryIndex) => {
  const location = `entries[${entryIndex}]`
  if (!idPattern.test(entry.id ?? "")) errors.push(`${location}.id has an invalid format`)
  if (seenIds.has(entry.id)) errors.push(`${location}.id must be unique`)
  seenIds.add(entry.id)
  if (!datePattern.test(entry.date ?? "")) errors.push(`${location}.date must use YYYY-MM-DD`)
  if (!allowedObjectTypes.has(entry.object?.type)) errors.push(`${location}.object.type is invalid`)
  if (!entry.object?.id || !entry.object?.name) errors.push(`${location}.object requires id and name`)
  if (!entry.summary || !entry.reason) errors.push(`${location} requires summary and reason`)
  if (!Array.isArray(entry.changes) || entry.changes.length === 0) {
    errors.push(`${location}.changes must contain at least one change`)
  }
  if (!Array.isArray(entry.affectedAssets) || entry.affectedAssets.length === 0) {
    errors.push(`${location}.affectedAssets must contain at least one registry id`)
  }

  entry.changes?.forEach((change, changeIndex) => {
    const changeLocation = `${location}.changes[${changeIndex}]`
    if (!allowedKinds.has(change.kind)) errors.push(`${changeLocation}.kind is invalid`)
    if (!change.property) errors.push(`${changeLocation}.property is required`)
    if (!("before" in change) || !("after" in change)) {
      errors.push(`${changeLocation} requires before and after`)
    }
    if (change.before === null && change.after === null) {
      errors.push(`${changeLocation} cannot have both before and after set to null`)
    }
  })

  const isRemoval = entry.changes?.every(({ kind }) => kind === "asset-removed")
  entry.affectedAssets?.forEach((assetId) => {
    if (!isRemoval && !registryIds.has(assetId)) {
      errors.push(`${location}.affectedAssets contains unknown registry id: ${assetId}`)
    }
  })
})

if (errors.length > 0) {
  console.error(`History log validation failed:\n- ${errors.join("\n- ")}`)
  process.exitCode = 1
} else {
  console.log(`History log is valid (${entries.length} entries).`)
}
