<template>
  <button v-show="!hasDisplay" aria-label="Add sub grid" class="btn-subgrid" title="Add Sub Grid" @click="subGrid()">
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
  >
    <IconRemove />
  </button>
  <button v-show="hasDisplay" aria-label="Clear area" class="btn-remove" title="Clear Area" @click="clearArea(area)">
    <IconClear />
  </button>
</template>

<script setup="props, { emit }">
export { default as IconRemove } from '../icons/IconRemove.vue'
export { default as IconClear } from '../icons/IconClear.vue'
export { default as IconSubgrid } from '../icons/IconSubgrid.vue'
export { default as IconFlex } from '../icons/IconFlex.vue'

import { computed } from 'vue'
import { mainArea, setCurrentArea, createGridState, createFlexState } from '../../store.js'
export { deselectCurrentArea, clearArea, removeArea } from '../../store.js'

export default {
  props: {
    area: { type: Object, required: true },
  },
}

export const hasDisplay = computed(() => props.area.grid || props.area.flex)

export function subFlex() {
  clearArea(props.area)
  if (!area.flex) {
    props.area.flex = createFlexState()
  }
  setCurrentArea(props.area)
}

export function subGrid() {
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
  background: var(--color-add);
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
  top: 5px;
  pointer-events: all;
  vertical-align: top;

  &.btn-save {
    border-radius: 2px 0 0 2px;
    &:hover {
      background: var(--color-add-active);
    }
  }
  &.btn-subgrid {
    background: var(--color-add);
    padding-top: 4px;
    &:hover {
      background: var(--color-add-active);
    }
    svg {
      height: 1.125rem;
      width: 1.125rem;
      fill: #fff;
    }
  }
  &.btn-remove {
    width: 1.8rem;
    background: var(--color-remove);
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
    &:hover {
      background: var(--color-remove-active);
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
