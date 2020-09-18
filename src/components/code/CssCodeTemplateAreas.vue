<template>
  <span class="token string">{{ templateAreas }}</span>
</template>

<script setup="props, { emit }">
import { dragging, currentArea, isValidAreaName } from '../../store.js'
import { computed } from 'vue'
import { gridTemplateAreas } from '../../utils.js'
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
