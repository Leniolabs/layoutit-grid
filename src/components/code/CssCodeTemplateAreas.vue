<template>
  <span class="token string">
    <template v-for="(row, r) in templateAreas" :key="r"
      >{{ '"'
      }}<span
        v-for="(cell, c) in row"
        :key="r + ' ' + c"
        class="token string"
        :style="{
          color:
            currentArea === cell
              ? '#d7ba7d'
              : (currentHover && currentHover.on === 'cell' && currentHover.area && currentHover.area === cell) ||
                (overArea && overArea === cell)
              ? 'white'
              : undefined,
        }"
        @click="currentArea = cell"
        @mouseover="currentHover = { on: 'cell', area: cell, grid: area.grid, col: c + 1, row: r + 1 }"
        @mouseleave="currentHover = null"
        >{{ (c > 0 ? ' ' : '') + templateAreasCellName(cell) }}</span
      >{{ r === templateAreas.length - 1 ? '"' : '"\n    ' }}
    </template>
  </span>
</template>

<script setup>
import { dragging, currentArea, currentHover, overArea } from '../../store.js'
import { defineProps, computed } from 'vue'
import { gridTemplateAreasMatrix, templateAreasCellName } from '../../utils.js'

const props = defineProps({
  area: { type: Object, required: true },
  options: { type: Object, required: true },
})

function getGridTemplateAreas(area) {
  return area.display === 'grid' ? gridTemplateAreasMatrix(area) : []
}

const templateAreas = computed(() => getGridTemplateAreas(props.area))
</script>

<style scoped lang="postcss">
span {
  &:hover {
    color: white;
    cursor: crosshair;
  }
  &:focus {
    color: white;
  }
}
</style>
