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
import { useIsCurrentArea } from '../../composables/area.js'
import { asValidGridArea } from '../../utils/grid.js'

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
    ? asValidGridArea(pos, implicitGrid.ci, pos + 1, implicitGrid.cols + implicitGrid.ci, props.implicitGrid)
    : asValidGridArea(implicitGrid.ri, pos, implicitGrid.rows + implicitGrid.ri, pos + 1, props.implicitGrid)
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
