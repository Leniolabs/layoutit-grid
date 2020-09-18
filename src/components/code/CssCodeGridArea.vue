<template>
  <span class="token string">{{ gridArea }};</span>
</template>

<script setup="props, { emit }">
import { dragging, currentArea, isValidAreaName } from '../../store.js'
import { computed } from 'vue'
import { getGridArea, gridTemplateAreas } from '../../utils.js'
import { prefixedName } from '../../generateCode.js'

export default {
  props: {
    area: { type: Object, required: true },
    options: { type: Object, required: true },
  },
}

export { currentArea }

export const prefix = computed(() => (props.options.prefix ? props.options.prefixName : undefined))

export const cssAreaName = computed(() => prefixedName(props.area.name, prefix.value))

function getGridTemplateAreas(grid) {
  return grid ? gridTemplateAreas(grid, prefix.value, '\n    ') : undefined
}

export const templateAreas = computed(() => getGridTemplateAreas(props.area.grid))

export const includeTemplateAreas = computed(() => props.options.templateAreas && templateAreas.value !== undefined)

export const gridArea = computed(() => {
  const { parent } = props.area

  if (parent) {
    return props.options.templateAreas && getGridTemplateAreas(parent.grid)
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
