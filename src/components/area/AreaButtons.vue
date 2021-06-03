<template>
  <!--   <button
    v-show="currentArea === area && !hasDisplay"
    aria-label="Edit Area"
    class="btn-edit"
    title="Edit Area"
    :style="{ background: `${area.color}` }"
    @click="$emit('edit')"
  >
    <IconEdit />
  </button>-->
  <template v-if="!dragging && (currentArea === area || overArea === area)">
    <button
      v-show="!hasDisplay"
      aria-label="Add sub grid"
      class="btn-subgrid"
      title="Add subgrid"
      :style="{ background: `var(--color-add)` }"
      @click="subGrid(area)"
    >
      <IconSubgrid />
    </button>
    <!--button v-show="!hasDisplay" aria-label="Add flex" class="btn-subgrid" @click="subFlex(area)">
      <IconFlex />
    </button-->
    <button
      v-show="!hasDisplay"
      aria-label="Remove area"
      class="btn-remove"
      title="Remove area"
      @click="removeArea(area)"
    >
      <IconRemove />
    </button>
    <button
      v-show="hasDisplay"
      aria-label="Clear area"
      class="btn-remove btn-clear"
      title="Clear area"
      @click="clearArea(area)"
    >
      <IconClear />
    </button>
  </template>
</template>

<script setup>
import IconRemove from '../icons/IconRemove.vue'
import IconClear from '../icons/IconClear.vue'
import IconSubgrid from '../icons/IconSubgrid.vue'
import IconFlex from '../icons/IconFlex.vue'
import IconEdit from '../icons/IconEdit.vue'

import { computed, defineProps, defineEmit } from 'vue'
import {
  mainArea,
  currentArea,
  overArea,
  setCurrentArea,
  createGridState,
  createFlexState,
  deselectCurrentArea,
  clearArea,
  removeArea,
  subGrid,
  dragging,
} from '../../store.js'

const props = defineProps({
  area: { type: Object, required: true },
})

defineEmit(['edit'])

const hasDisplay = computed(() => props.area.grid || props.area.flex)

function subFlex() {
  clearArea(props.area)
  if (!area.flex) {
    props.area.flex = createFlexState()
  }
  setCurrentArea(props.area)
}
</script>

<style scoped lang="postcss">
button {
  border: 0;
  height: 30px;
  width: 30px;
  color: #fff;
  cursor: pointer;
  pointer-events: all;
  align-items: center;
  padding: 0;
  justify-content: center;
  position: relative;
  border-radius: 2px;
  margin-right: 3px;
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.15);
    pointer-events: none;
    display: none;
  }
  &:hover:before {
    display: block;
  }
  &.btn-save {
    border-radius: 2px 0 0 2px;
  }
  &.btn-subgrid {
    padding-top: 3px;
    svg {
      width: 12px;
    }
  }
  &.btn-remove {
    padding-top: 1px;
    border-bottom-right-radius: 2px;
    right: 0;
    background: var(--color-remove);
  }

  &.btn-edit,
  &.btn-remove {
    svg {
      width: 10px;
      stroke: #eee;
      stroke-width: 15px;
    }
  }
  &.btn-remove.btn-clear svg {
    stroke: transparent;
    width: 13px;
  }
}
</style>
