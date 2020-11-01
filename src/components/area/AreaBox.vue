<template>
  <section
    class="area-box"
    :style="{
      position: 'relative',
      'pointer-events': 'none',
      'touch-action': 'none',
      'grid-area': gridArea || area.gridArea,
      border: `2px solid ${area.color}`,
      opacity: 0.5,
      'flex-grow': area.flexGrow,
      'flex-shrink': area.flexShrink,
      'flex-basis': area.flexBasis,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
    }"
  >
    <!--
    <div
      v-if="!isMain"
      :style="{ top: 5 + toolbarStart * 32 + 'px', left: toolbarStart ? toolbarStart * 20 + 'px' : '5px' }"
      class="area-info"
    >
      <AreaName :area="area" @edit="$emit('edit')" />
      <AreaButtons :area="area" />
    </div>
    -->
  </section>
</template>

<script setup="props">
export { default as AreaName } from './AreaName.vue'
export { default as AreaButtons } from './AreaButtons.vue'

import { computed, toRefs } from 'vue'
import { getAreaDepth } from '../../store.js'
import { useIsMainArea } from '../../composables/area.js'

export default {
  props: {
    area: { type: Object, required: true },
    gridArea: { type: String, default: undefined },
  },
  emits: ['edit'],
}

/*
const { area } = toRefs(props)
export const isMain = useIsMainArea(area)

export const toolbarStart = computed(() => {
  const { gridRegion } = props.area
  return gridRegion ? (gridRegion.col.start === 1 && gridRegion.row.start === 1 ? getAreaDepth(props.area) - 1 : 0) : 0
})
*/
</script>

<style scoped lang="scss">
.area-box {
  // outline: 1px solid red;
}
/*
.area-info {
  position: absolute;
  top: 5px;
  left: 5px;
  width: auto;
  &:after {
    display: table;
    content: '';
    clear: both;
  }
}
*/
</style>
