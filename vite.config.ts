import { defineConfig } from 'vite'
import vuePlugin from '@vitejs/plugin-vue'
import viteComponentsPlugin from 'vite-plugin-components'

export default defineConfig({
  plugins: [
    vuePlugin(), 
    viteComponentsPlugin()
  ],
  css: {
    postcss: "."
  }
})
