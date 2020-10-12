<template>
  <div
    v-if="!isMain"
    :style="{ top: 5 + toolbarStart * 32 + 'px', left: toolbarStart ? toolbarStart * 20 + 'px' : '5px' }"
    class="area-info"
  >
    <AreaName :area="area" @edit="$emit('edit')" />
    <AreaButtons :area="area" />
  </div>
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
  },
  emits: ['edit'],
}

const { area } = toRefs(props)
export const isMain = useIsMainArea(area)

export const toolbarStart = computed(() => {
  const { gridRegion } = props.area
  return gridRegion ? (gridRegion.col.start === 1 && gridRegion.row.start === 1 ? getAreaDepth(props.area) - 1 : 0) : 0
})
</script>

<style scoped lang="scss">
.area-info {
  position: absolute;
  top: 5px;
  left: 5px;
  width: auto;
  z-index: 999;
  &:after {
    display: table;
    content: '';
    clear: both;
  }
}
</style>
