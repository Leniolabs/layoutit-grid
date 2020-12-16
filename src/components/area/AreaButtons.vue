<template>
  <button v-show="!hasDisplay" aria-label="Add sub grid" class="btn-subgrid" title="Add Sub Grid" @click="subGrid()" :style="{ background: `${area.color}` }">
    <IconSubgrid />
  </button>
  <!--button v-show="!hasDisplay" aria-label="Add flex" class="btn-subgrid" @click="subFlex(area)">
    <IconFlex />
  </button-->
    <button
      v-show="!hasDisplay"
      aria-label="Remove area"
      class="btn-remove"
      title="Remove Area"
      @click="removeArea(area)"
      :style="{ background: `${area.color}` }"
    >
      <IconRemove />
    </button>
    <button v-show="hasDisplay" aria-label="Clear area" class="btn-remove" title="Clear Area" @click="clearArea(area)" :style="{ background: `${area.color}` }" >
      <IconClear />
    </button>

</template>

<script setup>
import IconRemove from '../icons/IconRemove.vue'
import IconClear from '../icons/IconClear.vue'
import IconSubgrid from '../icons/IconSubgrid.vue'
import IconFlex from '../icons/IconFlex.vue'

import { defineProps, computed } from 'vue'
import {
  mainArea,
  setCurrentArea,
  createGridState,
  createFlexState,
  deselectCurrentArea,
  clearArea,
  removeArea,
} from '../../store.js'

const props = defineProps({
  area: { type: Object, required: true },
})
const hasDisplay = computed(() => props.area.grid || props.area.flex)

function subFlex() {
  clearArea(props.area)
  if (!area.flex) {
    props.area.flex = createFlexState()
  }
  setCurrentArea(props.area)
}

function subGrid() {
  clearArea(props.area)
  if (!props.area.grid) {
    props.area.type = 'div'
    props.area.display = 'grid'
    props.area.grid = createGridState()
  }
  setCurrentArea(props.area)
}
</script>

<style scoped lang="scss">
button {
  border: 0;
  height: 28px;
  min-width: 28px;
  color: #fff;
  cursor: pointer;
  pointer-events: all;
  align-items: center;
  padding: 0;
  justify-content: center;   
  border-left: 1px solid rgba(238,238,238,0.4);
  position: relative;
  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(255,255,255,0.15) ;
    pointer-events: none;
    display: none;
  }  
  &:hover:before { display: block; }
  &.btn-save {
    border-radius: 2px 0 0 2px;
  }
  &.btn-subgrid {
    padding-top: 2px;
  }
  &.btn-remove {
    padding-top: 1px;
    border-bottom-right-radius: 2px;    
    svg {
      height: 0.688rem;
      width: 0.688rem;
      fill: #fff;
    }
  }
}
</style>
