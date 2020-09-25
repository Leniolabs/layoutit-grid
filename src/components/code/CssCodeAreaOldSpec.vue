<!-- prettier-ignore -->
<template><span class="token selector">.{{ cssAreaName }}</span><span> {</span>{{ '\n  '
}}<template v-if="area.grid"><span class="token property">display</span>: <span class="token string">-ms-grid</span>;{{ '\n  ' 
}}<span class="token property">-ms-grid-columns</span>: <span class="token string">{{ namedTemplateColumns(area.grid, options.repeat) }}</span>;{{ '\n  ' 
}}<span class="token property">-ms-grid-rows</span>: <span class="token string">{{ namedTemplateRows(area.grid, options.repeat) }}</span>;{{ '\n  ' 
}}<span class="token property">gap</span>: <span class="token string">{{ area.grid.row.gap + ' ' + area.grid.col.gap }}</span>;</template><template
v-if="area.gridRegion"><span class="token property">-ms-grid-row</span>: <span class="token string">{{ area.gridRegion.row.start }}</span>;{{ '\n  ' 
}}<span class="token property">-ms-grid-row-span</span>: <span class="token string">{{ area.gridRegion.row.end - area.gridRegion.row.start }}</span>;{{ '\n  ' 
}}<span class="token property">-ms-grid-column</span>: <span class="token string">{{ area.gridRegion.col.start }}</span>;{{ '\n  ' 
}}<span class="token property">-ms-grid-column-span</span>: <span class="token string">{{ area.gridRegion.col.end - area.gridRegion.row.start }}</span>;</template>{{ '\n}' 
}}<template v-for="a in gridAreas" :key="a.name">{{ '\n\n' }}<CssCodeAreaOldSpec :area="a" :options="options" /></template>
</template>

<script setup="props">
import { computed } from 'vue'
export { namedTemplateColumns, namedTemplateRows, toCssName } from '../../utils.js'

export default {
  name: 'CssCodeAreaOldSpec',
  props: {
    area: { type: Object, default: null },
    options: { type: Object, default: null },
  },
}

export const cssAreaName = computed(() => toCssName(props.area.name))

export const gridAreas = computed(() => (props.area.grid ? props.area.grid.areas : []))
</script>

<style scoped lang="scss"></style>
