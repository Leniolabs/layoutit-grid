<!-- prettier-ignore -->
<template><span>{{ `${ident}<` }}<span class="token tag">div</span> <span class="token attr-name">class</span>="<span class="token attr-value">{{cssAreaName}}</span>"><template 
v-for="a in gridAreas" :key="a.name">{{ '\n' }}<HtmlCodeArea :area="a" :options="options" :ident="ident+'  '" /></template>{{ `${gridAreas.length > 0 ? ('\n'+ident) : '' }</` }}<span class="token tag">div</span>></span>
</template>

<script setup="props">
import { computed } from 'vue'
import { prefixedName } from '../../generateCode.js'

export default {
  name: 'HtmlCodeArea',
  props: {
    area: { type: Object, required: true },
    options: { type: Object, required: true },
    ident: { type: String, default: '' },
  },
}

export const prefix = computed(() => (props.options.prefix ? props.options.prefixName : undefined))

export const cssAreaName = computed(() => prefixedName(props.area.name, prefix.value))

export function areaToHTML(area, { prefix }) {
  return gridToHTML(area.grid, 'grid-container', 0, prefix)
}

function areasToHTML(grid, ident = 0, prefix) {
  let html = ''
  grid.areas.forEach((area) => {
    html += '\n' + identString(ident) + gridToHTML(area.grid, area.name, ident, prefix)
  })
  if (grid.areas.length > 0) {
    html += '\n' + identString(ident - 1) // ident for parent </div>
  }
  return html
}

export function gridToHTML(grid, name, ident, prefix) {
  return `<div class="${prefixedName(name, prefix)}">${grid ? areasToHTML(grid, ident + 1, prefix) : ''}</div>`
}

export const gridAreas = computed(() => (props.area.grid ? props.area.grid.areas : []))
</script>

<style scoped lang="scss"></style>
