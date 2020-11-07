<template>
  <span class="token string">{{ gridArea }}</span>
</template>

<script setup="props, { emit }">
import { dragging, currentArea, isValidAreaName, getGridRegion } from '../../store.js'
import { computed } from 'vue'
import { getGridAreaWithNamedLines, gridTemplateAreas, toCssName } from '../../utils.js'

export default {
  props: {
    area: { type: Object, required: true },
    options: { type: Object, required: true },
  },
}

ref: cssAreaName = computed(() => toCssName(props.area.name))

function getGridTemplateAreas(area) {
  return area.display === 'grid' ? gridTemplateAreas(area, '\n    ') : undefined
}

ref: templateAreas = computed(() => getGridTemplateAreas(props.area))

ref: includeTemplateAreas = computed(() => props.options.templateAreas && templateAreas !== undefined)

ref: gridArea = computed(() => {
  const gridRegion = getGridRegion(props.area) // TODO: span
  if (!gridRegion) {
    return undefined
  }
  const { parent } = props.area
  if (parent) {
    return props.options.templateAreas && getGridTemplateAreas(parent)
      ? cssAreaName
      : getGridAreaWithNamedLines(props.area, parent.grid)
  } else {
    return getGridAreaWithNamedLines(props.area)
  }
})
</script>

<style scoped lang="scss">
span {
  &:hover {
    color: white;
  }
  &:focus {
    color: white;
  }
}
</style>
