<template>
  <span class="token selector">.<CssCodeAreaName :area="area" /></span><span> {</span>
  <template v-if="area.grid">
    <CssDecl property="display">grid</CssDecl>
    <CssDecl v-if="area.grid.autoFlow !== 'row'" property="grid-auto-flow">{{ area.grid.autoFlow }}</CssDecl>
    <CssDecl v-if="area.grid.col.auto.length" property="grid-auto-columns">{{ area.grid.col.auto.join(' ') }}</CssDecl>
    <CssDecl v-if="area.grid.row.auto.length" property="grid-auto-rows">{{ area.grid.row.auto.join(' ') }}</CssDecl>
    <CssDecl v-if="area.grid.col.sizes.length" property="grid-template-columns">
      <CssCodeTemplateTracks :grid="area.grid" type="col" :repeat="options.repeat" />
    </CssDecl>
    <CssDecl v-if="area.grid.row.sizes.length" property="grid-template-rows">
      <CssCodeTemplateTracks :grid="area.grid" type="row" :repeat="options.repeat" />
    </CssDecl>
    <CssDecl property="gap">
      <CssCodeGap :grid="area.grid" type="row" /> <CssCodeGap :grid="area.grid" type="col" />
    </CssDecl>
    <CssDecl v-if="includeTemplateAreas" property="grid-template-areas">
      {{ '\n    ' }}<CssCodeTemplateAreas :area="area" :options="options" />
    </CssDecl>
    <CssDecl v-if="area.grid.justifyContent !== 'initial'" property="justify-content">{{
      area.grid.justifyContent
    }}</CssDecl>
    <CssDecl v-if="area.grid.alignContent !== 'initial'" property="align-content">{{ area.grid.alignContent }}</CssDecl>
    <CssDecl v-if="area.grid.justifyItems !== 'initial'" property="justify-items">{{ area.grid.justifyItems }}</CssDecl>
    <CssDecl v-if="area.grid.alignItems !== 'initial'" property="align-items">{{ area.grid.alignItems }}</CssDecl>
  </template>
  <template v-if="area !== mainArea">
    <CssDecl v-if="area.justifySelf !== 'initial'" property="justify-self">{{ area.justifySelf }}</CssDecl>
    <CssDecl v-if="area.alignSelf !== 'initial'" property="align-self">{{ area.alignSelf }}</CssDecl>
    <template v-if="area.gridArea !== 'auto'">
      <CssDecl property="grid-area" :ident="singleLine ? ' ' : '\n  '"
        ><CssCodeGridArea :area="area" :options="options"
      /></CssDecl>
    </template>
    <CssDecl v-if="area.margin !== '0'" property="margin">{{ area.margin }}</CssDecl>
    <CssDecl v-if="area.padding !== '0'" property="padding">{{ area.padding }}</CssDecl> </template
  ><CssDecl v-if="area.width !== 'auto'" property="width">{{ area.width }}</CssDecl>
  <CssDecl v-if="area.height !== 'auto'" property="height">{{ area.height }}</CssDecl
  >{{ (singleLine ? '' : '\n') + '}'
  }}<template v-for="(a, i) in areasToInclude" :key="`area-${a.id}-${i}`"
    >{{ '\n' }}<CssCodeArea :area="a" :options="options"
  /></template>
</template>

<script setup lang="ts">
import CssDecl from './CssCodeDeclaration.vue'

import {
  namedTemplateColumns,
  namedTemplateRows,
  gridTemplateAreas,
  getCodeGridArea,
  getCodeGridTemplateAreas,
  areaIsSingleLineInCSS,
} from '../../utils.js'
import { useAppState, getGridRegion } from '../../store.js'

let { mainArea } = $(useAppState())

// name: 'CssCodeArea',
const { area, options } = defineProps<{ area; options }>()

let templateAreas = $computed(() => getCodeGridTemplateAreas(area))

let includeTemplateAreas = $computed(() => options.templateAreas && templateAreas !== undefined)

let gridArea = $computed(() => getCodeGridArea(area))

let singleLine = $computed(() => areaIsSingleLineInCSS(area))

let areasToInclude = $computed(() =>
  area.children.filter((area) => !(areaIsSingleLineInCSS(area) && area.gridArea === 'auto'))
)
</script>

<style scoped lang="postcss"></style>
