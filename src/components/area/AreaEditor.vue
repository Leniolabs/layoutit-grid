<template>
  <section
    :class="{ grayed: !isActive }"
    :style="{
      'grid-area': area.gridRegion && getGridArea(area),
      'border-color': area.color,
      width: area.width,
      height: area.height,
      justifySelf: area.justifySelf,
      alignSelf: area.alignSelf,
      overflow: 'hidden',
    }"
    class="area-editor"
    @pointerdown="handleDown($event)"
  >
    <img
      v-if="area.items"
      style="width: 100%; height: 100%; object-fit: cover"
      :src="`https://picsum.photos/seed/${area.items.type + '-' + item}/200?grayscale`"
    />

    <template v-if="!area.items">
      <GridEditor v-if="area.grid" :area="area" />

      <FlexEditor v-if="area.flex" :area="area" />

      <AreaInfo :area="area" @edit="$emit('edit')" />
    </template>
  </section>
</template>

<script setup="props">
export { default as AreaInfo } from './AreaInfo.vue'
export { default as FlexEditor } from '../flex/FlexEditor.vue'
// GridEditor imported globally due to circular reference with AreaEditor

import { computed, defineAsyncComponent, toRefs } from 'vue'
import { mainArea, currentArea, setCurrentArea } from '../../store.js'
import { useIsActiveArea } from '../../composables/area.js'

export { getGridArea } from '../../utils.js'

export default {
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
