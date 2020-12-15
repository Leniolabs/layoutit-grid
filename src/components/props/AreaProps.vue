<template>
  <PropsAccordion class="area-props" :accordion="accordion">
    <!--
    <div class="area-type">{{ area.type === 'div' ? area.display : area.type }} props</div>
    <PropsAccordionItem name="display" :heading="`Display (${area.display})`" :accordion="accordion">
      <AreaContentProps :area="area" />
    </PropsAccordionItem>
    -->

    <template v-if="area.display === 'grid'">
      <PropsAccordionItem name="explicit-grid" heading="Explicit Grid" :accordion="accordion">
        <AreaGridTemplateProps :area="area" />
      </PropsAccordionItem>

      <PropsAccordionItem name="implicit-grid" heading="Implicit Grid" :accordion="accordion">
        <AreaImplicitGridProps :area="area" />
      </PropsAccordionItem>

      <PropsAccordionItem name="grid-gap" heading="Grid Gap" :accordion="accordion">
        <AreaGridGapProps :area="area" />
      </PropsAccordionItem>

      <PropsAccordionItem name="grid-items-placement" heading="Items Placement" :accordion="accordion">
        <AreaGridItemsPlacementProps :area="area" />
      </PropsAccordionItem>

      <PropsAccordionItem name="grid-content-placement" heading="Content Placement" :accordion="accordion">
        <AreaGridContentPlacementProps :area="area" />
      </PropsAccordionItem>
    </template>

    <PropsAccordionItem v-if="area.display === 'flex'" name="flex-props" heading="Flex Props" :accordion="accordion">
      <AreaFlexProps :area="area" />
    </PropsAccordionItem>

    <PropsAccordionItem
      v-if="area.parent && area.parent.display === 'grid'"
      name="self-grid"
      heading="Self Placement"
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

    <PropsAccordionItem name="box" heading="Area Box" :accordion="accordion">
      <AreaBoxProps :area="area" />
    </PropsAccordionItem>
    <PropsAccordionItem
      name="tree"
      :independent="true"
      :heading="`Area Tree`"
      :closed-heading="`${area.name}`"
      :accordion="accordion"
      class="tree-item"
    >
      <AreaTree :area="mainArea" />
    </PropsAccordionItem>
    <!--     <PropsAccordionItem v-if="area.parent" name="type" heading="Type" :accordion="accordion">
      <AreaTypeSelect v-if="area.parent" :model-value="area.type" @update:modelValue="onUpdateType" />
    </PropsAccordionItem> -->
  </PropsAccordion>
</template>

<script setup>
import AreaTree from './AreaTree.vue'
import AreaContentProps from './AreaContentProps.vue'
import AreaBoxProps from './AreaBoxProps.vue'
import AreaSelfGridProps from './AreaSelfGridProps.vue'
import AreaSelfFlexProps from './AreaSelfFlexProps.vue'
import AreaGridTemplateProps from './AreaGridTemplateProps.vue'
import AreaImplicitGridProps from './AreaImplicitGridProps.vue'
import AreaGridGapProps from './AreaGridGapProps.vue'
import AreaGridItemsPlacementProps from './AreaGridItemsPlacementProps.vue'
import AreaGridContentPlacementProps from './AreaGridContentPlacementProps.vue'
import AreaFlexProps from './AreaFlexProps.vue'
import AreaTypeSelect from '../common/AreaTypeSelect.vue'
import PropsAccordion from './PropsAccordion.vue'
import PropsAccordionItem from './PropsAccordionItem.vue'

import { currentArea, mainArea } from '../../store.js'
import { defineProps, ref, computed, watch } from 'vue'

const props = defineProps({
  area: { type: Object, required: true },
})
const accordion = ref({ active: 'explicit-grid' })
const currentGrid = computed(() => props.area.grid)
const currentFlex = computed(() => props.area.flex)

watch(currentArea, () => {
  if (accordion.value.active !== 'tree') {
    if (currentArea.display === 'grid') {
      accordion.value.active = 'explicit-grid'
    } else {
      accordion.value.active = 'box'
    }
  }
})

function onUpdateType(type) {
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
  overflow: auto;
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
