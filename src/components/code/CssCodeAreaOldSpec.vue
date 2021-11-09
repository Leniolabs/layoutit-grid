<template>
  <span class="token selector">.{{ cssAreaName }}</span
  ><span> {</span>{{ '\n  '
  }}<template v-if="area.grid"
    ><span class="token property">display</span>: <span class="token string">-ms-grid</span>;{{ '\n  '
    }}<span class="token property">-ms-grid-columns</span>:
    <span class="token string">{{ namedTemplateColumns(area.grid, options.repeat) }}</span
    >;{{ '\n  ' }}<span class="token property">-ms-grid-rows</span>:
    <span class="token string">{{ namedTemplateRows(area.grid, options.repeat) }}</span
    >;{{ '\n  ' }}<span class="token property">gap</span>:
    <span class="token string">{{ area.grid.row.gap + ' ' + area.grid.col.gap }}</span
    >;</template
  ><template v-if="gridRegion"
    ><span class="token property">-ms-grid-row</span>: <span class="token string">{{ gridRegion.row.start }}</span
    >;{{ '\n  ' }}<span class="token property">-ms-grid-row-span</span>:
    <span class="token string">{{ gridRegion.row.end - gridRegion.row.start }}</span
    >;{{ '\n  ' }}<span class="token property">-ms-grid-column</span>:
    <span class="token string">{{ gridRegion.col.start }}</span
    >;{{ '\n  ' }}<span class="token property">-ms-grid-column-span</span>:
    <span class="token string">{{ gridRegion.col.end - gridRegion.row.start }}</span
    >;</template
  >{{ '\n}'
  }}<template v-for="a in gridAreas" :key="a.id"
    >{{ '\n\n' }}<CssCodeAreaOldSpec :area="a" :options="options"
  /></template>
</template>

<script setup lang="ts">
import { getGridRegion } from '../../store.js'
import { namedTemplateColumns, namedTemplateRows, toCssName } from '../../utils.js'

const { area, options } = defineProps<{ area; options }>()

let cssAreaName = $computed(() => toCssName(area.name))

let gridAreas = $computed(() => (area.display === 'grid' ? area.children : []))

// TODO:
let gridRegion = $computed(() => getGridRegion(area))
</script>

<style scoped lang="postcss"></style>
