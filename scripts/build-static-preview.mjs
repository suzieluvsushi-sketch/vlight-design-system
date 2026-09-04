import { readFile, readdir, rm, writeFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import path from "node:path"
import { build } from "vite"

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const outputDir = path.join(projectRoot, "static-preview")

await build({
  root: projectRoot,
  configFile: path.join(projectRoot, "vite.config.ts"),
  base: "./",
  build: {
    outDir: outputDir,
    emptyOutDir: true,
    cssCodeSplit: false,
    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
    rollupOptions: {
      input: path.join(projectRoot, "src", "main.tsx"),
      output: {
        format: "es",
        codeSplitting: false,
        entryFileNames: "assets/app.js",
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
})

const assets = await readdir(path.join(outputDir, "assets"))
const cssFile = assets.find((file) => file.endsWith(".css"))
const scriptFile = assets.find((file) => file.endsWith(".js"))

if (!cssFile || !scriptFile) {
  throw new Error("Static preview build did not emit its stylesheet and script.")
}

const script = await readFile(path.join(outputDir, "assets", scriptFile), "utf8")
const inlineScript = script.replaceAll("</script", "<\\/script")

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="./favicon.svg" />
    <link rel="stylesheet" href="./assets/${cssFile}" />
    <title>VLight Design System</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module">${inlineScript}</script>
  </body>
</html>
`

await writeFile(path.join(outputDir, "index.html"), html)
await rm(path.join(outputDir, "assets", scriptFile))
console.log(`Generated ${path.relative(projectRoot, outputDir)} for server-free preview.`)
