<template>
  <span class="token selector">.<CssCodeAreaName :area="area" /></span><span> {</span>{{ area.grid ? '\n  ' : ' '
  }}<template v-if="area.grid"
    ><span class="token property">display</span>: <span class="token string">grid</span>;{{ '\n  '
    }}<span class="token property">grid-template-columns</span>:
    <CssCodeTemplateTracks :grid="area.grid" type="col" :repeat="options.repeat" />;{{ '\n  '
    }}<span class="token property">grid-template-rows</span>:
    <CssCodeTemplateTracks :grid="area.grid" type="row" :repeat="options.repeat" />;{{ '\n  '
    }}<span class="token property">gap</span>:
    <span class="token string"
      ><CssCodeGap :grid="area.grid" type="row" /> <CssCodeGap :grid="area.grid" type="col" /></span
    >;</template
  ><span v-if="includeTemplateAreas"
    >{{ '\n  ' }}<span class="token property">grid-template-areas</span>:{{ '\n    '
    }}<CssCodeTemplateAreas :area="area" :options="options" />;</span
  ><template v-if="gridArea"
    >{{ area.grid ? '\n  ' : '' }}<span class="token property">grid-area</span>:
    <CssCodeGridArea :area="area" :options="options" /></template
  >{{ (area.grid ? '\n' : ' ') + '}'
  }}<template v-for="(a, i) in gridAreas" :key="i">{{ '\n' }}<CssCodeArea :area="a" :options="options" /></template>
</template>

<script setup="props">
export { default as CssCodeTemplateTracks } from './CssCodeTemplateTracks.vue'
export { default as CssCodeAreaName } from './CssCodeAreaName.vue'
export { default as CssCodeGridArea } from './CssCodeGridArea.vue'
export { default as CssCodeTemplateAreas } from './CssCodeTemplateAreas.vue'
export { default as CssCodeGap } from './CssCodeGap.vue'

import { computed } from 'vue'
export { namedTemplateColumns, namedTemplateRows, getGridArea, gridTemplateAreas } from '../../utils.js'

export default {
  name: 'CssCodeArea',
  props: {
    area: { type: Object, required: true },
    options: { type: Object, required: true },
  },
}

export const cssAreaName = computed(() => props.area.name)

function getGridTemplateAreas(grid) {
  return grid ? gridTemplateAreas(grid, '\n    ') : undefined
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

export const gridAreas = computed(() => (props.area.grid ? props.area.grid.areas : []))
</script>

<style scoped lang="scss"></style>
