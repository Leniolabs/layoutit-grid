<template>
  <section
    class="area-box"
    :style="{
      position: 'relative',
      'pointer-events': 'none',
      'touch-action': 'none',
      'grid-area': area.gridArea,
      'border-color': area.color,
      'flex-grow': area.flexGrow,
      'flex-shrink': area.flexShrink,
      'flex-basis': area.flexBasis,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
    }"
  >
    <div
      v-if="!isMain"
      :style="{ top: 5 + toolbarStart * 32 + 'px', left: toolbarStart ? toolbarStart * 20 + 'px' : '5px' }"
      class="area-info"
    >
      <AreaName :area="area" @edit="$emit('edit')" />
      <AreaButtons :area="area" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { getAreaDepth, getGridRegion } from '../../store.js'
import { useIsMainArea } from '../../composables/area.js'

const { area } = defineProps<{ area }>()

defineEmits(['edit'])

let isMain = $(useIsMainArea(computed(() => area)))

let toolbarStart = $computed(() => {
  const gridRegion = getGridRegion(area)
  return gridRegion ? (gridRegion.col.start === 1 && gridRegion.row.start === 1 ? getAreaDepth(area) - 1 : 0) : 0
})
</script>

<style scoped lang="postcss">
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
</style>
