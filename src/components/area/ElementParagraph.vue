<template>
  <p :style="{ ...style, 'font-size': '20px', color: '#00000088' }">
    {{ area.text }}
    <slot />
  </p>
</template>

<script setup lang="ts">
defineProps<{ area; style }>()
</script>

<style scoped lang="postcss"></style>
