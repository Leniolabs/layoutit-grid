<template>
  <section
    :class="{ grayed: !isActive }"
    :style="{ 'grid-area': getGridArea(area), 'border-color': area.color }"
    class="area-editor"
    @pointerdown="handleDown($event)"
  >
    <AreaInfo :area="area" @edit="$emit('edit')" />

    <GridEditor v-if="area.grid" :area="area" />

    <FlexEditor v-if="area.flex" :area="area" />
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
  &.grayed {
    background: #dddddd;
  }
  &:before {
    display: none;
  }
}
</style>
