<template>
  <template v-if="area.type === 'div'">
    <DisplaySelect :model-value="area.display" @update:modelValue="onUpdateDisplay" />
    <button @click="addImplicitArea">Add Area</button>
    <!--
      <button @click="addItems">Add Some Items</button>
      <div v-if="area.items">
        <span>Items</span>
        <input
          :value="area.items.count"
          type="number"
          aria-label="items count"
          min="1"
          step="1"
          @input=";(area.items.count = +$event.target.value), (area.name = area.items.count + ' photos')"
        />
      </div>
      -->
  </template>
  <div v-if="area.type === 'p'">
    <textarea style="height: 3em" :value="area.text" aria-label="area text" @input="area.text = $event.target.value" />
  </div>
</template>

<script setup="props">
export { default as DisplaySelect } from '../common/DisplaySelect.vue'

import { ref } from 'vue'
import { createAreaState, createFlexState } from '../../store'
export { currentArea } from '../../store.js'
export { gridRegionToGridArea } from '../../utils.js'

export default {
  name: 'AreaProps',
  props: {
    area: { type: Object, required: true },
  },
}

export function onUpdateDisplay(value) {
  props.area.display = value
  if (props.area.display === 'flex') {
    if (!props.area.flex) {
      props.area.flex = createFlexState()
    }
  }
}

const counter = ref(1)
export function addImplicitArea() {
  props.area.children.push(
    createAreaState({
      name: 'a' + counter.value++,
      parent: props.area,
    })
  )
}

export function addItems() {
  props.area.children.push(
    createAreaState({
      name: '10 photos',
      parent: props.area,
      type: 'image',
      items: {
        count: 10,
      },
    })
  )
}
</script>

<style scoped lang="scss">
.items {
  font-size: 11px;
  margin-bottom: 10px;
}
</style>
