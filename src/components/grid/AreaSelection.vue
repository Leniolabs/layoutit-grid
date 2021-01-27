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

<script>
import IconRemove from '../icons/IconRemove.vue'

import { gridRegionToGridArea, createSection, toCssName } from '../../utils.js'
import { createAreaState, setCurrentArea, getRandomColor, isValidAreaName, getGridRegion } from '../../store.js'

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
  components: {
    IconRemove,
  },
  props: {
    area: { type: Object, required: true },
  },
  emits: ['editend'],
  setup(props, { expose, emit }) {
    const selection = ref(null)
    const gridName = ref('')
    const nameInputElement = ref(null)

    const grid = computed(() => props.area.grid)

    const gridArea = computed(() =>
      selection.value ? gridRegionToGridArea(selectionArea(selection.value)) : 'initial'
    )

    function editArea(area) {
      // TODO: if ! gridRegion
      const gridRegion = getGridRegion(area)
      if (gridRegion) {
        gridName.value = area.name

        selection.value = {
          start: createSection({ col: gridRegion.col.start, row: gridRegion.row.start }),
          end: createSection({ col: gridRegion.col.end - 1, row: gridRegion.row.end - 1 }),
          color: area.color,
          fresh: false,
          area,
        }

        setTimeout(() => nameInputElement.value.focus(), 0)
      }
    }

    function validGridName(name) {
      return name !== '' && !(name[0] >= '0' && name[0] <= '9')
    }

    const saveEnabled = computed(() => {
      const name = gridName.value
      return (
        validGridName(name) && (isValidAreaName(name) || (selection.value.area && selection.value.area.name === name))
      )
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

        if (!selection.value) {
          selection.value = {
            start: section,
            end: section,
            color: getRandomColor(),
            fresh: true,
          }
        }

        selection.value.dragging = {
          initial: { x: event.clientX, y: event.clientY },
          section,
        }

        const onPointerMove = (event) => {
          const sectionOver = sectionFromEvent(event)
          if (sectionOver) {
            const { dragging, fresh } = selection.value
            if (dragging) {
              if (fresh) {
                selection.value.end = sectionOver
              } else {
                if (farEnough(dragging.initial, { x: event.clientX, y: event.clientY })) {
                  selection.value.fresh = true
                  selection.value.start = section
                }
              }
              dragging.section = sectionOver
            }
          }
        }

        const onPointerUp = () => {
          if (selection.value.dragging) {
            selection.value.end = selection.value.dragging.section
            selection.value.dragging = null
          }
          selection.value.fresh = false
          window.removeEventListener('pointermove', onPointerMove)
          window.removeEventListener('pointerup', onPointerUp)

          // TODO: nextTick is not working here
          setTimeout(() => nameInputElement.value.focus(), 100)
        }
        window.addEventListener('pointermove', onPointerMove, false)
        window.addEventListener('pointerup', onPointerUp, false)
      }
    }

    function saveSelection() {
      if (saveEnabled.value) {
        const { color } = selection.value
        const sa = selection.value.area
        if (sa) {
          sa.name = toCssName(gridName.value)
          sa.gridArea = gridRegionToGridArea(selectionArea(selection.value))
          emit('editend', sa)
        } else {
          props.area.children.push(
            createAreaState({
              name: toCssName(gridName.value),
              gridArea: gridRegionToGridArea(selectionArea(selection.value)),
              color,
              parent: props.area,
            })
          )
        }

        gridName.value = ''
        selection.value = null
      }
    }

    function closeSelection() {
      if (selection.value.area) {
        emit('editend', selection.value.area)
      }
      selection.value = null
    }

    expose({ cellDown, editArea })

    return {
      saveEnabled,
      gridName,
      gridArea,
      selection,
      saveSelection,
      closeSelection,
      nameInputElement,
    }
  },
}
</script>

<style scoped lang="scss">
.area-selection {
  pointer-events: none;
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
    pointer-events: initial;
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
    font-size: 13px;
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
        width: 10px;
        stroke: #fff;
        stroke-width: 20px;
      }
    }
  }
  button {
    position: absolute;
    top: 5px;
    pointer-events: all;
    vertical-align: top;
    &.btn-save {
      right: 34px;
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
