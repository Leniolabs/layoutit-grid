<template>
  <span class="token selector">.<CssCodeAreaName :area="area" /></span><span> {</span
  ><template v-if="area.grid"
    >{{ '\n  ' }}<span class="token property">display</span>: <span class="token string">grid</span>;<template
      v-if="area.grid.autoFlow !== 'row'"
      >{{ '\n  ' }}<span class="token property">grid-auto-flow</span>:
      <span class="token string">{{ area.grid.autoFlow }}</span
      >;</template
    ><template v-if="area.grid.col.auto !== 'initial'"
      >{{ '\n  ' }}<span class="token property">grid-auto-columns</span>:
      <span class="token string">{{ area.grid.col.auto }}</span
      >;</template
    ><template v-if="area.grid.row.auto !== 'initial'"
      >{{ '\n  ' }}<span class="token property">grid-auto-rows</span>:
      <span class="token string">{{ area.grid.row.auto }}</span
      >;</template
    >{{ '\n  ' }}<span class="token property">grid-template-columns</span>:
    <CssCodeTemplateTracks :grid="area.grid" type="col" :repeat="options.repeat" />;{{ '\n  '
    }}<span class="token property">grid-template-rows</span>:
    <CssCodeTemplateTracks :grid="area.grid" type="row" :repeat="options.repeat" />;{{ '\n  '
    }}<span class="token property">gap</span>:
    <span class="token string"
      ><CssCodeGap :grid="area.grid" type="row" /> <CssCodeGap :grid="area.grid" type="col" /></span
    >;<span v-if="includeTemplateAreas"
      >{{ '\n  ' }}<span class="token property">grid-template-areas</span>:{{ '\n    '
      }}<CssCodeTemplateAreas :area="area" :options="options" />;</span
    ><template v-if="area.grid.justifyContent !== 'stretch'"
      >{{ '\n  ' }}<span class="token property">justify-content</span>:
      <span class="token string">{{ area.grid.justifyContent }}</span
      >;</template
    ><template v-if="area.grid.alignContent !== 'stretch'"
      >{{ '\n  ' }}<span class="token property">align-content</span>:
      <span class="token string">{{ area.grid.alignContent }}</span
      >;</template
    ><template v-if="area.grid.justifyItems !== 'stretch'"
      >{{ '\n  ' }}<span class="token property">justify-items</span>:
      <span class="token string">{{ area.grid.justifyItems }}</span
      >;</template
    ><template v-if="area.grid.alignItems !== 'stretch'"
      >{{ '\n  ' }}<span class="token property">align-items</span>:
      <span class="token string">{{ area.grid.alignItems }}</span
      >;</template
    ></template
  ><template v-if="area !== mainArea"
    ><template v-if="area.justifySelf !== 'stretch'"
      >{{ '\n  ' }}<span class="token property">justify-self</span>:
      <span class="token string">{{ area.justifySelf }}</span
      >;</template
    ><template v-if="area.alignSelf !== 'stretch'"
      >{{ '\n  ' }}<span class="token property">align-self</span>: <span class="token string">{{ area.alignSelf }}</span
      >;</template
    ></template
  ><template v-if="gridArea"
    >{{ singleLine ? ' ' : '\n  ' }}<span class="token property">grid-area</span>:
    <CssCodeGridArea :area="area" :options="options" />;</template
  >{{ (singleLine ? ' ' : '\n') + '}'
  }}<template v-for="(a, i) in areasToInclude" :key="i"
    >{{ '\n' }}<CssCodeArea :area="a" :options="options"
  /></template>
</template>

<script setup="props">
export { default as CssCodeTemplateTracks } from './CssCodeTemplateTracks.vue'
export { default as CssCodeAreaName } from './CssCodeAreaName.vue'
export { default as CssCodeGridArea } from './CssCodeGridArea.vue'
export { default as CssCodeTemplateAreas } from './CssCodeTemplateAreas.vue'
export { default as CssCodeGap } from './CssCodeGap.vue'

import { computed } from 'vue'
export { namedTemplateColumns, namedTemplateRows, gridTemplateAreas, getGridAreaWithNamedLines } from '../../utils.js'
export { mainArea, getGridRegion } from '../../store.js'

export default {
  name: 'CssCodeArea',
  props: {
    area: { type: Object, required: true },
    options: { type: Object, required: true },
  },
}

export const singleLine = computed(
  () => props.area.display !== 'grid' && props.area.justifySelf === 'stretch' && props.area.alignSelf === 'stretch'
)

export const cssAreaName = computed(() => props.area.name)

function getGridTemplateAreas(area) {
  return area.display === 'grid' ? gridTemplateAreas(area, '\n    ') : undefined
}

export const templateAreas = computed(() => getGridTemplateAreas(props.area))

export const includeTemplateAreas = computed(() => props.options.templateAreas && templateAreas.value !== undefined)

export const gridArea = computed(() => {
  const gridRegion = getGridRegion(props.area) // TODO: span
  if (!gridRegion) {
    return undefined
  }
  const { parent } = props.area
  if (parent) {
    return props.options.templateAreas && getGridTemplateAreas(parent)
      ? cssAreaName.value
      : getGridAreaWithNamedLines(props.area, parent.grid)
  } else {
    return getGridAreaWithNamedLines(props.area)
  }
})

export const areasToInclude = computed(() =>
  props.area.children.filter((area) => {
    return !(
      area.display !== 'grid' &&
      area.justifySelf === 'stretch' &&
      area.alignSelf === 'stretch' &&
      area.gridArea === 'auto'
    )
  })
)
</script>

<style scoped lang="scss"></style>
