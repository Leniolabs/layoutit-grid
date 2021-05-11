<template>
  <section
    :class="['grid-track-size', type]"
    :style="{
      gridArea,
    }"
  >
    <TrackSize v-if="isCurrent" :grid="grid" :type="type" :track="pos" />
  </section>
</template>

<script setup>
import TrackSize from './TrackSize.vue'
import { useIsCurrentArea, useGridDimensions } from '../../composables/area.js'
import { defineProps, computed, toRefs } from 'vue'

const props = defineProps({
  type: { type: String, required: true },
  pos: { type: Number, required: true },
  area: { type: Object, required: true },
  implicitGrid: { type: Object, required: true },
})
const grid = computed(() => props.area.grid)

const isCurrent = useIsCurrentArea(toRefs(props).area)

const gridArea = computed(() => {
  const { pos, implicitGrid } = props
  return props.type === 'row'
    ? `${pos} / ${2 - implicitGrid.ci} / ${pos + 1} / ${implicitGrid.cols + 2 - implicitGrid.ci}`
    : `${2 - implicitGrid.ri} / ${pos} / ${implicitGrid.rows + 2 - implicitGrid.ri} / ${pos + 1}`
})
</script>

<style scoped lang="postcss">
section {
  touch-action: none;
  pointer-events: none;
  height: 100%;
  position: relative;
  overflow: hidden;
}
</style>
