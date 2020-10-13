<template>
  <span class="token string"
    ><template v-for="(row, r) in templateAreas" :key="r"
      >{{ '"'
      }}<span
        v-for="(cell, c) in row"
        :key="r + ' ' + c"
        class="token string"
        @mouseover="currentHover = { on: 'cell', grid: area.grid, col: c + 1, row: r + 1 }"
        @mouseleave="currentHover = null"
        >{{ (c > 0 ? ' ' : '') + cell }}</span
      >{{ r === templateAreas.length - 1 ? '"' : '"\n    ' }}</template
    ></span
  >
</template>

<script setup="props, { emit }">
import { dragging, currentArea, isValidAreaName } from '../../store.js'
import { computed } from 'vue'
import { gridTemplateAreasMatrix } from '../../utils.js'
export { currentHover } from '../../store.js'

export default {
  props: {
    area: { type: Object, required: true },
    options: { type: Object, required: true },
  },
}

export { currentArea }

function getGridTemplateAreas(grid) {
  return grid ? gridTemplateAreasMatrix(grid) : []
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
