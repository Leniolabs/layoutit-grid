<template>
  <section
    v-if="selection"
    :style="{ 'grid-area': gridArea, 'border-color': selection.color }"
    class="area-selection"
  >
    <input
      ref="nameInputElement"
      v-model="gridName"
      class="area-text"
      type="text"
      placeholder="Area Name"
      @keyup.enter="selectionSave"
    />
    <button class="btn-remove" title="Remove Selection" @click="selection = null">
      <icon-remove />
    </button>
    <button
      :disabled="gridName === '' || !isValidAreaName(gridName) || invalidClassName"
      class="btn-save"
      @click="selectionSave"
    >Save</button>
  </section>
</template>

<script setup="props">
import { gridRegionToGridArea } from '../../utils.js'
import { store, isValidAreaName } from '../../store.js'

import IconRemove from '../icons/IconRemove.vue'

import { ref, computed } from 'vue'

function selectionDimension(type, start, end) {
  return {
    start: Math.min(start[type].start, end[type].start),
    end: Math.max(start[type].end, end[type].end),
  }
}

function selectionArea(selection) {
  const { start, end } = selection
  return {
    row: selectionDimension('row', start, end),
    col: selectionDimension('col', start, end),
  }
}

function farEnough(a, b, delta = 5) {
  return Math.abs(a.x - b.x) > delta || Math.abs(a.y - b.y) > delta
}

export default {
  components: { IconRemove },
  props: {
    area: { type: Object, required: true },
  },
}

export const selection = ref(null)
export const gridName = ref('')
export const nameInputElement = ref(null)

export const grid = computed(() => props.area.grid)

export const gridArea = computed(() =>
  selection.value ? gridRegionToGridArea(selectionArea(selection.value)) : 'initial'
)

// TODO: rework to validName
export const invalidClassName = computed(() => {
  const name = gridName.value
  return (name[0] >= '0' && name[0] <= '9') || !name[0]
})

export { isValidAreaName }

export function cellDown({ clientX, clientY }, section) {
  store.data.currentArea = this.area

  if (!selection.value) {
    selection.value = {
      start: section,
      end: section,
      color: store.getRandomColor(),
      fresh: true,
    }
  }

  selection.value.dragging = {
    initial: { x: clientX, y: clientY },
    section,
  }

  const finishDraggingSelection = () => {
    if (selection.value.dragging) {
      selection.value.end = selection.value.dragging.section
      selection.value.dragging = null
    }
    selection.value.fresh = false
    window.removeEventListener('pointerup', finishDraggingSelection)
  }
  window.addEventListener('pointerup', finishDraggingSelection, false)

  // TODO: nextTick is not working here
  setTimeout(() => nameInputElement.value.focus(), 0)
}

export function cellMove({ clientX, clientY }, section) {
  if (selection.value) {
    const { dragging, fresh } = selection.value
    if (dragging) {
      if (fresh) {
        selection.value.end = section
      } else {
        if (farEnough(dragging.initial, { x: clientX, y: clientY })) {
          selection.value.fresh = true
          selection.value.start = section
        }
      }
      dragging.section = section
    }
  }
}

export function selectionSave() {
  if (!invalidClassName.value) {
    const { color } = selection.value
    grid.value.areas.push({
      gridRegion: selectionArea(selection.value),
      color,
      name: gridName.value,
      grid: null,
      flex: null,
    })

    gridName.value = ''
    selection.value = null
  }
}
</script>

<style scoped lang="scss">
.area-selection {
  touch-action: none;
  background: #fff;
  height: 100%;
  cursor: pointer;
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  border: 2px solid;
  background: rgba(255, 255, 255, 0.7);
  z-index: 1;
  &:before {
    display: none;
  }
  input {
    position: absolute;
    top: 50%;
    left: 0;
    bottom: 0;
    right: 0;
    transform: translate(0, -50%);
    width: 100%;
    text-align: center;
    border: 0;
    font-size: 30px;
    color: #300548;
    font-family: 'Alegreya Sans', 'Helvetica Neue', Arial, sans-serif;
    background: transparent;
  }
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
  }
  button {
    position: absolute;
    z-index: 999;
    top: 5px;
    pointer-events: all;
    vertical-align: top;
    &.btn-save {
      right: 38px;
    }
    &.btn-remove {
      right: 5px;
    }
  }
}

.invalid-class-name {
  color: red;
}
</style>
