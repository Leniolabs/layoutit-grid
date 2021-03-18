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

<script setup>
import { defineProps, computed, toRefs } from 'vue'
import { mainArea, currentArea } from '../../store.js'
import { deselectCurrentArea } from '../../store.js'
import { useIsActiveArea } from '../../composables/area.js'
import AreaEditor from '../area/AreaEditor.vue'

const props = defineProps({
  area: { type: Object, required: true },
})
const flex = computed(() => props.area.flex)

const { area } = toRefs(props)
const isActive = useIsActiveArea(area)
</script>

<style scoped lang="postcss">
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
