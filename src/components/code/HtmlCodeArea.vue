<!-- prettier-ignore -->
<template><span>{{ `${ident}<` }}<span class="token tag">div</span> <span class="token attr-name">class</span>="<span class="token attr-value">{{cssAreaName}}</span>"><template 
v-for="a in gridAreas" :key="a.name">{{ '\n' }}<HtmlCodeArea :area="a" :options="options" :ident="ident+'  '" /></template>{{ `${gridAreas.length > 0 ? ('\n'+ident) : '' }</` }}<span class="token tag">div</span>></span>
</template>

<script setup="props">
import { computed } from 'vue'
import { toCssName } from '../../utils.js'

export default {
  name: 'HtmlCodeArea',
  props: {
    area: { type: Object, required: true },
    options: { type: Object, required: true },
    ident: { type: String, default: '' },
  },
}

export const cssAreaName = computed(() => toCssName(props.area.name))

export const gridAreas = computed(() => (props.area.grid ? props.area.grid.areas : []))
</script>

<style scoped lang="scss"></style>
