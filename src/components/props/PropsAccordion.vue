<template>
  <div class="props-accordion">
    <slot />
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'

// name: 'AreaProps',
defineProps({
  accordion: { type: Object, required: true },
})
</script>

<style scoped lang="postcss"></style>
