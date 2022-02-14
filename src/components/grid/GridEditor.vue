<template>
  <GridLine
    v-for="line in gridLines"
    :ref="
      (el) => {
        if (el) {
          gridLineRefs[line.type][line.pos] = el
        }
      }
    "
    :key="`line-${line.type}-${line.pos}`"
    :area="area"
    :type="line.type"
    :pos="line.pos"
    :gap="computedGap[line.type]"
    :implicit-grid="implicitGrid"
    :grayed="grayed"
    @down="handleLineDown"
    @overcell="$emit('overcell', $event)"
  />

  <GridIntersection
    v-for="intersection in gridIntersections"
    :key="`intersection-${intersection.row}-${intersection.col}`"
    :area="area"
    :row="intersection.row"
    :col="intersection.col"
    :colgap="computedGap.col"
    :rowgap="computedGap.row"
    :implicit-grid="implicitGrid"
    @down="handleLineDown"
  />
</template>

<script setup lang="ts">
import { onBeforeUpdate, computed } from 'vue'
import { useMagicKeys } from '@vueuse/core'
import { handlePointerEventsInteraction } from '../../utils.js'
import {
  useAppState,
  setCurrentArea,
  valueUnitToString,
  pause,
  resume,
  parseValue,
  parseUnit,
  parseValueUnit,
} from '../../store.js'
import { useIsCurrentArea, useIsActiveArea } from '../../composables/area.js'

let { shift } = $(useMagicKeys())

let { dragging } = $(useAppState())

const {
  area,
  implicitGrid,
  computedStyles = null,
  computedGap = null,
  grayed = false,
} = defineProps<{
  area
  implicitGrid
  computedStyles?
  computedGap?
  grayed?: boolean
}>()

defineEmits(['overcell'])

let grid = $computed(() => area.grid)

let gridLineRefs = $ref({ col: [], row: [] })
onBeforeUpdate(() => {
  gridLineRefs = { col: [], row: [] }
})

function gridSizesForView(type) {
  return grid[type].sizes
    .map((size) => {
      const unit = parseUnit(size)
      switch (unit) {
        case 'auto':
          return '200px'
        case 'min-content':
          return '100px'
        case 'max-content':
          return '300px'
        default:
          return size
      }
    })
    .join(' ')
}

let gridTemplateRows = $computed(() => gridSizesForView('row'))
let gridTemplateColumns = $computed(() => gridSizesForView('col'))

let isCurrent = $(useIsCurrentArea(computed(() => area)))
let isActive = $(useIsActiveArea(computed(() => area)))

function linesFor(type) {
  const lines = []
  const { rows, cols, ri, ci } = implicitGrid
  const size = type === 'row' ? rows : cols
  const cell_i = type === 'row' ? ri : ci
  for (let i = cell_i; i <= size + cell_i; i++) {
    lines.push({ type, pos: i })
  }
  return lines
}
let gridLines = $computed(() => {
  return [...linesFor('row'), ...linesFor('col')]
})

let gridIntersections = $computed(() => {
  const rowEnd = grid.row.sizes.length
  const colEnd = grid.col.sizes.length
  const intersections = []
  for (let row = 2; row <= rowEnd; row++) {
    for (let col = 2; col <= colEnd; col++) {
      intersections.push({ row, col })
    }
  }
  /* This will be needed directly in the main LayoutEditor, and not here once we add the resizing
      of viewport feature
  const { rows, cols, ri, ci } = implicitGrid
  const rs = ri,
    cs = ci,
    re = rows + ri,
    ce = cols + ci
  intersections.push({ row: rs, col: cs }, { row: rs, col: ce }, { row: re, col: cs }, { row: re, col: ce })
  */
  return intersections
})

function toViewGap(gap) {
  // Defaults to 1px so grid gap doesn't disappear
  // return parseValue(gap) === 0 ? '1px' : gap
  return gap
}

let gridGap = $computed(() => {
  return `${toViewGap(grid.row.gap)} ${toViewGap(grid.col.gap)}`
})

function calcValue(prev, prevComp, delta) {
  const sizeAdd = (prev.value * delta) / prevComp.value

  let value = +(prev.value + sizeAdd).toFixed(shift ? 2 : 1)

  if (value <= 0) {
    value = 0.1
  }

  return { value, unit: prev.unit }
}

function calcContainerValue(prev, delta) {
  const sizeAdd = (prev.value * delta) / prev.value

  let value = +(prev.value + sizeAdd).toFixed(shift ? 2 : 1)

  if (value <= 0) {
    value = 0.1
  }

  return { value, unit: prev.unit }
}

function resizableUnit(unit) {
  return !(unit === 'auto' || unit === 'max-content' || unit === 'min-content' || unit === 'minmax')
}

function calcSize(size, computedSize, delta) {
  const value = parseValueUnit(size)
  if (resizableUnit(value.unit)) {
    const computedValue = parseValueUnit(computedSize)
    return valueUnitToString(calcValue(value, computedValue, delta))
  }
  return size
}

function resizeGridSizes(sizes, computedSizes, delta, line) {
  const newSizes = [...sizes],
    leftPos = line - 2,
    rightPos = line - 1
  newSizes[leftPos] = calcSize(sizes[leftPos], computedSizes[leftPos], delta)
  newSizes[rightPos] = calcSize(sizes[rightPos], computedSizes[rightPos], -delta)
  return newSizes
}

function handleLineDown(event, { row, col }) {
  event.stopPropagation() // TODO: ...
  event.preventDefault()
  if (document.activeElement) {
    document.activeElement.blur()
  }

  if (dragging) {
    return
  }

  setCurrentArea(area)

  const initialPos = { x: event.clientX, y: event.clientY }
  const initialRowSizes = [...grid.row.sizes]
  const initialRowComputedSizes = computedStyles.gridTemplateRows.split(/\s/g)
  const initialColSizes = [...grid.col.sizes]
  const initialColComputedSizes = computedStyles.gridTemplateColumns.split(/\s/g)
  const rowsNumber = grid.row.sizes.length
  const colsNumber = grid.col.sizes.length
  const initialWidth = parseValueUnit(area.width)
  const initialComputedWidth = parseValueUnit(computedStyles.width)
  const initialHeight = parseValueUnit(area.height)
  const initialComputedHeight = parseValueUnit(computedStyles.height)

  const { rows, cols, ri, ci } = implicitGrid
  const rowLine = row && row > 1 && row <= rowsNumber ? row : undefined
  const colLine = col && col > 1 && col <= colsNumber ? col : undefined
  const rowEdge = row === ri || row === rows + ri ? row : undefined
  const colEdge = col === ci || col === cols + ri ? col : undefined

  handlePointerEventsInteraction(event, {
    onmove(event) {
      const pos = { x: event.clientX, y: event.clientY }

      if (!dragging) {
        if (colLine || rowLine) {
          // Start dragging grid lines
          dragging = { grid, rowLine, colLine, prevCursor: document.body.style.cursor }
          document.body.style.cursor = col && row ? 'move' : col ? 'col-resize' : 'row-resize'
          pause()
        } else if (!area.parent && (colEdge || rowEdge)) {
          // Resize main container
          /* We can not resize the main container to simulate a viewport resize
              We need to do this directly at the viewport level. Disabling for the moment
          dragging = {
            grid: grid,
            colLine: colEdge,
            rowLine: rowEdge,
            type: 'container',
            prevCursor: document.body.style.cursor,
          }
          */
        }
      }
      if (dragging) {
        if (dragging.type === 'container') {
          if (colEdge !== undefined) {
            const delta = (colEdge === 1 ? -1 : 1) * (pos.x - initialPos.x)
            area.width = valueUnitToString(calcValue(initialWidth, initialComputedWidth, 2 * delta))
          }
          if (rowEdge !== undefined) {
            const delta = (rowEdge === 1 ? -1 : 1) * (pos.y - initialPos.y)
            area.height = valueUnitToString(calcValue(initialHeight, initialComputedHeight, 2 * delta))
          }
        } else {
          if (dragging.rowLine !== undefined) {
            // Drag row line by updating row sizes
            grid.row.sizes = resizeGridSizes(
              initialRowSizes,
              initialRowComputedSizes,
              pos.y - initialPos.y,
              dragging.rowLine
            )
          }
          if (dragging.colLine !== undefined) {
            // Drag col line by updating col sizes
            grid.col.sizes = resizeGridSizes(
              initialColSizes,
              initialColComputedSizes,
              pos.x - initialPos.x,
              dragging.colLine
            )
          }
        }
      }
    },

    onup() {
      // Finish dragging grid lines
      document.body.style.cursor = dragging ? dragging.prevCursor : 'initial'
      dragging = null
      resume(true)
    },

    onclick() {
      if (!dragging) {
        gridLineRefs[col ? 'col' : 'row'][col || row].toggleLineName()
      }
    },
  })
}
</script>

<style scoped lang="postcss">
.grid-areas,
.grid-area-info {
  touch-action: none;
  pointer-events: none;
  overflow: hidden;
  user-select: none;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
</style>
