<template>
  <div class="sidebar-outermost-container">
    <div class="right-sidebar-content-container">
      <permalink v-show="showPermalink" :path="permalink" @close="showPermalink = false" />

      <div class="buttons">
        <form action="https://codepen.io/pen/define" style="float: left;" method="POST" target="_blank">
          <input id="codepenData" :value="codePenJSON" type="hidden" name="data" />
          <button type="submit" class="button codepen-btn"><icon-codepen />Create CodePen</button>
        </form>
        <sidebar-button :disabled="!this.saveDesign" @click="getPermalink">Get permalink</sidebar-button>
        <sidebar-button class="btn-trash" @click="restart">
          <icon-trash />
        </sidebar-button>
      </div>
      <div class="code-grid">
        <div class="code-container">
          <span class="header-css">CSS</span>
          <pre><code class="css" v-html="viewCSSCode" /></pre>
        </div>
        <div class="code-container">
          <span class="header-css">HTML</span>
          <pre><code class="html" v-html="viewHTMLCode" /></pre>
        </div>
      </div>
      <div class="divider"></div>
      <div class="output-settings">
        <slide-checkbox id="checkbox-repeat" v-model="useRepeat">
          <label for="checkbox-repeat">
            Apply CSS
            <strong>
              <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/repeat" target="_blank">repeat</a>
            </strong>
            function.
          </label>
        </slide-checkbox>
        <slide-checkbox id="checkbox-template-areas" v-model="useTemplateAreas">
          <label for="checkbox-template-areas">
            Use
            <strong>
              <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas" target="_blank"
                >grid-template-areas</a
              >
            </strong>
            for positioning.
          </label>
        </slide-checkbox>
        <slide-checkbox id="checkbox-prefix" v-model="usePrefix">
          <label for="checkbox-prefix">
            Add
            <strong>prefixes</strong> to grid names.
            <input v-if="usePrefix" v-model="prefix" class="input-prefix" placeholder="Enter prefix..." />
          </label>
        </slide-checkbox>
        <slide-checkbox id="checkbox-old-spec" v-model="useOldSpec">
          <label for="checkbox-old-spec">
            Include support for
            <strong>
              <a
                target="_blank"
                href="https://rachelandrew.co.uk/archives/2016/11/26/should-i-try-to-use-the-ie-implementation-of-css-grid-layout/"
                >legacy grid spec</a
              >
            </strong>
            (IE 10+).
          </label>
        </slide-checkbox>
        <div v-if="useOldSpec" class="checkbox-warning">
          <strong>Warning:</strong> legacy grid spec does not support
          <a
            target="_blank"
            class="auto-placement-link"
            href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Auto-placement_in_CSS_Grid_Layout"
            >auto-placement of elements!</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { store, createAreaState } from '../../store.js'
import { highlight } from '../utils/highlight.js'
import { areaToCSS, areaToHTML, ie_areaToCSS } from '../../generateCode.js'

import IconCodepen from '../icons/icon-codepen.vue'
import SlideCheckbox from '../basic/SlideCheckbox.vue'

import IconTrash from '../icons/icon-trash.vue'
import SidebarButton from '../basic/SidebarButton.vue'

import Permalink from './Permalink.vue'

export default {
  name: 'Code',
  components: {
    IconCodepen,
    SlideCheckbox,
    IconTrash,
    Permalink,
    SidebarButton,
  },
  directives: { highlight },
  props: {
    area: { type: Object, required: true },
    saveDesign: { type: Function, default: null },
  },
  data() {
    return {
      useRepeat: false,
      useTemplateAreas: true,
      usePrefix: false,
      prefix: 'lt',
      useOldSpec: false,
      showPermalink: false,
      permalink: '',
    }
  },
  computed: {
    getCSSCode() {
      const { area, useTemplateAreas, useOldSpec } = this
      const prefix = this.usePrefix ? this.prefix : undefined
      const repeat = this.useRepeat
      let css = areaToCSS(area, { useTemplateAreas, prefix, repeat })
      if (useOldSpec) {
        css += '\n\n'
        css += ie_areaToCSS(area, { prefix, repeat })
      }
      return css
    },
    viewCSSCode() {
      return highlight(this.getCSSCode, 'css')
    },
    getHTMLCode() {
      const prefix = this.usePrefix ? this.prefix : undefined
      return areaToHTML(this.area, { prefix })
    },
    viewHTMLCode() {
      return highlight(this.getHTMLCode, 'html')
    },
    codePenJSON() {
      const prefix = this.usePrefix ? this.prefix : undefined
      return JSON.stringify({
        title: 'New CSS Grid!',
        html: this.getHTMLCode,
        css:
          `html, body, .${prefix ? prefix + '-' : ''}grid-container { height: 100%; margin: 0; }\n\n` +
          this.getCSSCode +
          `\n/* For presentation only, no need to copy the code below */\n.${
            prefix ? prefix + '-' : ''
          }grid-container * { \n border: 1px solid red;\n position: relative;\n}\n\n.${
            prefix ? prefix + '-' : ''
          }grid-container *:after { \n content:attr(class);\n position: absolute;\n top: 0;\n left: 0;\n}\n\n`,
      })
    },
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    restart() {
      debugger
      store.setArea(createAreaState())
    },
    getTheCode() {
      // TODO: flash live code
    },
    getPermalink() {
      // Permalink supports depends on the deployed editor
      if (this.saveDesign) {
        this.saveDesign(this.area).then((path) => {
          this.permalink = path
          this.showPermalink = true
        })
      }
    },
  },
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
  &.codepen-btn {
    background: #333;
    &:hover {
      background: #444;
    }
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
.output-settings {
  margin: 10px 0 0 0;
  width: 100%;
  font-size: 14px;
  a {
    color: #3094b4;
  }
  .slide-checkbox {
    padding-bottom: 5px;
    &:last-child {
      padding-bottom: 0;
    }
  }
  > {
    padding-bottom: 5px;
  }
}

.divider {
  flex-grow: 1;
}
</style>
