<template>
  <MobileButton @click="toggleView" />
  <PropsSidebar :area="mainArea" />
  <GridEditor :area="mainArea" />
  <SidebarRight>
    <template v-slot:body>
      <LiveCode :area="mainArea" :save-design="saveDesign" />
    </template>
  </SidebarRight>
</template>

<script setup>
export { default as MobileButton } from './MobileButton.vue'
export { default as GridEditor } from './grid/GridEditor.vue'
export { default as AreaEditor } from './area/AreaEditor.vue'
export { default as SidebarRight } from './basic/SidebarRight.vue'
export { default as PropsSidebar } from './props/PropsSidebar.vue'
export { default as LiveCode } from './code/LiveCode.vue'

import { ref, computed } from 'vue'
import { nextViewMap } from './utils/constants.js'
export { mainArea, currentArea, currentView } from '../store.js'

export default {
  props: {
    saveDesign: { type: Function, default: null },
  },
}

const nextView = (view) => nextViewMap[view] || 'editor'

export function toggleView() {
  currentView.value = nextView(currentView.value)
}
</script>

<style lang="scss">
:root {
  --color-add: #01579b;
  --color-add-active: #4f83cc;
  --color-remove: #c2185b;
  --color-remove-active: #fa5788;
  --color-hire-us: var(--color-remove);
  --color-hire-us-active: var(--color-remove-active);
  --color-darkmode: var(--color-add);
  --color-darkmode-active: #27ae60;
}

*,
*:before,
*:after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  height: 100%;
  background: #300548;
  font-size: 100%;
}
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  opacity: 1;
}

p {
  margin-top: 0;
  font-size: 18px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.disabled,
[disabled],
.area-selection button[disabled] {
  opacity: 0.6;
  pointer-events: none;
}

*:focus {
  outline: none;
}

#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #2c3e50;
  background: linear-gradient(#1d032d, #300748);
  height: 100%;
  display: grid;
  grid-template-columns: 220px 1fr 400px;
  grid-column-gap: 15px;
  padding-top: 5px;
  padding-bottom: 5px;
  @media screen and (max-width: 768px) {
    display: block;
  }
  &.darkmode {
    .grid {
      outline: 1px dashed #fff;
      box-shadow: none;
    }
    .inside-row-size,
    .inside-col-size {
      color: #fff;
    }
    section {
      background: #300548;
      &:after,
      &:before {
        background: #300548;
        color: #fff;
      }
      &.grid-saved,
      &.grid-add {
        background: #fff;
      }
      &.grayed {
        background: #032c06;
      }
    }

    .grid-section.grayed {
      &:before {
        background: #032c06;
      }
      background: #032c06;
    }

    .area-selection {
      input {
        color: #a8a8a2;
      }
    }
  }
}

.mobile-button {
  position: fixed;
  bottom: 1em;
  right: 1em;
}
</style>
