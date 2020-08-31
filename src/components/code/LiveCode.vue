<template>
  <div class="sidebar-outermost-container">
    <div class="right-sidebar-content-container">
      <permalink-bar v-show="showPermalink" :path="permalink" @close="showPermalink = false" />
      <div class="buttons">
        <codepen-button :cssCode="cssCode" :htmlCode="htmlCode" :prefix="prefix" />
        <sidebar-button :disabled="!saveDesign" @click="getPermalink">Get permalink</sidebar-button>
        <sidebar-button aria-label="Restart" class="btn-trash" @click="restart">
          <icon-trash />
        </sidebar-button>
      </div>
      <div class="code-grid">
        <code-editor type="css" :code="cssCode" />
        <code-editor type="html" :code="htmlCode" />
      </div>
      <div class="divider"></div>
      <live-code-options v-model="options" />
    </div>
  </div>
</template>

<script setup="props">
import { ref, computed } from 'vue'

export { restart } from '../../store.js'

import { areaToCSS, areaToHTML, ie_areaToCSS } from '../../generateCode.js'

import { mainArea } from '../../store.js'

import IconTrash from '../icons/IconTrash.vue'
import SidebarButton from '../basic/SidebarButton.vue'

import CodepenButton from './CodepenButton.vue'
import PermalinkBar from './PermalinkBar.vue'

import LiveCodeOptions from './LiveCodeOptions.vue'
import CodeEditor from './CodeEditor.vue'

export default {
  components: {
    IconTrash,
    PermalinkBar,
    SidebarButton,
    CodepenButton,
    LiveCodeOptions,
    CodeEditor,
  },
  props: {
    area: { type: Object, required: true },
    saveDesign: { type: Function, default: null },
  },
}

export const options = ref({
  templateAreas: true,
  prefix: false,
  prefixName: 'lt',
  oldSpec: false,
})

export const prefix = computed(() => (options.value.prefix ? options.value.prefixName : undefined))

export const cssCode = computed(() => {
  const { repeat, templateAreas, oldSpec } = options.value
  return areaToCSS(props.area, { useTemplateAreas: templateAreas, prefix: prefix.value, repeat, oldSpec })
})

export const htmlCode = computed(() => {
  return areaToHTML(props.area, { prefix: prefix.value })
})

export const showPermalink = ref(false)
export const permalink = ref('')

export function getPermalink() {
  // Permalink supports depends on the deployed editor
  if (props.saveDesign) {
    props.saveDesign(mainArea.value).then((path) => {
      permalink.value = path
      showPermalink.value = true
    })
  }
}
</script>

<style scoped lang="scss">
.buttons {
  display: flex;
  > button {
    max-width: max-content;
    margin-left: 10px;
    padding: 0.625em 1em;
    height: 42px;
  }
  button.btn-trash {
    max-width: max-content;
    padding: 12px;
  }
}

.button {
  background: #6b16a1;
  border: 0;
  border-radius: 50px;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-family: inherit;
  font-size: 1em;
  text-align: center;
  padding: 0.625em 1em;
  margin: 0 auto;
  &.btn-close {
    float: right;
    margin: 0 0 0 10px;
    &:hover {
      background: #444;
    }
  }
  &.btn-default {
    background: #b4bcc8;
  }
}

.sidebar-outermost-container {
  height: 100%;
  .right-sidebar-content-container {
    display: flex;
    flex-flow: column nowrap;
    height: 100%;
  }
}

.code-grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 10px;
  max-height: calc(100% - 285px);
  @media (max-width: 1240px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
  }
}

.divider {
  flex-grow: 1;
}
</style>
