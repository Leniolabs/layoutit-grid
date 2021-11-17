<script setup lang="ts">
import { areaToIndexCSS, areaToHTML } from '../../generateCode.js'

const { area, options } = defineProps<{ area; options }>()

function areaToIndexHTML(area) {
  return `<!DOCTYPE html>
<html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CSS Grid Layout</title>
    <script type="module" src="/index.js"><\/script>
  </head>
  <body>
    ${areaToHTML(area, 2)}
  </body>
</html>
`
}

const indexJS = `import './style.css'

  console.log('CSS Grid created with https://grid.layoutit.com')
  console.log('Powered by https://vitejs.dev')
`

const viteVersion = '^2.6.7'

const packageJSON = `{
  "name": "vite-project",
  "version": "0.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "serve": "vite preview"
  },
  "devDependencies": {
    "vite": "${viteVersion}"
  }
}`

async function createStackblitz() {
  const { default: sdk } = await import('@stackblitz/sdk')

  sdk.openProject(
    {
      files: {
        'index.html': areaToHTML(area),
        'index.js': indexJS,
        'style.css': areaToIndexCSS(area, options),
        'package.json': packageJSON,
      },
      dependencies: {
        vite: viteVersion,
      },
      title: 'New CSS Grid!',
      description: 'CSS Grid created with https://grid.layoutit.com',
      template: 'javascript',
    },
    {
      openFile: 'style.css',
    }
  )
}
</script>

<template>
  <ExportButton app="stackblitz" title="Stackblitz" @click="createStackblitz">
    <IconStackblitz />
  </ExportButton>
</template>
