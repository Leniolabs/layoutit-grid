import { defineConfig } from 'vite'
import type { ResolvedConfig, Plugin } from 'vite'
import Components from 'unplugin-vue-components/vite'
import vuePlugin from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { OutputAsset, OutputChunk } from 'rollup'

const LayouitPlugin = (): Plugin => {
  let viteConfig: ResolvedConfig
  const mainEntryName = 'LAYOUTIT-MAIN-ENTRY'

  const transformDynamicImport = (base: string, entry: string, map: Map<string, OutputAsset | OutputChunk>) => {
    const module = map.get(entry)
    if (module && module['isDynamicEntry'] === true) {
      return `<link rel="modulepreload" href="${entry.startsWith('/') ? entry : `${base}${entry}`}" />`
    }
    return null
  }

  return {
    name: 'vite-layouit-grid-inject',
    enforce: 'post',
    apply: 'build',
    configResolved(config) {
      viteConfig = config
    },
    async buildEnd(error) {
      if (error)
        throw error
    },
    transformIndexHtml: {
      enforce: 'post',
      transform(html, { bundle }) {
        /* VITE WILL NOT EXPOSE CSS NOR ASSETS */
        if (bundle) {
          const assets = Object.entries(bundle).reduce((acc, [key, value]) => {
            if (value['isEntry'] === true) {
              acc.set(mainEntryName, value as OutputChunk)
            } else {
              acc.set(key, value as OutputAsset | OutputChunk)
            }
            return acc
          }, new Map<string, OutputAsset | OutputChunk>())
          const mainEntry: OutputChunk | undefined = assets.has(mainEntryName)
            ? (assets.get(mainEntryName) as OutputChunk)
            : undefined
          if (mainEntry) {
            const { base = '/' } = viteConfig
            const { fileName, dynamicImports = [] } = mainEntry
            const dynamicImportsEntries = dynamicImports.map((dy) => {
              return transformDynamicImport(base, dy, assets)
            })
            const moduleName = fileName.startsWith('/') ? fileName : `${base}${fileName}`
            const module = `<script type="module" crossorigin src="${moduleName}"></script>`
            // return html.replace(
            //   module,
            //   `<link rel="modulepreload" href="${moduleName}" />\n${
            //     dynamicImportsEntries ? dynamicImportsEntries.filter((dy) => !!dy).join('\n') : ''
            //   }\n${module}`
            // )
            let result = html.replace(
              module,
              `<link rel="modulepreload" href="${moduleName}" />\n${dynamicImportsEntries ? dynamicImportsEntries.filter((dy) => !!dy).join('\n') : ''
              }\n${module}`
            )
            // the css will be something like this
            // '<link rel="stylesheet" href="/assets/index.c517effc.css">'
            // we just replace it with the new one non blocking
            result = result.replace(
              /<link rel="stylesheet" href="(.*?)">/g,
              `<link
              rel="preload"
              as="style"
              onload="this.onload=null;this.rel='stylesheet'"
              href="$1"
            />
            <noscript><link rel="stylesheet" href="$1" /></noscript>`
            )
            return result
          }
        }

        return html
      },
    },
  }
}

export default defineConfig({
  dedupe: ['vue'],
  plugins: [
    vuePlugin({
      refTransform: true,
      script: {
        propsDestructureTransform: true
      }
    }),
    Components(),
    LayouitPlugin(),
    VitePWA({
      base: '/',
      scope: '/',
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'robots.txt',
        'img/icons/icon-44x44.png',
        'img/icons/safari-pinned-tab.svg',
        'img/screenshot.png',
      ],
      manifest: {
        name: 'Interactive CSS Grid Generator',
        // short_name: 'CSS Grid Generator',
        short_name: 'LayoutIt Grid',
        description: 'Layoutit Grid is an interactive open source CSS Grid generator.',
        display: 'standalone',
        orientation: 'portrait-primary',
        background_color: '#1D032D',
        lang: 'en',
        theme_color: '#1D032D',
        categories: ['education', 'personalization', 'productivity', 'utilities'],
        screenshots: [
          {
            src: 'img/screenshot.png',
            sizes: '1280x800',
            type: 'image/png',
          },
        ],
        icons: [
          {
            src: 'img/icons/icon-128x128.png',
            sizes: '128x128',
            purpose: 'maskable',
            type: 'image/png',
          },
          {
            src: 'img/icons/android-icon-36x36.png',
            sizes: '36x36',
            type: 'image/png',
            purpose: 'maskable',
            density: '0.75',
          },
          {
            src: 'img/icons/android-icon-48x48.png',
            sizes: '48x48',
            type: 'image/png',
            purpose: 'maskable',
            density: '1.0',
          },
          {
            src: 'img/icons/android-icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
            purpose: 'maskable',
            density: '1.5',
          },
          {
            src: 'img/icons/android-icon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
            purpose: 'maskable',
            density: '2.0',
          },
          {
            src: 'img/icons/android-icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'maskable',
            density: '3.0',
          },
          {
            src: 'img/icons/android-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
            density: '4.0',
          },
          {
            src: 'img/icons/android-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  css: {
    postcss: '.',
  },
})
