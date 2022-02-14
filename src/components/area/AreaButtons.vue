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

<script setup lang="ts">
import {
  useAppState,
  setCurrentArea,
  createGridState,
  createFlexState,
  deselectCurrentArea,
  clearArea,
  removeArea,
  subGrid,
} from '../../store.js'

let { mainArea, currentArea, overArea, dragging } = $(useAppState())

const { area } = defineProps<{ area }>()

defineEmits(['edit'])

let hasDisplay = $computed(() => area.grid || area.flex)

function subFlex() {
  clearArea(area)
  if (!area.flex) {
    area.flex = createFlexState()
  }
  setCurrentArea(area)
}
</script>

<style scoped lang="postcss">
button {
  border: 0;
  height: 30px;
  width: 30px;
  color: var(--color-white);
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
    background: rgba(var(--color-white-rgb), 0.15);
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
      stroke: var(--color-gray-lightest);
      stroke-width: 15px;
    }
  }
  &.btn-remove.btn-clear svg {
    stroke: transparent;
    width: 13px;
  }
}
</style>
