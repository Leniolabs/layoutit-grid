<template>
  <section
    v-if="selection && selection.parent === area"
    :style="{ 'grid-area': gridArea, 'border-color': selection.color }"
    class="area-selection"
    @keyup.esc="closeSelection"
  >
    <span v-if="selection && selection.area" class="editing-label">Editing</span>
    <input
      ref="nameInputElement"
      v-model="selection.name"
      class="area-text"
      type="text"
      placeholder="Area Name"
      aria-label="area name"
      @keyup.enter="saveSelection"
      @keyup.left="saveSelection"
      @keyup.right="saveSelection"
      @pointerdown.stop
    />
    <button aria-label="Remove selection" class="btn-remove" title="Remove Selection" @click="closeSelection">
      <IconRemove />
    </button>
    <button
      :class="{ disabled: !saveEnabled }"
      class="btn-save"
      aria-label="Save area"
      @click="saveEnabled ? saveSelection() : nameInputElement.focus()"
    >
      save
    </button>
  </section>
</template>

<script setup lang="ts">
import { gridRegionToGridArea, createSection, toCssName } from '../../utils.js'
import {
  useAppState,
  createAreaState,
  setCurrentArea,
  getRandomColor,
  isValidAreaName,
  selectionGridArea,
} from '../../store.js'

let { overArea, selection } = $(useAppState())

function farEnough(a, b, delta = 5) {
  return Math.abs(a.x - b.x) > delta || Math.abs(a.y - b.y) > delta
}

let { area, implicitGrid } = defineProps<{ area; implicitGrid }>()

let nameInputElement = $ref(null)

let grid = $computed(() => area.grid)

let gridArea = $computed(() => (selection ? selectionGridArea(selection) : 'initial'))

function validGridName(name) {
  return name !== '' && !(name[0] >= '0' && name[0] <= '9')
}

let saveEnabled = $computed(() => {
  const name = selection ? selection.name : ''
  return validGridName(name) && (isValidAreaName(name) || (selection.area && selection.area.name === name))
})

function sectionFromEvent(event) {
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
    if (selection && selection.parent !== area) {
      selection = null
    }

    if (!(selection && selection.area)) {
      setCurrentArea(area)
    }

    if (!selection) {
      selection = {
        start: section,
        end: section,
        color: getRandomColor(),
        name: '',
        fresh: true,
        implicitGrid: implicitGrid,
        parent: area,
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

      if (!(selection && selection.area)) {
        nextTick(() => nameInputElement.focus())
      }
    }
    window.addEventListener('pointermove', onPointerMove, false)
    window.addEventListener('pointerup', onPointerUp, false)
  }
}

function saveSelection() {
  if (saveEnabled) {
    const sa = selection.area
    if (sa) {
      sa.name = toCssName(selection.name)
      sa.gridArea = selectionGridArea(selection)
      overArea = sa
    } else {
      const newArea = createAreaState({
        name: toCssName(selection.name),
        gridArea: selectionGridArea(selection),
        color: selection.color,
        parent: area,
      })
      area.children.push(newArea)
      overArea = newArea
    }

    selection = null
  }
}

function closeSelection() {
  selection = null
}

defineExpose({ cellDown })
</script>

<style scoped lang="postcss">
.area-selection {
  pointer-events: none;
  touch-action: none;
  background: var(--color-white);
  height: 100%;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  border: 2px solid;
  background: rgba(var(--color-white-rgb), 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  &:before {
    display: none;
  }
  .editing-label {
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 16px;
  }
  input {
    pointer-events: initial;
    text-align: center;
    border: 0;
    font-size: 24px;
    color: var(--color-purple-dark);
    font-family: 'Alegreya Sans', 'Helvetica Neue', Arial, sans-serif;
    background: transparent;
    width: 100%;
  }
  button {
    background: var(--color-add);
    border: 0;
    height: 30px;
    color: var(--color-white);
    font-size: 13px;
    display: inline-block;
    padding: 0.375em;
    cursor: pointer;
    position: relative;
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
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
    &:hover:not(.disabled):before {
      display: block;
    }
    &.btn-save {
      border-bottom-left-radius: 2px;
      padding: 0 10px;
      &:hover:not(.disabled) {
        background: var(--color-add-active);
      }
    }
    &.btn-subgrid {
      background: var(--color-purple);
      padding-top: 4px;
      &:hover {
        background: var(--color-purple-middle);
      }
      svg {
        height: 1.125rem;
        width: 1.125rem;
        fill: var(--color-white);
      }
    }
    &.btn-remove {
      width: 30px;
      background: var(--color-remove);
      &:hover {
        background: var(--color-remove-active);
      }
      svg {
        width: 10px;
        stroke: var(--color-white);
        stroke-width: 15px;
      }
    }
  }
  button {
    position: absolute;
    top: 3px;
    pointer-events: all;
    vertical-align: top;
    border-radius: 2px;
    &.btn-save {
      right: 36px;
    }
    &.btn-remove {
      right: 3px;
    }
  }
}

.invalid-class-name {
  color: red;
}
</style>
