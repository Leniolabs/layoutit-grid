<template>
  <div class="props-accordion">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ accordion }>()
</script>

<style scoped lang="postcss"></style>
