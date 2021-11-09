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

<script setup lang="ts">
import { useIsCurrentArea } from '../../composables/area.js'
import { asValidGridArea } from '../../utils/grid.js'

const { type, pos, area, implicitGrid } = defineProps<{
  type: string
  pos: number
  area
  implicitGrid
}>()

let grid = $computed(() => area.grid)

let isCurrent = $(useIsCurrentArea(computed(() => area)))

let gridArea = $computed(() => {
  return type === 'row'
    ? asValidGridArea(pos, implicitGrid.ci, pos + 1, implicitGrid.cols + implicitGrid.ci, implicitGrid)
    : asValidGridArea(implicitGrid.ri, pos, implicitGrid.rows + implicitGrid.ri, pos + 1, implicitGrid)
})
</script>

<style scoped lang="postcss">
.grid-track-size {
  touch-action: none;
  pointer-events: none;
  height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  pointer-events: none;
  &.col {
    align-items: flex-end;
    justify-content: center;
  }
}
</style>
