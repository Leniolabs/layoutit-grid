<template>
  <div :style="{ height: '100%' }">
    <section
      :style="{ 'flex-direction': flex.direction, 'flex-wrap': flex.wrap, display: 'flex', height: '100%' }"
      class="flex-container"
    >
      <div
        v-for="(item, i) in flex.items"
        :key="`section-${i}`"
        :class="{ selected: i + 1 === currentItem, grayed: !parentActive }"
        :style="{
          'flex-grow': item.grow,
          'flex-shrink': item.shrink,
          'flex-basis': item.basis
        }"
        @pointerdown.stop="toggleFlexItem(i + 1)"
      >{{ i + 1 }}</div>
    </section>
  </div>
</template>

<script setup="props">
import { computed } from 'vue'
import { mainArea, currentArea, currentItem } from '../../store.js'

export { currentItem }

export default {
  props: {
    area: { type: Object, required: true },
    parentActive: { type: Boolean, default: false },
  },
}

export const flex = computed(() => props.area.flex)
export const isActive = computed(() => props.area === currentArea.value)

export function toggleFlexItem(item) {
  currentArea.value = props.area
  currentItem.value = item === props.currentItem ? null : item
}

export function deselectArea() {
  currentArea.value = mainArea.value
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
