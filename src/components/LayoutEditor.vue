<template>
  <mobile-button @click="activeSidebar = !activeSidebar" />
  <grid-editor :area="mainArea" />
  <props-sidebar v-if="activeSidebar" :area="mainArea" />
  <sidebar-right v-if="activeSidebarRight">
    <template v-slot:body>
      <live-code :area="mainArea" :save-design="saveDesign" />
    </template>
  </sidebar-right>
</template>

<script setup>
import MobileButton from './MobileButton.vue'
import GridEditor from './grid/GridEditor.vue'
import AreaEditor from './area/AreaEditor.vue'
import SidebarRight from './basic/SidebarRight.vue'

import PropsSidebar from './props/PropsSidebar.vue'
import LiveCode from './code/LiveCode.vue'

import { watch, ref, computed } from 'vue'
export { darkmode, mainArea, currentArea } from '../store.js'

export default {
  components: {
    AreaEditor,
    GridEditor,
    PropsSidebar,
    SidebarRight,
    LiveCode,
    MobileButton,
  },
  props: {
    saveDesign: { type: Function, default: null },
  },
}

export let activeSidebar = ref(true)
export let activeSidebarRight = ref(true)

watch(darkmode, () => {
  document.getElementById('app').classList[darkmode.value ? 'add' : 'remove']('darkmode')
})
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
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
  padding-left: calc(14em + 15px);
  padding-right: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  background: linear-gradient(#1d032d, #300748);
  height: 100%;
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
  flex-wrap: nowrap;
  > section {
    flex: 1 0 auto;
  }
  @media screen and (max-width: 768px) {
    padding: 45px 0 0;
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
