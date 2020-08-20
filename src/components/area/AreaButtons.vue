<template>
  <button v-show="!hasDisplay" class="btn-subgrid" title="Add Sub Grid" @click="subGrid()">
    <icon-subgrid />
  </button>
  <!--<button v-show="!hasDisplay" class="btn-subgrid" @click="subFlex(area)"><icon-flex /></button>-->
  <button v-show="!hasDisplay" class="btn-remove" title="Remove Area" @click="removeArea()">
    <icon-remove />
  </button>
  <button v-show="hasDisplay" class="btn-remove" title="Clear Area" @click="clearArea()">
    <icon-clear />
  </button>
</template>

<script setup="props, { emit }">
import IconRemove from '../icons/icon-remove.vue'
import IconClear from '../icons/icon-clear.vue'
import IconSubgrid from '../icons/icon-subgrid.vue'
import IconFlex from '../icons/icon-flex.vue'

import { computed } from 'vue'
import { store, createGridState, createFlexState } from '../../store.js'

export default {
  components: {
    IconRemove,
    IconClear,
    IconSubgrid,
    IconFlex,
  },
  props: {
    area: { type: Object, required: true },
  },
}

export const hasDisplay = computed(() => props.area.grid || props.area.flex)

export function clearArea() {
  props.area.grid = null
  props.area.flex = null
  deselect()
}

export function removeArea() {
  const parent = store.getAreaParent(props.area)
  const { areas } = parent.grid
  areas.splice(areas.indexOf(props.area), 1)
  deselect()
}

export function subFlex() {
  clearArea()
  if (!area.flex) {
    props.area.flex = createFlexState()
  }
  store.data.currentArea = props.area
}

export function subGrid() {
  clearArea()
  if (!props.area.grid) {
    props.area.grid = createGridState(2, 3)
  }
  store.data.currentArea = props.area
}

function deselect() {
  store.data.currentArea = store.data.area
}
</script>

<style scoped lang="scss">
button {
  background: #3094b4;
  border: 0;
  height: 1.8rem;
  line-height: 0.5rem;
  margin-bottom: 5px;
  color: #fff;
  font-size: 0.875rem;
  display: inline-block;
  padding: 0.375em;
  cursor: pointer;

  position: absolute;
  z-index: 999;
  top: 5px;
  pointer-events: all;
  vertical-align: top;

  &.btn-save {
    border-radius: 2px 0 0 2px;
    &:hover {
      background: #2fc334;
    }
  }
  &.btn-subgrid {
    background: #6b16a1;
    padding-top: 4px;
    &:hover {
      background: #490c6f;
    }
    svg {
      height: 1.125rem;
      width: 1.125rem;
      fill: #fff;
    }
  }
  &.btn-remove {
    width: 1.8rem;
    background: #e91e63;
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
    &:hover {
      background: #c11651;
    }
    svg {
      height: 0.688rem;
      width: 0.688rem;
      fill: #fff;
    }
  }

  &.btn-save {
    right: 38px;
  }
  &.btn-remove {
    right: 5px;
  }
  &.btn-subgrid,
  &.btn-remove {
    position: relative;
    float: left;
    right: 0;
    top: 0;
    margin-right: 5px;
  }
}
</style>
