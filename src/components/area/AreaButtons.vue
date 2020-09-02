<template>
  <button
    v-show="!hasDisplay"
    aria-label="Add sub grid"
    class="btn-subgrid"
    title="Add Sub Grid"
    @click="subGrid()"
  >
    <icon-subgrid />
  </button>
  <!--button v-show="!hasDisplay" aria-label="Add flex" class="btn-subgrid" @click="subFlex(area)">
    <icon-flex />
  </button-->
  <button
    v-show="!hasDisplay"
    aria-label="Remove area"
    class="btn-remove"
    title="Remove Area"
    @click="removeArea(area)"
  >
    <icon-remove />
  </button>
  <button
    v-show="hasDisplay"
    aria-label="Clear area"
    class="btn-remove"
    title="Clear Area"
    @click="clearArea(area)"
  >
    <icon-clear />
  </button>
</template>

<script setup="props, { emit }">
import IconRemove from '../icons/IconRemove.vue'
import IconClear from '../icons/IconClear.vue'
import IconSubgrid from '../icons/IconSubgrid.vue'
import IconFlex from '../icons/IconFlex.vue'

import { computed } from 'vue'
import { mainArea, setCurrentArea, createGridState, createFlexState } from '../../store.js'
export { deselectCurrentArea, clearArea, removeArea } from '../../store.js'

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
    props.area.grid = createGridState(2, 3)
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
  z-index: 999;
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
