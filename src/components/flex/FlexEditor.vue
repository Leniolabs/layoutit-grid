<template>
  <div :style="{ height: '100%' }">
    <section
      :style="{ 'flex-direction': flex.direction, 'flex-wrap': flex.wrap, display: 'flex', height: '100%' }"
      class="flex-container"
    >
      <AreaEditor v-for="(a, i) in area.children" :key="`area-${i}`" :area="a" />
    </section>
  </div>
</template>

<script setup="props">
import { computed, toRefs } from 'vue'
import { mainArea, currentArea, currentItem } from '../../store.js'
export { deselectCurrentArea } from '../../store.js'
import { useIsActiveArea } from '../../composables/area.js'
export { default as AreaEditor } from '../area/AreaEditor.vue'

export { currentItem }

export default {
  props: {
    area: { type: Object, required: true },
  },
}

export const flex = computed(() => props.area.flex)

const { area } = toRefs(props)
export const isActive = useIsActiveArea(area)

export function toggleFlexItem(item) {
  currentArea.value = props.area
  currentItem.value = item === props.currentItem ? null : item
}
</script>

<style scoped lang="scss">
.grid section.flex-container {
  overflow: auto;
  background: #fff3c4;
  &:hover {
    background: #fff3c4;
  }
  &.grayed {
    background: #a79f7f;
  }
  div {
    border-right: 1px dashed #999;
    border-bottom: 1px dashed #999;
    display: grid;
    align-content: center;
    width: 100%;
    &:hover {
      background: #fff3c4;
    }
    &.selected {
      background: #c0dfa0;
    }
    &.grayed {
      background: #a79f7f;
    }
  }
}
</style>
