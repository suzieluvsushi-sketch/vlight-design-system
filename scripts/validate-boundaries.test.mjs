import assert from 'node:assert/strict'
import test from 'node:test'
import { inspect } from './validate-boundaries.mjs'

test('shell scrollbar rules cannot target all elements or inherit into components', () => {
  assert.ok(inspect('src/globals.css', '* { scrollbar-width: thin; }').length)
  assert.ok(inspect('src/globals.css', '*::-webkit-scrollbar { width: 8px; }').length)
  assert.ok(inspect('src/globals.css', '.docs-shell { scrollbar-color: gray white; }').length)
  assert.deepEqual(inspect('src/globals.css', '.docs-sidebar::-webkit-scrollbar { width: 8px; }'), [])
})

test('DS cannot import the shell, including through shared utilities', () => {
  assert.ok(inspect('src/components/ui/button.tsx', 'import "../../app.css"').length)
  assert.ok(inspect('src/lib/utils.ts', 'export { x } from "../pages/example"').length)
  assert.ok(inspect('src/base.css', '@import "./globals.css";').length)
  assert.ok(inspect('src/components/ui/button.css', '.x { color: var(--docs-text); }').length)
})
test('shell cannot overwrite tokens or component internals', () => {
  for (const source of ['.x { --component-button-size: 1px; }', '.x { --vlight-button-radius: 0; }', '.x .vlight-button { color: red; }']) assert.ok(inspect('src/app.css', source).length)
  assert.ok(inspect('src/App.tsx', 'const style = { "--component-button-size": "1px" }').length)
  assert.ok(inspect('src/App.tsx', 'el.style.setProperty("--vlight-button-radius", "0")').length)
})
test('public consumption and documentation code samples remain allowed', () => {
  assert.deepEqual(inspect('src/App.tsx', 'import { Button } from "@/components/ui/button"'), [])
  assert.deepEqual(inspect('src/app.css', '.docs { --docs-gap: var(--layout-spacing-4); gap: var(--docs-gap); }'), [])
  assert.deepEqual(inspect('src/pages/TypographyPage.tsx', 'const sample = `:root { --typography-font: example; }`'), [])
  assert.deepEqual(inspect('src/components/ui/button.tsx', 'import { cn } from "@/lib/utils"'), [])
})
