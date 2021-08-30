<template>
  <span class="token string">{{ gridArea }}</span>
</template>

<script setup>
import { getCodeGridArea, getCodeGridTemplateAreas } from '../../utils.js'

const props = defineProps({
  area: { type: Object, required: true },
  options: { type: Object, required: true },
})

let templateAreas = $computed(() => getCodeGridTemplateAreas(props.area))

let includeTemplateAreas = $computed(() => props.options.templateAreas && templateAreas !== undefined)

let gridArea = $computed(() => getCodeGridArea(props.area, props.options.templateAreas))
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
