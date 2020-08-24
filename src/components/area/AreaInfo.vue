<template>
  <div
    v-if="!isMain"
    :style="{ top: 5 + toolbarStart * 32 + 'px', left: toolbarStart ? toolbarStart * 20 + 'px' : '5px' }"
    class="area-info"
  >
    <area-name :area="area" />
    <area-buttons :area="area" />
  </div>
</template>

<script setup="props">
import AreaName from './AreaName.vue'
import AreaButtons from './AreaButtons.vue'

import { computed } from 'vue'
import { mainArea, getAreaDepth } from '../../store.js'

export default {
  components: {
    AreaName,
    AreaButtons,
  },
  props: {
    area: { type: Object, required: true },
  },
}

export const isMain = computed(() => props.area === mainArea.value)

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
  z-index: 9;
  &:after {
    display: table;
    content: '';
    clear: both;
  }
}
</style>
