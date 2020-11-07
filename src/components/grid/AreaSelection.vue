<template>
  <section v-if="selection" :style="{ 'grid-area': gridArea, 'border-color': selection.color }" class="area-selection">
    <input
      ref="nameInputElement"
      v-model="gridName"
      class="area-text"
      type="text"
      placeholder="Area Name"
      aria-label="area name"
      @keyup.enter="saveSelection"
      @pointerdown.stop
    />
    <button aria-label="Remove selection" class="btn-remove" title="Remove Selection" @click="closeSelection">
      <IconRemove />
    </button>
    <button :disabled="!saveEnabled" class="btn-save" aria-label="Save area" @click="saveSelection">Save</button>
  </section>
</template>

<script setup="props, { emit }">
import IconRemove from '../icons/IconRemove.vue'

import { gridRegionToGridArea, createSection, toCssName } from '../../utils.js'
import { createAreaState, setCurrentArea, getRandomColor, isValidAreaName, batch, getGridRegion } from '../../store.js'

import { computed } from 'vue'

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
  props: {
    area: { type: Object, required: true },
  },
}

ref: selection = null
ref: gridName = ''
ref: nameInputElement = null

ref: grid = computed(() => props.area.grid)

ref: gridArea = computed(() => (selection ? gridRegionToGridArea(selectionArea(selection)) : 'initial'))

function editArea(area) {
  // TODO: if ! gridRegion
  const gridRegion = getGridRegion(area)
  if (gridRegion) {
    emit('editstart', area)

    gridName = area.name

    selection = {
      start: createSection({ col: gridRegion.col.start, row: gridRegion.row.start }),
      end: createSection({ col: gridRegion.col.end - 1, row: gridRegion.row.end - 1 }),
      color: area.color,
      fresh: false,
      area,
    }

    setTimeout(() => nameInputElement.focus(), 0)
  }
}

function validGridName(name) {
  return name !== '' && !(name[0] >= '0' && name[0] <= '9')
}

ref: saveEnabled = computed(() => {
  const name = gridName
  return validGridName(name) && (isValidAreaName(name) || (selection.area && selection.area.name === name))
})

function sectionFromEvent() {
  const el = document.elementFromPoint(event.clientX, event.clientY)
  if (el) {
    const { colStart, rowStart } = el.dataset
    if (colStart !== undefined && rowStart !== undefined) {
      return createSection({ col: +colStart, row: +rowStart })
    }
  }
  return undefined
}

function cellDown(event) {
  event.stopPropagation()
  event.preventDefault()

  const section = sectionFromEvent(event)
  if (section) {
    setCurrentArea(props.area)

    if (!selection) {
      selection = {
        start: section,
        end: section,
        color: getRandomColor(),
        fresh: true,
      }
    }

    selection.dragging = {
      initial: { x: event.clientX, y: event.clientY },
      section,
    }

    const onPointerMove = (event) => {
      const sectionOver = sectionFromEvent(event)
      if (sectionOver) {
        const { dragging, fresh } = selection
        if (dragging) {
          if (fresh) {
            selection.end = sectionOver
          } else {
            if (farEnough(dragging.initial, { x: event.clientX, y: event.clientY })) {
              selection.fresh = true
              selection.start = section
            }
          }
          dragging.section = sectionOver
        }
      }
    }

    const onPointerUp = () => {
      if (selection.dragging) {
        selection.end = selection.dragging.section
        selection.dragging = null
      }
      selection.fresh = false
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)

      // TODO: nextTick is not working here
      setTimeout(() => nameInputElement.focus(), 100)
    }
    window.addEventListener('pointermove', onPointerMove, false)
    window.addEventListener('pointerup', onPointerUp, false)
  }
}

function saveSelection() {
  if (saveEnabled) {
    const { color } = selection
    const sa = selection.area
    if (sa) {
      batch(() => {
        sa.name = toCssName(gridName)
        sa.gridRegion = gridRegionToGridArea(selectionArea(selection))
      })
      emit('editend', sa)
    } else {
      props.area.children.push(
        createAreaState({
          name: toCssName(gridName),
          gridArea: gridRegionToGridArea(selectionArea(selection)),
          color,
          parent: props.area,
        })
      )
    }

    gridName = ''
    selection = null
  }
}

function closeSelection() {
  if (selection.area) {
    emit('editend', selection.area)
  }
  selection = null
}
</script>

<style scoped lang="scss">
.area-selection {
  pointer-events: initial;
  touch-action: none;
  background: #fff;
  height: 100%;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  border: 2px solid;
  background: rgba(255, 255, 255, 0.7);
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
    &.btn-save {
      border-radius: 2px 0 0 2px;
      &:hover {
        background: var(--color-add-active);
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
  }
  button {
    position: absolute;
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
