<template>
  <section
    :class="{ grayed: !isActive }"
    :style="{
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
    class="area-editor"
    @pointerdown="handleDown($event)"
  >
    <img
      v-if="area.type === 'image'"
      style="width: 100%; height: 100%; object-fit: cover"
      :src="`https://picsum.photos/seed/${area.items ? area.type + '-' + item : area.name}/500?grayscale`"
    />
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
      v-if="area.type === 'p'"
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
      <p style="font-size: 20px">{{ area.text }}</p>
    </div>

    <GridEditor v-if="area.display === 'grid'" :area="area" />
    <FlexEditor v-if="area.display === 'flex'" :area="area" />

    <AreaEditor v-for="(a, i) in area.children" :key="`area-${i}`" :area="a" />

    <AreaInfo v-if="!area.items" :area="area" @edit="$emit('edit')" />
  </section>
</template>

<script setup="props">
export { default as AreaInfo } from './AreaInfo.vue'
export { default as PieChart } from '../content/PieChart.vue'
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

export function handleDown(event) {
  if (!props.area.grid) {
    // TODO:
    event.stopPropagation()
    event.preventDefault()
    const parent = props.area.parent
    if (parent) {
      setCurrentArea(parent)
    }
  }
}
</script>

<style scoped lang="scss">
.area-editor {
  position: relative;
  pointer-events: none;
  touch-action: none;
  background: #fff;
  height: 100%;
  cursor: pointer;
  border: 2px solid;
  background: rgba(255, 255, 255, 0.7);
  &.grayed {
    background: #dddddd;
  }
  &:before {
    display: none;
  }
}
</style>
