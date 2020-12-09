<template>
  <MobileButtons @toggle-props="toggleView('props')" @toggle-code="toggleView('code')" />
  <PropsSidebar :area="mainArea" />
  <div class="area-editor-container">
    <AreaEditor :area="mainArea" />
  </div>
  <SidebarRight>
    <template #body>
      <LiveCode :area="mainArea" :save-design="saveDesign" />
    </template>
  </SidebarRight>
</template>

<script setup>
import MobileButtons from './MobileButtons.vue'
import AreaEditor from './area/AreaEditor.vue'
import SidebarRight from './basic/SidebarRight.vue'
import PropsSidebar from './props/PropsSidebar.vue'
import LiveCode from './code/LiveCode.vue'

import { defineProps, ref, computed, onMounted } from 'vue'
import { mainArea, loadFromStorage, currentArea, currentView } from '../store.js'

defineProps({
  saveDesign: { type: Function, default: null },
})

function toggleView(view) {
  currentView.value = currentView.value === view ? 'editor' : view
}

onMounted(loadFromStorage)
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

/* TODO: Try to remove this
   The right border produces a jump when active without this */
#app.darkmode > .grid {
  padding-right: 1px;
}

#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #2c3e50;
  background: linear-gradient(#1d032d, #300748);
  background: #300748;
  height: 100%;
  display: grid;
  grid-template-columns: 220px 1fr 360px;
  @media screen and (max-width: 768px) {
    display: block;
  }

  &.darkmode {
    .grid {
      background: repeating-linear-gradient(45deg, transparent, transparent 9px, #1d032d 9px, #1d032d 14px);
    }
    .inside-row-size,
    .inside-col-size {
      color: #fff;
    }
    .grid-section {
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

    .area-editor,
    .area-selection {
      background: #30054899;
    }

    .line-number {
      color: #888;
      background: #300548;
      &.dragging,
      &.focused {
        background: #27ae60;
        color: #fff;
      }
    }

    .row .line-number {
      left: 1px;
    }

    .editor-track-size {
      &.row,
      &.col {
        color: #888;
      }
    }

    .col.first .line-number {
      left: 1px;
    }
    .col.last .line-number {
      right: 1px;
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

.area-editor-container {
  display: grid;
  overflow: auto;
}

.mobile-buttons {
  position: fixed;
  bottom: 1em;
}
</style>
