import 'pepjs'
import { createApp } from 'vue'
import App from './App.vue'
import GridEditor from './components/grid/GridEditor.vue'
import FlexEditor from './components/flex/FlexEditor.vue'
import { registerServiceWorker } from './registerServiceWorker'

const app = createApp(App)

// Globably register GridEditor to avoid issues with circular references
app.component('GridEditor', GridEditor)
app.component('FlexEditor', FlexEditor)
app.mount('#app')

registerServiceWorker()
