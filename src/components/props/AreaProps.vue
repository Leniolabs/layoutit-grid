<template>
  <PropsAccordion class="area-props" :accordion="accordion">
    <PropsAccordionItem
      name="tree"
      independent="true"
      :heading="`Areas`"
      :closed-heading="`${area.name}`"
      :accordion="accordion"
    >
      <AreaTree :area="mainArea" />
    </PropsAccordionItem>
    <!--
    <div class="area-type">{{ area.type === 'div' ? area.display : area.type }} props</div>
    -->
    <PropsAccordionItem name="display" :heading="`Display ${area.display}`" :accordion="accordion">
      <AreaContentProps :area="area" />
    </PropsAccordionItem>

    <template v-if="area.display === 'grid'">
      <PropsAccordionItem name="grid-template" heading="Grid Template" :accordion="accordion">
        <AreaGridTemplateProps :area="area" />
      </PropsAccordionItem>

      <PropsAccordionItem name="grid-gap" heading="Grid Gap" :accordion="accordion">
        <AreaGridGapProps :area="area" />
      </PropsAccordionItem>

      <PropsAccordionItem name="grid-items-placement" heading="Grid Items Placement" :accordion="accordion">
        <AreaGridItemsPlacementProps :area="area" />
      </PropsAccordionItem>

      <PropsAccordionItem name="grid-content-placement" heading="Grid Content Placement" :accordion="accordion">
        <AreaGridContentPlacementProps :area="area" />
      </PropsAccordionItem>
    </template>

    <PropsAccordionItem v-if="area.display === 'flex'" name="flex-props" heading="Flex Props" :accordion="accordion">
      <AreaFlexProps :area="area" />
    </PropsAccordionItem>

    <PropsAccordionItem
      v-if="area.parent && area.parent.display === 'grid'"
      name="self-grid"
      heading="Self Grid"
      :accordion="accordion"
    >
      <AreaSelfGridProps :area="area" />
    </PropsAccordionItem>

    <PropsAccordionItem
      v-if="area.parent && area.parent.display === 'flex'"
      name="self-flex"
      heading="Self Flex"
      :accordion="accordion"
    >
      <AreaSelfFlexProps :area="area" />
    </PropsAccordionItem>

    <PropsAccordionItem name="box" heading="Box" :accordion="accordion">
      <AreaBoxProps :area="area" />
    </PropsAccordionItem>

    <PropsAccordionItem v-if="area.parent" name="type" heading="Type" :accordion="accordion">
      <AreaTypeSelect v-if="area.parent" :model-value="area.type" @update:modelValue="onUpdateType" />
    </PropsAccordionItem>
  </PropsAccordion>
</template>

<script setup="props">
export { default as AreaTree } from './AreaTree.vue'
export { default as AreaContentProps } from './AreaContentProps.vue'
export { default as AreaBoxProps } from './AreaBoxProps.vue'
export { default as AreaSelfGridProps } from './AreaSelfGridProps.vue'
export { default as AreaSelfFlexProps } from './AreaSelfFlexProps.vue'
export { default as AreaGridTemplateProps } from './AreaGridTemplateProps.vue'
export { default as AreaGridGapProps } from './AreaGridGapProps.vue'
export { default as AreaGridItemsPlacementProps } from './AreaGridItemsPlacementProps.vue'
export { default as AreaGridContentPlacementProps } from './AreaGridContentPlacementProps.vue'
export { default as AreaFlexProps } from './AreaFlexProps.vue'
export { default as AreaTypeSelect } from '../common/AreaTypeSelect.vue'
export { default as PropsAccordion } from './PropsAccordion.vue'
export { default as PropsAccordionItem } from './PropsAccordionItem.vue'

import { batch, currentArea, mainArea } from '../../store.js'
export { mainArea }
import { ref, computed, watch } from 'vue'

export default {
  name: 'AreaProps',
  props: {
    area: { type: Object, required: true },
  },
}

export const accordion = ref({ active: 'grid-template' })
export const currentGrid = computed(() => props.area.grid)
export const currentFlex = computed(() => props.area.flex)

watch(currentArea, () => {
  if (accordion.value.active !== 'tree') {
    if (currentArea.display === 'grid') {
      accordion.value.active = 'grid-template'
    } else {
      accordion.value.active = 'box'
    }
  }
})

export function onUpdateType(type) {
  batch(() => {
    props.area.type = type
    if (type === 'p') {
      if (!props.area.text) {
        props.area.text = 'Paragraph'
        props.area.display = 'block'
      }
    }
    if (type === 'button') {
      if (!props.area.text) {
        props.area.text = 'Action'
        props.area.display = 'block'
      }
    }
  })
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
