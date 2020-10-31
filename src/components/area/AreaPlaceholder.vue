<template>
  <section
    :class="['area-editor', { grayed: !isActive }]"
    :style="{
      position: 'relative',
      'pointer-events': 'none',
      'touch-action': 'none',
      'grid-area': area.gridRegion && getGridArea(area),
      'border-color': area.color,
      'justify-self': area.justifySelf,
      'align-self': area.alignSelf,
      'flex-grow': area.flexGrow,
      'flex-shrink': area.flexShrink,
      'flex-basis': area.flexBasis,
      width: area.width,
      height: area.height,
      overflow: 'hidden',
    }"
  >
    <ElementPreview :area="area" />

    <GridEditor v-if="area.display === 'grid'" :area="area" />
    <FlexEditor v-if="area.display === 'flex'" :area="area" />

    <template v-if="area.display === 'block'">
      <AreaEditor v-for="(a, i) in area.children" :key="`area-${i}`" :area="a" />
    </template>
  </section>
</template>

<script setup="props">
export { default as AreaInfo } from './AreaInfo.vue'
export { default as PieChart } from '../content/PieChart.vue'
export { default as ElementPreview } from './ElementPreview.vue'
// GridEditor imported globally due to circular reference with AreaEditor
// export { default as FlexEditor } from '../flex/FlexEditor.vue'

import { computed, defineAsyncComponent, toRefs } from 'vue'
import { mainArea, currentArea, setCurrentArea } from '../../store.js'
import { useIsActiveArea } from '../../composables/area.js'

export { getGridArea } from '../../utils.js'

export default {
  name: 'AreaEditor',
  props: {
    area: { type: Object, required: true },
    item: { type: Number, default: 1 },
  },
  emits: ['edit'],
}

const { area } = toRefs(props)
export const isActive = useIsActiveArea(area)
</script>

<style scoped lang="scss">
.area-editor {
  position: relative;
  pointer-events: none;
  touch-action: none;
  height: 100%;
  cursor: pointer;
  border: 2px solid;
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
</style>
