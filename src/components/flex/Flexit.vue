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

<script>
import { store } from '../../store.js'
export default {
  name: 'Flexit',
  props: {
    area: { type: Object, required: true },
    currentArea: { type: Object, required: true },
    currentItem: { type: Number, default: null },
    parentActive: { type: Boolean, default: false }
  },
  data() {
    return {}
  },
  computed: {
    flex() {
      return this.area.flex
    },
    isActive() {
      return this.area === this.currentArea
    }
  },
  methods: {
    toggleFlexItem(item) {
      store.data.currentArea = this.area
      store.data.currentItem = item === this.currentItem ? null : item
    },
    deselectSubGrid() {
      store.data.currentArea = store.data.area
    }
  }
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
