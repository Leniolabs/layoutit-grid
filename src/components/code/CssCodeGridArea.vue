<template>
  <span class="token string">{{ gridArea }}</span>
</template>

<script setup lang="ts">
import { getCodeGridArea, getCodeGridTemplateAreas } from '../../utils.js'

const { area, options } = defineProps<{ area; options }>()

let templateAreas = $computed(() => getCodeGridTemplateAreas(area))

let includeTemplateAreas = $computed(() => options.templateAreas && templateAreas !== undefined)

let gridArea = $computed(() => getCodeGridArea(area, options.templateAreas))
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
