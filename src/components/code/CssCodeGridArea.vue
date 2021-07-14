<template>
  <span class="token string">{{ gridArea }}</span>
</template>

<script setup>
import { dragging, currentArea } from '../../store.js'
import { getCodeGridArea, getCodeGridTemplateAreas } from '../../utils.js'

const props = defineProps({
  area: { type: Object, required: true },
  options: { type: Object, required: true },
})

const templateAreas = computed(() => getCodeGridTemplateAreas(props.area))

const includeTemplateAreas = computed(() => props.options.templateAreas && templateAreas.value !== undefined)

const gridArea = computed(() => getCodeGridArea(props.area, props.options.templateAreas))
</script>

<style scoped lang="postcss">
span {
  &:hover {
    color: var(--color-gray-lightest);
  }
  &:focus {
    color: var(--color-gray-lightest);
  }
}
</style>
