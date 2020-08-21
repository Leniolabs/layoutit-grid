<template>
  <div class="sidebar-outermost-container">
    <div class="right-sidebar-content-container">
      <permalink-bar v-show="showPermalink" :path="permalink" @close="showPermalink = false" />
      <div class="buttons">
        <codepen-button :cssCode="cssCode" :htmlCode="htmlCode" :prefix="prefix" />
        <sidebar-button :disabled="!saveDesign" @click="getPermalink">Get permalink</sidebar-button>
        <sidebar-button class="btn-trash" @click="restart">
          <icon-trash />
        </sidebar-button>
      </div>
      <div class="code-grid">
        <div class="code-container">
          <span class="header-css">CSS</span>
          <pre><code class="css" v-html="highlight(cssCode, 'css')" /></pre>
        </div>
        <div class="code-container">
          <span class="header-css">HTML</span>
          <pre><code class="html" v-html="highlight(htmlCode, 'html')" /></pre>
        </div>
      </div>
      <div class="divider"></div>
      <live-code-options v-model="options" />
    </div>
  </div>
</template>

<script setup="props">
import { ref, computed } from 'vue'

import { store, createAreaState } from '../../store.js'

export { highlight } from '../utils/highlight.js'
import { areaToCSS, areaToHTML, ie_areaToCSS } from '../../generateCode.js'

import IconTrash from '../icons/IconTrash.vue'
import SidebarButton from '../basic/SidebarButton.vue'

import CodepenButton from './CodepenButton.vue'
import PermalinkBar from './PermalinkBar.vue'

import LiveCodeOptions from './LiveCodeOptions.vue'

export default {
  components: {
    IconTrash,
    PermalinkBar,
    SidebarButton,
    CodepenButton,
    LiveCodeOptions,
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
  let css = areaToCSS(props.area, { useTemplateAreas: templateAreas, prefix: prefix.value, repeat })
  if (oldSpec) {
    css += '\n\n'
    css += ie_areaToCSS(props.area, { prefix: prefix.value, repeat })
  }
  return css
})

export const htmlCode = computed(() => {
  return areaToHTML(props.area, { prefix: prefix.value })
})

export function restart() {
  store.setArea(createAreaState())
}

export const showPermalink = ref(false)
export const permalink = ref('')

export function getPermalink() {
  // Permalink supports depends on the deployed editor
  if (saveDesign.value) {
    saveDesign.value(area.value).then((path) => {
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

.input-prefix {
  border-radius: 2px;
  border: 1px solid #aaa;
  width: 90px;
  padding: 2px 5px;
  margin-left: 5px;
  display: inline-block;
  vertical-align: top;
}

.checkbox-warning {
  color: #333;
  margin-bottom: 10px;
  margin-top: 5px;
  padding: 6px 10px;
  border-radius: 2px;
  background-color: #fdd835;
  width: 100%;
  font-size: 14px;
  .auto-placement-link {
    font-weight: 600;
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
  .code-container {
    background: #23241f;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border: solid 1px #2a2a2a;
    height: 100%;
    overflow: auto;
    > span {
      display: block;
      background: #444;
      color: #ccc;
      font-weight: 700;
      font-size: 12px;
      padding: 3px 5px 2px;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }
    pre {
      border: 0;
      resize: none;
      overflow: auto;
      white-space: pre-wrap;
      text-align: left;
      padding: 0;
      margin: 0;
      font-size: 14px;
      padding: 10px;
    }
  }
}

.divider {
  flex-grow: 1;
}
</style>
