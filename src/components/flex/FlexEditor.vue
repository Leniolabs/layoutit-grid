<template>
  <div :style="{ height: '100%' }">
    <section
      :style="{ 'flex-direction': flex.direction, 'flex-wrap': flex.wrap, display: 'flex', height: '100%' }"
      class="flex-container"
    >
      <AreaEditor v-for="a in area.children" :key="`area-${a.id}`" :area="a" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useAppState, deselectCurrentArea } from '../../store.js'
import { useIsActiveArea } from '../../composables/area.js'

let { mainArea, currentArea } = $(useAppState())

const { area } = defineProps<{ area }>()

let flex = $computed(() => area.flex)

let isActive = $(useIsActiveArea(toRef(props, 'area')))
</script>

<style scoped lang="postcss">
.grid section.flex-container {
  overflow: auto;
  background: var(--color-yellow-light);
  &:hover {
    background: var(--color-yellow-light);
  }
  &.grayed {
    background: var(--color-yellow-dark);
  }
  div {
    border-right: 1px dashed var(--color-gray);
    border-bottom: 1px dashed var(--color-gray);
    display: grid;
    align-content: center;
    width: 100%;
    &:hover {
      background: var(--color-yellow-light);
    }
    &.selected {
      background: var(--color-green-ligth);
    }
    &.grayed {
      background: var(--color-yellow-dark);
    }
  }
}
</style>
