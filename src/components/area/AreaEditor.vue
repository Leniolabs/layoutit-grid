<template>
  <component
    :is="areaType"
    :ref="(el) => (componentInstance = el)"
    :class="['area-editor', { grayed: !isActive }]"
    :style="{
      position: 'relative',
      'pointer-events': 'none',
      'touch-action': 'none',
      'grid-area': gridArea || (area.gridRegion && getGridArea(area)),
      border: area !== mainArea ? `2px solid ${area.color}` : 'none',
      'justify-self': area.justifySelf,
      'align-self': area.alignSelf,
      'flex-grow': area.flexGrow,
      'flex-shrink': area.flexShrink,
      'flex-basis': area.flexBasis,
      width: area.width,
      height: area.height,
      overflow: 'hidden',
      'touch-action': 'none',
      position: 'relative',
      background:
        area.display === 'block'
          ? '#ffffff88'
          : 'repeating-linear-gradient(45deg, white, white 9px, #f5f5f5 9px, #f5f5f5 14px)',
      'user-select': 'none',
      'z-index': 0,
      ...displayStyles,
    }"
    :area="area"
  >
    <AreaEditor
      v-for="(a, i) in area.children"
      :key="`area-${a.name}`"
      :area="a"
      :grid-area="gridAreas[i]"
      @edit="$refs.selection.editArea(a)"
    />
    <!--
    <div
      v-if="area.type === 'component'"
      style="
        width: 100%;
        height: 100%;
        opacity: 0.5;
        padding: 20px;
        display: grid;
        justify-items: center;
        align-items: center;
      "
    >
      <PieChart />
    </div>

    <div
      v-if="area.type === 'button'"
      style="
        width: 100%;
        height: 100%;
        opacity: 0.5;
        padding: 20px;
        display: grid;
        justify-items: center;
        align-items: center;
      "
    >
      <button
        style="border: none; padding: 10px; border-radius: 5px; font-size: 16px; font-weight: 700; background: #aaa"
      >
        {{ area.text }}
      </button>
    </div>
    -->
    <GridEditor
      v-if="area.display === 'grid'"
      :area="area"
      :computed-styles="computedStyles"
      :computed-gap="computedGap"
      :implicit-grid="implicitGrid"
    />
    <FlexEditor v-if="area.display === 'flex'" :area="area" />

    <AreaBox v-for="(a, i) in area.children" :key="`area-info-${a.name}`" :area="a" :grid-area="gridAreas[i]" />

    <p v-if="area != mainArea" :style="{ backgroundColor: area.color }" class="area-name">{{ area.name }}</p>
  </component>
</template>

<script setup="props">
export { default as AreaBox } from './AreaBox.vue'
export { default as PieChart } from '../content/PieChart.vue'
export { default as ElementImage } from './ElementImage.vue'
export { default as ElementParagraph } from './ElementParagraph.vue'
// GridEditor imported globally due to circular reference with AreaEditor
// export { default as FlexEditor } from '../flex/FlexEditor.vue'

import { ref, computed, watch, nextTick, defineAsyncComponent, toRefs } from 'vue'
import { mainArea, currentArea, setCurrentArea, parseUnit, parseValueUnit } from '../../store.js'
import { useIsActiveArea } from '../../composables/area.js'

export { mainArea }

export { getGridArea } from '../../utils.js'

export default {
  name: 'AreaEditor',
  props: {
    area: { type: Object, required: true },
    item: { type: Number, default: 1 },
    gridArea: { type: String, default: undefined },
  },
  emits: ['edit'],
}

const { area } = toRefs(props)
export const isActive = useIsActiveArea(area)

export const areaType = computed(() => {
  switch (props.area.type) {
    case 'image':
      return ElementImage
    case 'p':
      return ElementParagraph
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

function gridStyles(grid) {
  return {
    display: 'grid',
    gridTemplateRows: gridSizesForView(grid, 'row'),
    gridTemplateColumns: gridSizesForView(grid, 'col'),
    gridAutoRows: grid.row.auto,
    gridAutoColumns: grid.col.auto,
    gridGap: `${grid.row.gap} ${grid.col.gap}`,
    justifyContent: grid.justifyContent,
    alignContent: grid.alignContent,
    justifyItems: grid.justifyItems,
    alignItems: grid.alignItems,
  }
}

function flexStyles(flex) {
  return {
    display: 'flex',
  }
}

export const displayStyles = computed(() => {
  switch (props.area.display) {
    case 'grid':
      return gridStyles(props.area.grid)
    case 'flex':
      return flexStyles(props.area.flex)
    default:
      return {}
  }
})

export const grid = computed(() => props.area.grid)
export const componentInstance = ref(null)
export const computedStyles = ref(null)
export const computedGap = ref({ col: '0px', row: '0px' })
watch(
  grid,
  () => {
    nextTick(() => {
      if (grid.value) {
        computedStyles.value = window.getComputedStyle(componentInstance.value)
        const colGap = parseValueUnit(grid.value.col.gap)
        const rowGap = parseValueUnit(grid.value.row.gap)
        computedGap.value = {
          col:
            colGap.unit === '%'
              ? (parseValue(computedStyles.value.width) / 100) * colGap.value + 'px'
              : computedStyles.value.columnGap,
          row:
            rowGap.unit === '%'
              ? (parseValue(computedStyles.value.height) / 100) * rowGap.value + 'px'
              : computedStyles.value.rowGap,
        }
      } else {
        computedStyles.value = null
        computedGap.value = { col: '0px', row: '0px' }
      }
    })
  },
  { immediate: true, deep: true, flush: 'post' }
)

function findImplicitGrid(area) {
  const children = area.children
  const grid = area.grid
  let gridAreas, rows, cols
  if (area.display === 'grid' && grid) {
    rows = grid.row.sizes.length
    cols = grid.col.sizes.length
    const pg = new Array(rows)
    for (let r = 0; r < rows; r++) {
      pg[r] = new Array(cols).fill(false)
    }
    children.forEach(({ gridRegion }) => {
      if (gridRegion) {
        const { row, col } = gridRegion
        for (let r = row.start; r < row.end; ++r) {
          for (let c = col.start; c < col.end; ++c) {
            pg[r - 1][c - 1] = true
          }
        }
      }
    })
    gridAreas = children.map(({ gridRegion }) => {
      if (gridRegion) {
        return getGridArea(area)
      } else {
        if (grid.autoFlow === 'row' || grid.autoFlow === 'row dense') {
          // TODO: take into account grid-area span
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              if (!pg[r][c]) {
                pg[r][c] = true
                return `${r + 1} / ${c + 1} / ${r + 2} / ${c + 2}`
              }
            }
          }
          rows++
          pg.push(new Array(cols).fill(false))
          pg[rows - 1][0] = true
          return `${rows} / 1 / ${rows + 1} / 2`
        } else {
          for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
              if (!pg[r][c]) {
                pg[r][c] = true
                return `${r + 1} / ${c + 1} / ${r + 2} / ${c + 2}`
              }
            }
          }
          cols++
          for (let r = 0; r < rows; r++) {
            pg[r].push(false)
          }
          pg.push(new Array(cols).fill(false))
          pg[0][cols - 1] = true
          return `1 / ${cols} / 2 / ${cols + 1}`
        }
      }
    })
  } else {
    gridAreas = children.map(() => undefined)
    rows = cols = 1
  }
  return { gridAreas, implicitGrid: { cols, rows } }
}

export const gridAreas = ref([])
export const implicitGrid = ref({ rows: 0, cols: 0 })
watch(
  props.area,
  () => {
    const g = findImplicitGrid(props.area)
    gridAreas.value = g.gridAreas
    implicitGrid.value = g.implicitGrid
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.area-editor {
  position: relative;
  pointer-events: none;
  touch-action: none;
  height: 100%;
  cursor: pointer;
  /*
  background: rgba(255, 255, 255, 0.7);
  &.grayed {
    background: #dddddd;
  }
  */
  &:before {
    display: none;
  }
}

.area-name {
  position: absolute;
  bottom: -14px;
  right: 0;
  padding: 5px 7px 5px 10px;
  font-size: 13px;
  font-weight: 500;
  color: white;
  border-top-left-radius: 6px;
}
</style>
