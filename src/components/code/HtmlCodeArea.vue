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

<script setup="props">
import { computed } from 'vue'
import { toCssName, getElementTag } from '../../utils.js'

export default {
  name: 'HtmlCodeArea',
  props: {
    area: { type: Object, required: true },
    options: { type: Object, required: true },
    ident: { type: String, default: '' },
  },
}

const OPEN_TAG = '<'
const CLOSE_TAG = '</'
ref: cssAreaName = computed(() => toCssName(props.area.name))
ref: elementTag = computed(() => getElementTag(props.area))

ref: gridAreas = computed(() => (props.area.display === 'grid' ? props.area.children : []))
</script>

<style scoped lang="scss"></style>
