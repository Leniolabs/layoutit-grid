<template>
  <component
    :is="areaType"
    :ref="(el) => (componentInstance = el)"
    :class="['area-editor', { grayed: !isActive }]"
    :style="{
      position: 'relative',
      'pointer-events': 'none',
      'touch-action': 'none',
      ...gridAreaStyles(area, gridArea),
      overflow: 'hidden',
      'touch-action': 'none',
      position: 'relative',
      outline: area === currentArea ? `2px solid ${area.color}` : 'none',
      background:
        area.display === 'block' && area.parent
          ? '#ffffff88'
          : 'repeating-linear-gradient(45deg, white, white 9px, #fafafa 9px, #fafafa 14px)',
      'user-select': 'none',
      'z-index': 0,
      ...displayStyles,
    }"
    :area="area"
  >
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
    -->
    <GridEditor
      v-if="area.display === 'grid'"
      :area="area"
      :computed-styles="computedStyles"
      :computed-gap="computedGap"
      :implicit-grid="implicitGrid"
    />

    <AreaEditor
      v-for="(a, i) in area.children"
      :key="`area-${a.name}`"
      :area="a"
      :grid-area="gridAreas[i]"
      @edit="$refs.selection.editArea(a)"
    />
    <!-- Add back when there is special markup for flex 
    <FlexEditor v-if="area.display === 'flex'" :area="area" />
    -->
    <template v-if="area.display === 'grid'">
      <template v-for="(a, i) in area.children" :key="`area-info-${a.name}`">
        <AreaBox :area="a" :grid-area="gridAreas[i]" />
      </template>
    </template>
    <div v-if="area != mainArea" class="area-info" :style="{ border: `2px solid ${area.color}` }">
      <p :style="{ backgroundColor: area.color }" class="area-name" @click="currentArea = area">{{ area.name }}</p>
    </div>
  </component>
</template>

<script setup>
import AreaBox from './AreaBox.vue'
import PieChart from '../content/PieChart.vue'
import ElementImage from './ElementImage.vue'
import ElementParagraph from './ElementParagraph.vue'
import ElementButton from './ElementButton.vue'
// GridEditor imported globally due to circular reference with AreaEditor
// import FlexEditor from '../flex/FlexEditor.vue'

import { ref, computed, watch, nextTick, defineAsyncComponent, toRefs, defineProps, defineEmit } from 'vue'
import {
  mainArea,
  currentArea,
  setCurrentArea,
  parseUnit,
  parseValue,
  parseValueUnit,
  getGridArea,
  getGridRegion,
  gridAreaToGridLimits,
  findImplicitGrid,
} from '../../store.js'
import { useIsActiveArea } from '../../composables/area.js'

// name: 'AreaEditor',

const props = defineProps({
  area: { type: Object, required: true },
  item: { type: Number, default: 1 },
  gridArea: { type: String, default: undefined },
})

defineEmit(['edit'])

const { area } = toRefs(props)
const isActive = useIsActiveArea(area)

const areaType = computed(() => {
  switch (props.area.type) {
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
    width: area.width,
    height: area.parent && area.parent.display === 'block' && area.height === 'initial' ? '100px' : area.height,
  }
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

const displayStyles = computed(() => {
  switch (props.area.display) {
    case 'grid':
      return gridStyles(props.area.grid)
    case 'flex':
      return flexStyles(props.area.flex)
    default:
      return {}
  }
})

const grid = computed(() => props.area.grid)
const componentInstance = ref(null)
const computedStyles = ref(null)
const computedGap = ref({ col: '0px', row: '0px' })
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

const gridAreas = ref([])
const implicitGrid = ref({ rows: 0, cols: 0 })
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

.area-info {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.area-name {
  position: absolute;
  pointer-events: initial;
  font-size: 13px;
  font-weight: 500;
  color: white;
  /*
  bottom: -14px;
  right: 0;
  border-top-left-radius: 6px;
  padding: 5px 7px 5px 10px;
  */
  top: 0;
  left: 0;
  border-bottom-right-radius: 6px;
  padding: 3px 10px 6px 7px;
}
</style>
