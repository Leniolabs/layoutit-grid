import { createApp } from 'vue'
import App from './App.vue'
import GridEditor from './components/grid/GridEditor.vue'

const app = createApp(App)

// Globably register GridEditor to avoid issues with circular references
app.component('grid-editor', GridEditor)
app.mount('#app')
