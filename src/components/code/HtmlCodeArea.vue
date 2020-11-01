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
import { toCssName } from '../../utils.js'

export default {
  name: 'HtmlCodeArea',
  props: {
    area: { type: Object, required: true },
    options: { type: Object, required: true },
    ident: { type: String, default: '' },
  },
}

export const OPEN_TAG = '<'
export const CLOSE_TAG = '</'
export const cssAreaName = computed(() => toCssName(props.area.name))
export const elementTag = computed(() => {
  switch (props.area.type) {
    case 'p':
      return 'p'
    case 'image': // TODO: Should we keep it as div in the code?
      return 'img'
    default:
      return 'div'
    // TODO: Should we add a comment if component is used?
  }
})
export const gridAreas = computed(() => (props.area.display === 'grid' ? props.area.children : []))
</script>

<style scoped lang="scss"></style>
