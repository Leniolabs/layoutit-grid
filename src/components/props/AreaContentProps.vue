<template>
  <template v-if="area.type === 'div'">
    <DisplaySelect :model-value="area.display" @update:modelValue="onUpdateDisplay" />
    <!--
    <button @click="addImplicitArea">Add Area</button>
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
    <textarea
      style="height: 4em; width: 100%"
      :value="area.text"
      aria-label="area text"
      @input="onAreaTextInput($event.target.value)"
    />
  </div>
</template>

<script setup lang="ts">
import { createAreaState, createFlexState, createGridState } from '../../store'
import { inputSetter } from '../../composables'

const { area } = defineProps<{ area }>()

const onAreaTextInput = inputSetter((value) => (area.text = value))

function onUpdateDisplay(value) {
  area.display = value
  if (area.display === 'flex') {
    if (!area.flex) {
      area.flex = createFlexState()
    }
  }
  if (area.display === 'grid') {
    if (!area.grid) {
      area.grid = createGridState()
    }
  }
}

let counter = $ref(1)
function addImplicitArea() {
  area.children.push(
    createAreaState({
      name: 'a' + counter++,
      parent: area,
    })
  )
}

function addItems() {
  area.children.push(
    createAreaState({
      name: '10 photos',
      parent: area,
      type: 'image',
      items: {
        count: 10,
      },
    })
  )
}
</script>

<style scoped lang="postcss">
.items {
  font-size: 11px;
  margin-bottom: 10px;
}
</style>
