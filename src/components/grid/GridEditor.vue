<template>
  <GridCell
    v-for="(section, i) in gridSections(grid)"
    :key="`section-${i}`"
    :area="area"
    :section="section"
    :grayed="!isActive"
    :focused="isFocused(section)"
    @pointerdown="(event) => $refs.selection.cellDown(event)"
  />

  <GridTrack
    v-for="track in gridTracks"
    :key="`track-${track.type}-${track.pos}`"
    :area="area"
    :type="track.type"
    :pos="track.pos"
  />

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
    @down="handleLineDown"
  />

  <GridIntersection
    v-for="intersection in gridIntersections"
    :key="`intersection-${intersection.row}-${intersection.col}`"
    :area="area"
    :row="intersection.row"
    :col="intersection.col"
    :colgap="computedGap.col"
    :rowgap="computedGap.row"
    @down="handleLineDown"
  />

  <AreaSelection ref="selection" :area="area" @editstart="(a) => (editingArea = a)" @editend="editingArea = null" />
</template>

<script setup="props, { el }">
// @edit="$emit('edit')"
import GridCell from './GridCell.vue'
import GridTrack from './GridTrack.vue'
import GridLine from './GridLine.vue'
import GridIntersection from './GridIntersection.vue'
import AreaSelection from './AreaSelection.vue'
import AreaEditor from '../area/AreaEditor.vue'
import AreaInfo from '../area/AreaInfo.vue'

import {
  currentArea,
  setCurrentArea,
  valueUnitToString,
  pause,
  resume,
  dragging as ref_dragging,
  currentFocus,
  currentHover,
} from '../../store.js'
import { parseValue, parseUnit, parseValueUnit } from '../../store'
import { useIsCurrentArea, useIsActiveArea } from '../../composables/area.js'

import { computed, watch, toRef, onBeforeUpdate, nextTick } from 'vue'

import { gridSections } from '../../utils.js'

export default {
  props: {
    area: { type: Object, required: true },
    computedStyles: { type: Object, default: null },
    computedGap: {
      type: Object,
      default: () => {
        return { col: '0px', row: '0px' }
      },
    },
    implicitGrid: { type: Object, required: true },
  },
}

ref: dragging = ref_dragging

ref: grid = computed(() => props.area.grid)

ref: editingArea = null

ref: areasToShow = computed(() => {
  return props.area.children
    .filter((a) => a !== editingArea)
    .flatMap((a) =>
      a.items
        ? new Array(a.items.count).fill(0).map((_, i) => {
            return { area: a, item: i + 1 }
          })
        : { area: a, item: 1 }
    )
})

ref: gridLineRefs = { col: [], row: [] }
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

ref: gridTemplateRows = computed(() => gridSizesForView('row'))
ref: gridTemplateColumns = computed(() => gridSizesForView('col'))

ref: area = toRef(props, 'area')
ref: isCurrent = useIsCurrentArea($area)
ref: isActive = useIsActiveArea($area)

function tracksFor(type) {
  return grid[type].sizes.map((size, i) => {
    return {
      type,
      pos: i + 1,
    }
  })
}
ref: gridTracks = computed(() => {
  return [...tracksFor('row'), ...tracksFor('col')]
})

function linesFor(type) {
  const end = grid[type].lineNames.length
  const lines = []
  for (let pos = 1; pos <= end; pos++) {
    lines.push({ type, pos })
  }
  return lines
}
ref: gridLines = computed(() => {
  return [...linesFor('row'), ...linesFor('col')]
})

ref: gridIntersections = computed(() => {
  const rowEnd = grid.row.sizes.length
  const colEnd = grid.col.sizes.length
  const intersections = []
  for (let row = 2; row <= rowEnd; row++) {
    for (let col = 2; col <= colEnd; col++) {
      intersections.push({ row, col })
    }
  }
  return intersections
})

function toViewGap(gap) {
  // Defaults to 1px so grid gap doesn't disappear
  // return parseValue(gap) === 0 ? '1px' : gap
  return gap
}

ref: gridGap = computed(() => {
  return `${toViewGap(grid.row.gap)} ${toViewGap(grid.col.gap)}`
})

function isFocused(section) {
  const c = currentHover.value
  return c && c.on === 'cell' && c.grid === grid && c.row === section.row.start && c.col === section.col.start
}

function calcValue(prev, prevComp, delta) {
  const sizeAdd = (prev.value * delta) / prevComp.value

  let value = +(prev.value + sizeAdd).toFixed(1)

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

function farEnough(a, b, delta = 5) {
  return Math.abs(a.x - b.x) > delta || Math.abs(a.y - b.y) > delta
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

  setCurrentArea(props.area)

  const initialPos = { x: event.clientX, y: event.clientY }
  const initialTime = new Date().getTime()
  const initialRowSizes = [...grid.row.sizes]
  const initialRowComputedSizes = props.computedStyles.gridTemplateRows.split(/\s/g)
  const initialColSizes = [...grid.col.sizes]
  const initialColComputedSizes = props.computedStyles.gridTemplateColumns.split(/\s/g)
  const rowsNumber = grid.row.sizes.length
  const colsNumber = grid.col.sizes.length
  const rowLine = row && row > 1 && row <= rowsNumber ? row : undefined
  const colLine = col && col > 1 && col <= colsNumber ? col : undefined
  const handleMove = (event) => {
    const pos = { x: event.clientX, y: event.clientY }

    if (!dragging && (new Date().getTime() - initialTime > 500 || farEnough(initialPos, pos))) {
      if (colLine || rowLine) {
        // Start dragging grid lines
        dragging = { grid: grid, rowLine, colLine, prevCursor: document.body.style.cursor }
        document.body.style.cursor = col && row ? 'move' : col ? 'col-resize' : 'row-resize'
        pause()
      }
    }
    if (dragging) {
      if (dragging.rowLine !== null) {
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

  const handleUp = () => {
    if (dragging) {
      // Finish dragging grid lines
      document.body.style.cursor = dragging.prevCursor
      dragging = null
      resume(true)
    } else if (new Date().getTime() - initialTime < 500) {
      gridLineRefs[col ? 'col' : 'row'][col || row].toggleLineName()
    }

    window.removeEventListener('pointermove', handleMove)
    window.removeEventListener('pointerup', handleUp)
  }
  window.addEventListener('pointermove', handleMove)
  window.addEventListener('pointerup', handleUp)
}
</script>

<style scoped lang="scss">
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
