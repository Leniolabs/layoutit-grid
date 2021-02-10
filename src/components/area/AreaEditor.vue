<template>
  <component
    :is="areaType"
    :ref="(el) => (componentInstance = el)"
    :class="['area-editor', { grayed: !isActive }]"
    :style="{
      position: 'relative',
      'pointer-events': 'none',
      'touch-action': 'none',
      ...gridAreaStyles(area, gridarea),
      overflow: 'hidden',
      'touch-action': 'none',
      position: 'relative',
      outline: area === currentArea ? `2px solid ${areaDisplayColor(area)}` : 'none',
      background:
        area.display === 'block' && area.parent
          ? '#ffffff'
          : 'repeating-linear-gradient(45deg, white, white 9px, #fafafa 9px, #fafafa 14px)',
      'user-select': 'none',
      'z-index': 0,
      // Force a minimum width and height so areas are still visible when the
      // user changes items placement or there are in implicit tracks
      ...(area.width === 'initial' && { 'min-width': 'max(24px,50%)' }),
      ...(area.height === 'initial' && { 'min-height': 'max(24px,50%)' }),
      ...displayStyles,
    }"
    :area="area"
  >
    <GridEditor
      v-if="area.display === 'grid'"
      :area="area"
      :computed-styles="computedStyles"
      :computed-gap="computedGap"
      :implicit-grid="explicitAreas.implicitGrid"
      @celldown="(event) => selectionEl.cellDown(event)"
    />

    <AreaEditor
      v-for="(a, i) in areasToShow"
      :key="`area-${a.name}`"
      :area="a"
      :gridarea="explicitAreas.gridAreas[i]"
      @edit="onEditArea(a)"
    />
    <!-- Add back when there is special markup for flex 
    <FlexEditor v-if="area.display === 'flex'" :area="area" />
    -->
    <template v-if="area.display === 'grid'">
      <template v-for="(a, i) in areasToShow" :key="`area-info-${a.name}`">
        <AreaBox :area="a" :gridarea="explicitAreas.gridAreas[i]" />
      </template>
    </template>
    <div v-if="area != mainArea" class="area-info" :style="{ border: `2px solid ${areaDisplayColor(area)}` }" />
    <div v-if="area != mainArea" class="area-info" :style="{ top: toolbarStart * 28 + 'px' }">
      <div
        :style="{ backgroundColor: area.color }"
        class="area-name"
        @click="currentArea = area"
        @mouseover="overArea = area"
      >
        {{ area.name }}
      </div>
      <AreaButtons :area="area" @edit="$emit('edit')" />
    </div>
    <div v-if="area.display === 'block' && area.padding !== '0'" class="padding-box"></div>

    <AreaSelection v-if="area.display === 'grid'" ref="selectionEl" :area="area" @editend="editingArea = null" />
  </component>
</template>

<script setup>
import AreaBox from './AreaBox.vue'
import AreaButtons from './AreaButtons.vue'
import PieChart from '../content/PieChart.vue'
import ElementImage from './ElementImage.vue'
import ElementParagraph from './ElementParagraph.vue'
import ElementButton from './ElementButton.vue'
import AreaSelection from './AreaSelection.vue'
// GridEditor imported globally due to circular reference with AreaEditor
// import FlexEditor from '../flex/FlexEditor.vue'

import { ref, computed, watch, nextTick, defineAsyncComponent, toRefs, defineProps, defineEmit } from 'vue'
import {
  mainArea,
  currentArea,
  overArea,
  setCurrentArea,
  parseUnit,
  parseValue,
  parseValueUnit,
  getGridArea,
  getGridRegion,
  getAreaDepth,
  areaDisplayColor,
  gridAreaToGridLimits,
} from '../../store.js'
import { findImplicitGrid } from '../../utils/grid.js'
import { useIsActiveArea } from '../../composables/area.js'

// name: 'AreaEditor',

const props = defineProps({
  area: { type: Object, required: true },
  item: { type: Number, default: 1 },
  gridarea: { type: String, default: undefined },
})

defineEmit(['edit'])

const { area } = toRefs(props)
const isActive = useIsActiveArea(area)

const editingArea = ref(null)
const areasToShow = computed(() => {
  return props.area.children.filter((a) => a !== editingArea.value)
  /*.flatMap((a) =>
      a.items
        ? new Array(a.items.count).fill(0).map((_, i) => {
            return { area: a, item: i + 1 }
          })
        : { area: a, item: 1 }
    )*/
})

const selectionEl = ref(null)
function onEditArea(area) {
  editingArea.value = area
  selectionEl.value.editArea(area)
}

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

const displayStyles = computed(() => {
  switch (props.area.display) {
    case 'grid':
      return props.area.grid ? gridStyles(props.area.grid) : {}
    case 'flex':
      return props.area.flex ? flexStyles(props.area.flex) : {}
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

const explicitAreas = computed(() => {
  if (props.area.display === 'grid') {
    return findImplicitGrid(props.area)
  } else {
    return { gridAreas: [], implicitGrid: {} }
  }
})

const toolbarStart = computed(() => {
  const gridRegion = getGridRegion(props.area)
  return gridRegion ? (gridRegion.col.start === 1 && gridRegion.row.start === 1 ? getAreaDepth(props.area) - 1 : 0) : 0
})
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
  padding: 2px;
  display: flex;
  align-items: flex-start;
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
  color: #fff;
  padding: 0 8px;
  height: 28px;
  display: flex;
  align-items: center;
  max-width: max-content;
  &:first-child:last-child {
    border-bottom-right-radius: 2px;
  }
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.15);
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
  outline: 1px dashed #bbb;
  background: white;
}
</style>
