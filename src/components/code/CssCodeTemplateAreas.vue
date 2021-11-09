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
            currentArea === cell && isCellHighligthed(cell)
              ? '#e0d3b7'
              : currentArea === cell
              ? '#d7ba7d'
              : isCellHighligthed(cell)
              ? '#eee'
              : undefined,
        }"
        @click="cell && (currentArea = cell)"
        @mouseover="currentHover = { on: 'cell', area: cell, grid: area.grid, col: c + 1, row: r + 1 }"
        @mouseleave="currentHover = null"
        >{{ (c > 0 ? ' ' : '') + templateAreasCellName(cell) }}</span
      >{{ r === templateAreas.length - 1 ? '"' : '"\n    ' }}
    </template>
  </span>
</template>

<script setup lang="ts">
import { useAppState } from '../../store.js'
import { gridTemplateAreasMatrix, templateAreasCellName } from '../../utils.js'

let { dragging, currentArea, currentHover, overArea } = $(useAppState())

const { area, options } = defineProps<{ area; options }>()

function getGridTemplateAreas(area) {
  return area.display === 'grid' ? gridTemplateAreasMatrix(area) : []
}

let templateAreas = $computed(() => getGridTemplateAreas(area))

function isCellHighligthed(cell) {
  return (
    (currentHover && currentHover.on === 'cell' && currentHover.area && currentHover.area === cell) ||
    (overArea && overArea === cell)
  )
}
</script>

<style scoped lang="postcss">
span {
  &:hover {
    color: var(--color-gray-lightest);
    cursor: crosshair;
  }
  &:focus {
    color: var(--color-gray-lightest);
  }
}
</style>
