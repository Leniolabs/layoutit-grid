<template>
  <span class="token string">{{ gridArea }}</span>
</template>

<script setup="props, { emit }">
import { dragging, currentArea, isValidAreaName } from '../../store.js'
import { computed } from 'vue'
import { getGridArea, gridTemplateAreas, toCssName } from '../../utils.js'

export default {
  props: {
    area: { type: Object, required: true },
    options: { type: Object, required: true },
  },
}

export { currentArea }

export const cssAreaName = computed(() => toCssName(props.area.name))

function getGridTemplateAreas(area) {
  return area.display === 'grid' ? gridTemplateAreas(area, '\n    ') : undefined
}

export const templateAreas = computed(() => getGridTemplateAreas(props.area))

export const includeTemplateAreas = computed(() => props.options.templateAreas && templateAreas.value !== undefined)

export const gridArea = computed(() => {
  const { parent } = props.area

  if (parent) {
    return props.options.templateAreas && getGridTemplateAreas(parent)
      ? cssAreaName.value
      : getGridArea(props.area, parent.grid)
  } else {
    return getGridArea(props.area)
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
