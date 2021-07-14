<template>
  <div class="props-accordion">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  accordion: { type: Object, required: true },
})
</script>

<style scoped lang="postcss"></style>
