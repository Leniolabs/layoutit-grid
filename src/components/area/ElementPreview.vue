<template>
  <component
    :is="areaType"
    :class="['area-element', { grayed: !isActive }]"
    :style="{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      opacity: 0.5,
    }"
    :area="area"
  >
    <div
      v-if="area.type === 'component'"
      style="
        width: 100%;
        height: 100%;
        opacity: 0.5;
        padding: 20px;
        display: grid;
        justify-items: center;
        align-items: center;
      "
    >
      <PieChart />
    </div>

    <div
      v-if="area.type === 'button'"
      style="
        width: 100%;
        height: 100%;
        opacity: 0.5;
        padding: 20px;
        display: grid;
        justify-items: center;
        align-items: center;
      "
    >
      <button
        style="border: none; padding: 10px; border-radius: 5px; font-size: 16px; font-weight: 700; background: #aaa"
      >
        {{ area.text }}
      </button>
    </div>
  </component>
</template>

<script setup="props">
export { default as AreaInfo } from './AreaInfo.vue'
export { default as PieChart } from '../content/PieChart.vue'
export { default as ElementImage } from './ElementImage.vue'
export { default as ElementParagraph } from './ElementParagraph.vue'
// GridEditor imported globally due to circular reference with AreaEditor
// export { default as FlexEditor } from '../flex/FlexEditor.vue'

import { computed, defineAsyncComponent, toRefs } from 'vue'
import { mainArea, currentArea, setCurrentArea } from '../../store.js'
import { useIsActiveArea } from '../../composables/area.js'

export { getGridArea } from '../../utils.js'

export default {
  name: 'ElementPreview',
  props: {
    area: { type: Object, required: true },
    item: { type: Number, default: 1 },
  },
  emits: ['edit'],
}

const { area } = toRefs(props)
export const isActive = useIsActiveArea(area)

export const areaType = computed(() => {
  switch (props.area.type) {
    case 'image':
      return ElementImage
    case 'p':
      return ElementParagraph
    default:
      return 'section'
  }
})
</script>

<style scoped lang="scss"></style>
