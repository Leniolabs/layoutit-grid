<template>
  <component
    :is="areaType"
    v-show="!(selection && selection.area === area)"
    :ref="(el) => (componentInstance = el)"
    :class="['area-editor', { grayed: !isActive, dragging }]"
    :style="{
      position: 'relative',
      'pointer-events': 'none',
      'touch-action': 'none',
      ...gridAreaStyles(area, gridarea),
      'touch-action': 'none',
      position: 'relative',
      background:
        area.display === 'block' && area.parent
          ? isActive
            ? '#ffffffaa'
            : '#e8e8e8aa'
          : 'repeating-linear-gradient(45deg, white, white 9px, #f8f8f8 9px, #f8f8f8 14px)',
      'user-select': 'none',
      'z-index': 0,
      ...displayStyles,
      // Force a minimum width and height so areas are still visible when the
      // user changes items placement or there are in implicit tracks
      ...(area.width === 'auto' && { 'min-width': area.parent ? 'max(24px,50%)' : '100%' }),
      ...(area.height === 'auto' && { 'min-height': area.parent ? 'max(24px,50%)' : '100%' }),
    }"
    :area="area"
    :data-area-name="area.name"
    @mouseleave="!area.parent && (overArea = null)"
  >
    <template v-if="area.display === 'grid'">
      <!-- Grid Cells and Tracks can be refactored back into GridEditor -->
      <GridCell
        v-for="(section, i) in gridCells"
        :key="`section-${i}`"
        :area="area"
        :section="section"
        :grayed="!isActive"
        :focused="isFocused(section)"
        :implicit-grid="implicitGrid"
        @pointerdown="selectionEl.cellDown($event)"
        @overcell="onOverCell"
      />
      <GridTrack
        v-for="track in gridTracks"
        :key="`track-${track.type}-${track.pos}`"
        :area="area"
        :type="track.type"
        :pos="track.pos"
        :implicit-grid="implicitGrid"
      />
      <GridEditor
        :area="area"
        :computed-styles="computedStyles"
        :computed-gap="computedGap"
        :implicit-grid="implicitGrid"
        :grayed="!isActive"
        @overcell="onOverCell"
      />
      <GridTrackSize
        v-for="track in gridTracks"
        :key="`track-size-${track.type}-${track.pos}`"
        :area="area"
        :type="track.type"
        :pos="track.pos"
        :implicit-grid="implicitGrid"
      />
    </template>

    <AreaEditor
      v-for="(a, i) in areasToShow"
      :key="`area-${a.id}`"
      :area="a"
      :gridarea="explicitAreas.gridAreas[i]"
      @edit="onEditArea(a)"
    />
    <!-- Add back when there is special markup for flex 
    <FlexEditor v-if="area.display === 'flex'" :area="area" />
    -->
    <template v-if="area.display === 'grid'">
      <template v-for="(a, i) in areasToShow" :key="`area-info-${a.id}`">
        <AreaBox :area="a" :gridarea="explicitAreas.gridAreas[i]" />
      </template>
    </template>
    <div
      v-if="area != mainArea"
      class="area-info"
      :style="{
        border: `2px solid ${areaDisplayColor(area)}`,
        backgroundColor: isHighligthed && areaDisplayColor(area).replace(', 0.8)', ', 0.07)'),
        top: 0,
        left: 0,
      }"
    >
      <div class="area-info-controls" :style="{ top: toolbarStart * 34 + 3 + 'px' }">
        <div
          :style="{ backgroundColor: area.color }"
          class="area-name"
          :class="{ implicit: area.gridArea === 'auto' }"
          @click="currentArea = area"
        >
          {{ area.name }}
        </div>
        <AreaButtons :area="area" @edit="$emit('edit')" />
      </div>
    </div>
    <div v-if="area.display === 'block' && area.padding !== '0'" class="padding-box"></div>

    <AreaSelection v-if="area.display === 'grid'" ref="selectionEl" :area="area" :implicit-grid="implicitGrid" />
  </component>
</template>

<script setup lang="ts">
// GridEditor imported globally due to circular reference with AreaEditor
// import FlexEditor from '../flex/FlexEditor.vue'

import {
  useAppState,
  parseUnit,
  parseValue,
  parseValueUnit,
  getGridArea,
  getGridRegion,
  getAreaDepth,
  areaDisplayColor,
  gridAreaToGridLimits,
} from '../../store.js'
import { findImplicitGrid, explicitGridAreaToGridRegion } from '../../utils/grid.js'
import { useIsActiveArea } from '../../composables/area.js'
import { createSection } from '../../utils.js'

let { mainArea, currentArea, currentHover, currentFocus, dragging, overArea, selection } = $(useAppState())

// name: 'AreaEditor',

const {
  area,
  item = 1,
  gridarea,
} = defineProps<{
  area
  item?: number
  gridarea?: string
}>()

defineEmits(['edit'])

let isActive = $(useIsActiveArea(computed(() => area)))

let areasToShow = $computed(() => {
  return area.children
  /*.flatMap((a) =>
      a.items
        ? new Array(a.items.count).fill(0).map((_, i) => {
            return { area: a, item: i + 1 }
          })
        : { area: a, item: 1 }
    )*/
})

let isHighligthed = $computed(() => {
  const hover = currentHover
  return (
    (area.parent &&
      !currentFocus &&
      hover &&
      ((hover.on === 'cell' && hover.area && hover.area === area) ||
        (hover.on === 'html-area' && hover.area === area))) ||
    (currentFocus && currentFocus.on === 'area' && currentFocus.area === area)
  )
})

let selectionEl = $ref(null)

let areaType = $computed(() => {
  switch (area.type) {
    case 'image':
      return ElementImage
    case 'p':
      return ElementParagraph
    case 'button':
      return ElementButton
    default:
      return 'section'
  }
})

function gridSizesForView(grid, type) {
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

function computedJustifyItem(area) {
  const { parent, justifySelf } = area
  return justifySelf !== 'initial' ? justifySelf : parent.grid ? parent.grid.justifyItems : 'initial'
}

function computedAlignItem(area) {
  const { alignSelf, parent } = area
  return alignSelf !== 'initial' ? alignSelf : parent.grid ? parent.grid.alignItems : 'initial'
}

function gridAreaStyles(area, gridArea) {
  return {
    'grid-area': gridArea || area.gridArea,
    'justify-self': computedJustifyItem(area),
    'align-self': computedAlignItem(area),
    'flex-grow': area.flexGrow,
    'flex-shrink': area.flexShrink,
    'flex-basis': area.flexBasis,
    margin: area.margin,
    padding: area.padding,
    width: area.with !== 'auto' && area.width,
    height: area.height !== 'auto' && area.height,
  }
}

function gridStyles(grid) {
  return {
    display: 'grid',
    gridTemplateRows: gridSizesForView(grid, 'row'),
    gridTemplateColumns: gridSizesForView(grid, 'col'),
    gridAutoRows: grid.row.auto.join(' '),
    gridAutoColumns: grid.col.auto.join(' '),
    gridGap: `${grid.row.gap} ${grid.col.gap}`,
    justifyContent: grid.justifyContent,
    alignContent: grid.alignContent,
    // justifyItems and alignItems are always initial to avoid afecting
    // the helper elements in the grid, grid.justifyItems and grid.alignItems
    // are used in the areas for justifySelf and alignSelf
    // we could also use justifySelf, alignSelf in each helper
  }
}

function flexStyles(flex) {
  return {
    display: 'flex',
    'flex-direction': flex.direction,
    'flex-wrap': flex.wrap,
  }
}

let displayStyles = $computed(() => {
  switch (area.display) {
    case 'grid':
      return area.grid ? gridStyles(area.grid) : {}
    case 'flex':
      return area.flex ? flexStyles(area.flex) : {}
    default:
      return {}
  }
})

let grid = $computed(() => area.grid)
let componentInstance = $ref(null)
let computedStyles = $ref(null)
let computedGap = $ref({ col: '0px', row: '0px' })
watch(
  $$(grid),
  () => {
    nextTick(() => {
      if (grid) {
        computedStyles = window.getComputedStyle(componentInstance)
        const colGap = parseValueUnit(grid.col.gap)
        const rowGap = parseValueUnit(grid.row.gap)
        computedGap = {
          col:
            colGap.unit === '%'
              ? (parseValue(computedStyles.width) / 100) * colGap.value + 'px'
              : computedStyles.columnGap,
          row:
            rowGap.unit === '%'
              ? (parseValue(computedStyles.height) / 100) * rowGap.value + 'px'
              : computedStyles.rowGap,
        }
      } else {
        computedStyles = null
        computedGap = { col: '0px', row: '0px' }
      }
    })
  },
  { immediate: true, deep: true, flush: 'post' }
)

let explicitAreas = $computed(() => {
  if (area.display === 'grid') {
    return findImplicitGrid(area)
  } else {
    return { gridAreas: [], implicitGrid: {} }
  }
})

watch($$(explicitAreas), () => {
  if (area.display === 'grid') {
    const { ri, ci, cols, rows } = explicitAreas.implicitGrid
    const { row, col } = area.grid
    if (ri > 1 || rows - ri >= row.sizes.length) {
      if (row.auto.length === 0) {
        row.auto.push('1fr')
      }
    }
    if (ci > 1 || cols - ci >= col.sizes.length) {
      if (col.auto.length === 0) {
        col.auto.push('1fr')
      }
    }
  }
})

let implicitGrid = $computed(() => explicitAreas.implicitGrid)

let toolbarStart = $computed(() => {
  const gridRegion = getGridRegion(area)
  return gridRegion ? (gridRegion.col.start === 1 && gridRegion.row.start === 1 ? getAreaDepth(area) - 1 : 0) : 0
})

let gridCells = $computed(() => {
  if (!area.grid) {
    return []
  }
  const { cols, rows, ri, ci } = implicitGrid
  const sections = []
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      sections.push(createSection({ col: c + ci, row: r + ri }))
    }
  }
  return sections
})

let gridRegions = $computed(() => explicitAreas.gridAreas.map(explicitGridAreaToGridRegion))

function onOverCell({ row, col }) {
  const { children } = area
  for (let i = children.length - 1; i >= 0; i--) {
    const r = gridRegions[i]
    if (r.row.start <= row && r.row.end > row && r.col.start <= col && r.col.end > col) {
      overArea = children[i]
      return
    }
  }
  overArea = area
}

function isFocused(section) {
  const c = currentHover
  return c && c.on === 'cell' && c.grid === grid && c.row === section.row.start && c.col === section.col.start
}

function tracksFor(type) {
  const { grid } = area
  const { rows, cols, ri, ci } = implicitGrid
  const size = type === 'row' ? rows : cols
  const cell_i = type === 'row' ? ri : ci
  const tracks = []
  if (grid) {
    for (let i = cell_i; i < size + cell_i; i++) {
      tracks.push({
        type,
        pos: i,
      })
    }
  }
  return tracks
}
let gridTracks = $computed(() => {
  return [...tracksFor('row'), ...tracksFor('col')]
})
</script>

<style scoped lang="postcss">
.area-editor {
  position: relative;
  pointer-events: none;
  touch-action: none;

  &:not(.dragging) {
    cursor: pointer;
  }
  background: rgba(var(--color-white-rgb), 0.7);
  /*
  &.grayed {
    background: var(--color-gray-light);
  }
  */
  &:before {
    display: none;
  }
}

.area-info {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.area-info-controls {
  position: absolute;
  top: 3px;
  left: 3px;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
}

.area-actions {
  position: absolute;
  right: 0;
}

.area-name {
  pointer-events: initial;
  font-size: 13px;
  text-shadow: none;
  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
  direction: ltr;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  color: var(--color-white);
  padding: 0 8px;
  margin-right: 3px;
  margin-bottom: 3px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: max-content;
  min-width: 30px;
  position: relative;
  border-radius: 2px;
  &.implicit:after {
    content: ' [auto]';
    font-size: 12px;
    opacity: 0.7;
  }

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
}

.padding-box {
  width: 100%;
  height: 100%;
  outline: 1px dashed var(--color-gray);
  background: var(--color-white);
}
</style>
