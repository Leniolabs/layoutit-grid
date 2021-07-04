import { Manifest, ManifestChunk } from 'vite'
import { readFileSync, writeFileSync } from 'fs'

const transformDynamicImport = (base: string, entry: string, map: Map<string, ManifestChunk>) => {
  const module = map.get(entry)
  if (module && module.isDynamicEntry === true) {
    return `<link rel="modulepreload" href="${module.file.startsWith('/') ? module.file : `/${module.file}`}" />`
  }
  return null
}

const transformCss = (base: string, entry: string, html: string): string => {
  if (!entry.startsWith('/')) {
    entry = `${base}${entry}`
  }
  const toReplace = `<link rel="stylesheet" href="${entry}">`
  if (html.indexOf(toReplace) === -1) {
    return html.replace(
      '</head>',
      `<link
      rel="preload"
      as="style"
      onload="this.onload=null;this.rel='stylesheet'"
      href="${entry}"
    />
    <noscript>${toReplace}</noscript>\n</head>`
    )
  }
  return html.replace(
    toReplace,
    `<link
      rel="preload"
      as="style"
      onload="this.onload=null;this.rel='stylesheet'"
      href="${entry}"
    />
    <noscript>${toReplace}</noscript>`
  )
}

const transformAsset = (base: string, entry: string) => {
  if (!entry.startsWith('/')) {
    entry = `${base}${entry}`
  }
  return `<link rel="prefetch" href="${entry}" />`
}

const optimizeIndexHtml = () => {
  const html = readFileSync('./dist/index.html', 'utf-8')
  const manifest: Manifest = JSON.parse(readFileSync('./dist/manifest.json', 'utf-8'))
  const mainEntryName = 'LAYOUTIT-MAIN-ENTRY'
  const entries = Object.entries(manifest).reduce((acc, [key, value]) => {
    if (value.isEntry === true) {
      acc.set(mainEntryName, value)
    } else {
      acc.set(key, value)
    }
    return acc
  }, new Map<string, ManifestChunk>())
  const mainEntry: ManifestChunk | undefined = entries.has(mainEntryName) ? entries.get(mainEntryName) : undefined
  if (mainEntry) {
    const { file, dynamicImports = [], css = [], assets = [] } = mainEntry
    const dynamicImportsEntries = dynamicImports.map((dy) => {
      return transformDynamicImport('/', dy, entries)
    })
    const assetsEntries = assets.map((a) => {
      return transformAsset('/', a)
    })
    const moduleName = file.startsWith('/') ? file : `/${file}`
    const module = `<script type="module" crossorigin src="${moduleName}"></script>`
    let result = html.replace(
      module,
      `<link rel="modulepreload" href="${moduleName}" />\n${
        dynamicImportsEntries ? dynamicImportsEntries.filter((dy) => !!dy).join('\n') : ''
      }\n${module}`
    )
    for (const cssEntry of css) {
      result = transformCss('/', cssEntry, result)
    }
    if (assetsEntries) {
      result = result.replace('</head>', `${assetsEntries ? assetsEntries.join('\n') : ''}</head>`)
    }

    writeFileSync('./dist/index.html', result, { encoding: 'utf-8' })
  }
}

optimizeIndexHtml()
