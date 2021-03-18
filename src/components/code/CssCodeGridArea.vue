<template>
  <span class="token string">{{ gridArea }}</span>
</template>

<script setup>
import { dragging, currentArea, getGridRegion } from '../../store.js'
import { defineProps, computed } from 'vue'
import { getGridAreaWithNamedLines, gridTemplateAreas, toCssName } from '../../utils.js'

const props = defineProps({
  area: { type: Object, required: true },
  options: { type: Object, required: true },
})

const cssAreaName = computed(() => toCssName(props.area.name))

function getGridTemplateAreas(area) {
  return area.display === 'grid' ? gridTemplateAreas(area, '\n    ') : undefined
}

const templateAreas = computed(() => getGridTemplateAreas(props.area))

const includeTemplateAreas = computed(() => props.options.templateAreas && templateAreas.value !== undefined)

const gridArea = computed(() => {
  const gridRegion = getGridRegion(props.area) // TODO: span
  if (!gridRegion) {
    return undefined
  }
  const { parent } = props.area
  if (parent) {
    return props.options.templateAreas && getGridTemplateAreas(parent)
      ? cssAreaName.value
      : getGridAreaWithNamedLines(props.area, parent.grid)
  } else {
    return getGridAreaWithNamedLines(props.area)
  }
})
</script>

<style scoped lang="postcss">
span {
  &:hover {
    color: white;
  }
  &:focus {
    color: white;
  }
}
</style>
