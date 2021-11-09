<template>
  <section
    class="area-box"
    :style="{
      position: 'relative',
      'pointer-events': 'none',
      'touch-action': 'none',
      'grid-area': gridarea || area.gridArea,
      border: `2px solid ${areaDisplayColor(area)}`,
      opacity: 0.3,
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

<script setup lang="ts">
import { getAreaDepth, areaDisplayColor } from '../../store.js'
import { useIsMainArea } from '../../composables/area.js'

const { area, gridarea } = defineProps<{
  area
  gridarea?: string
}>()

defineEmits(['edit'])

/*
const { area } = toRefs(props)
const isMain = useIsMainArea(area)

const toolbarStart = computed(() => {
  const { gridRegion } = props.area
  return gridRegion ? (gridRegion.col.start === 1 && gridRegion.row.start === 1 ? getAreaDepth(props.area) - 1 : 0) : 0
})
*/
</script>
