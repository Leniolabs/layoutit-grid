<template>
  <span
    >{{ `${ident}${OPEN_TAG}` }}<span class="token tag">{{ elementTag }}</span
    >{{ ' ' }}<span class="token attr-name">class</span>="<span class="token attr-value">{{ cssAreaName }}</span
    >"><template v-for="a in gridAreas" :key="a.name"
      >{{ '\n' }}<HtmlCodeArea :area="a" :options="options" :ident="ident + '  '" /></template
    >{{ `${gridAreas.length > 0 ? '\n' + ident : ''}${CLOSE_TAG}` }}<span class="token tag">{{ elementTag }}</span
    >></span
  >
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { toCssName, getElementTag } from '../../utils.js'

// name: 'HtmlCodeArea',
const props = defineProps({
  area: { type: Object, required: true },
  options: { type: Object, required: true },
  ident: { type: String, default: '' },
})
const OPEN_TAG = '<'
const CLOSE_TAG = '</'
const cssAreaName = computed(() => toCssName(props.area.name))
const elementTag = computed(() => getElementTag(props.area))

const gridAreas = computed(() => (props.area.display === 'grid' ? props.area.children : []))
</script>

<style scoped lang="scss"></style>
