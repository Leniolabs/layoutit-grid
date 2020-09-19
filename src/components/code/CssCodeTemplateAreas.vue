<template>
  <span class="token string">{{ templateAreas }}</span>
</template>

<script setup="props, { emit }">
import { dragging, currentArea, isValidAreaName } from '../../store.js'
import { computed } from 'vue'
import { gridTemplateAreas } from '../../utils.js'

export default {
  props: {
    area: { type: Object, required: true },
    options: { type: Object, required: true },
  },
}

export { currentArea }

export const cssAreaName = computed(() => props.area.name)

function getGridTemplateAreas(grid) {
  return grid ? gridTemplateAreas(grid, '\n    ') : undefined
}

export const templateAreas = computed(() => getGridTemplateAreas(props.area.grid))
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
