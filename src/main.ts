import 'vue-global-api'
import { createApp } from 'vue'
import App from './App.vue'
import GridEditor from './components/grid/GridEditor.vue'
import FlexEditor from './components/flex/FlexEditor.vue'

if (!window.PointerEvent) {
  //@ts-ignore
  import('pepjs')
}

const app = createApp(App)

// Globably register GridEditor to avoid issues with circular references
app.component('GridEditor', GridEditor)
app.component('FlexEditor', FlexEditor)
app.mount('#app')
