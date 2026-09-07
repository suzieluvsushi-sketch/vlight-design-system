import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const root = fileURLToPath(new URL('../', import.meta.url))
const protectedRoots = ['tokens', 'src/components/ui', 'src/tokens.css', 'src/base.css', 'src/iconography.css', 'src/lib/utils.ts', 'src/lib/icon-catalog.ts', 'public/icon-assets/social', 'registry.json', 'history-log.json', 'scripts/generate-tokens-css.mjs', 'scripts/generate-registry.mjs', 'vlight-page-builder', 'vlight-page-builder.zip']
const within = (file, prefix) => file === prefix || file.startsWith(`${prefix}/`)
const protectedFile = file => protectedRoots.some(prefix => within(file, prefix))
function files(relative) {
  const absolute = path.join(root, relative)
  if (!fs.existsSync(absolute)) return []
  if (!fs.statSync(absolute).isDirectory()) return [relative]
  return fs.readdirSync(absolute).sort().flatMap(name => files(`${relative}/${name}`))
}
const snapshot = () => Object.fromEntries(protectedRoots.flatMap(files).map(file => [file, crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex')]))
const tokenNames = new Set([...fs.readFileSync(path.join(root, 'src/tokens.css'), 'utf8').matchAll(/(--[\w-]+)\s*:/g)].map(match => match[1]))
const reserved = name => tokenNames.has(name) || /^--(?:component|vlight|color|typography|layout|effect)-/.test(name)

export function inspect(file, source) {
  const errors = []
  const upstream = protectedFile(file)
  const css = file.endsWith('.css')
  const text = source.replace(/\/\*[\s\S]*?\*\//g, '')
  const imports = css
    ? [...text.matchAll(/@import\s+(?:url\()?['"]([^'"]+)/g)].map(match => match[1])
    : ts.preProcessFile(source, true, true).importedFiles.map(item => item.fileName)
  for (const specifier of imports) {
    if (!specifier.startsWith('.') && !specifier.startsWith('@/')) continue
    const target = path.posix.normalize(specifier.startsWith('@/') ? `src/${specifier.slice(2)}` : path.posix.join(path.posix.dirname(file), specifier)).split('?')[0]
    if (upstream && ![target, `${target}.ts`, `${target}.tsx`, `${target}/index.ts`].some(protectedFile)) errors.push(`reverse dependency: ${specifier}`)
  }
  if (upstream && /--docs-|--documentation-/.test(text)) errors.push('upstream references shell variables')
  if (!upstream && css) {
    for (const [, name] of text.matchAll(/(--[\w-]+)\s*:/g)) if (reserved(name)) errors.push(`shell defines protected variable: ${name}`)
    if (/\.vlight-/.test(text)) errors.push('shell selector reaches component internals')
  }
  if (!upstream && /\.[jt]sx?$/.test(file)) {
    const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS)
    function visit(node) {
      if (ts.isPropertyAssignment(node) && ts.isStringLiteral(node.name) && reserved(node.name.text)) errors.push(`shell assigns protected variable: ${node.name.text}`)
      if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === 'setProperty' && node.arguments[0] && ts.isStringLiteral(node.arguments[0]) && reserved(node.arguments[0].text)) errors.push(`shell writes protected variable: ${node.arguments[0].text}`)
      ts.forEachChild(node, visit)
    }
    visit(ast)
  }
  return errors.map(error => `${file}: ${error}`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [mode = 'validate', destination] = process.argv.slice(2)
  if (mode === 'snapshot') {
    if (!destination) throw new Error('Supply a new snapshot path outside the repository')
    const output = path.resolve(destination)
    if (output.startsWith(root)) throw new Error('Snapshot must be outside the repository')
    fs.writeFileSync(output, JSON.stringify(snapshot(), null, 2), { flag: 'wx' })
    console.log('Protected-file snapshot saved (existing snapshots are never overwritten).')
  } else if (mode === 'verify') {
    if (!destination) throw new Error('Supply the original task snapshot')
    const before = JSON.parse(fs.readFileSync(destination, 'utf8'))
    const after = snapshot()
    const changed = [...new Set([...Object.keys(before), ...Object.keys(after)])].filter(file => before[file] !== after[file])
    if (changed.length) throw new Error(`Protected files changed:\n${changed.join('\n')}`)
    console.log(`Protected files unchanged: ${Object.keys(after).length}`)
  } else if (mode === 'validate') {
    const errors = files('src').filter(file => /\.(css|tsx?|jsx?)$/.test(file)).flatMap(file => inspect(file, fs.readFileSync(path.join(root, file), 'utf8')))
    if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1 }
    else console.log('Design System / shell boundary checks passed.')
  } else throw new Error(`Unknown mode: ${mode}`)
}
