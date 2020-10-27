<template>
  <div class="area-props">
    <div class="area-type">{{ area.type === 'div' ? area.display : area.type }} props</div>
    <AreaTypeSelect v-if="area.parent" :model-value="area.type" @update:modelValue="onUpdateType" />
    <AreaContentProps :area="area" />
    <AreaLayoutProps :area="area" />
  </div>
</template>

<script setup="props">
export { default as AreaContentProps } from './AreaContentProps.vue'
export { default as AreaLayoutProps } from './AreaLayoutProps.vue'
export { default as AreaTypeSelect } from '../common/AreaTypeSelect.vue'

import { computed } from 'vue'

export default {
  name: 'AreaProps',
  props: {
    area: { type: Object, required: true },
  },
}

export const currentGrid = computed(() => props.area.grid)
export const currentFlex = computed(() => props.area.flex)

export function onUpdateType(type) {
  props.area.type = type
  if (type === 'p') {
    if (!props.area.text) {
      props.area.text = 'Paragraph'
    }
  }
  if (type === 'button') {
    if (!props.area.text) {
      props.area.text = 'Action'
    }
  }
}
</script>

<style scoped lang="scss">
.area-type {
  font-size: 14px;
  font-weight: 700;
  color: black;
  margin-bottom: 10px;
  text-align: center;
  padding: 5px;
  border-radius: 4px;
  background: #ddd;
  border-bottom: 1px solid black;
}

.area-props {
  overflow: scroll;
}

* {
  scrollbar-width: thin;
  scrollbar-color: #491988 #300748;
}
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar:horizontal {
  height: 5px;
}
::-webkit-scrollbar-track {
  background: #300748;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  background: #491988;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #5c26a2;
}

.items {
  font-size: 11px;
  margin-bottom: 10px;
}
</style>
