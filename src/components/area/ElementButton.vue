<template>
  <div
    :style="{
      ...style,
      position: 'relative',
    }"
  >
    <button
      :style="{
        opacity: 0.5,
        width: '100%',
        height: '100%',
        'object-fit': 'cover',
        border: 'none',
        padding: '10px',
        'border-radius': '5px',
        'font-size': '16px',
        'font-weight': 700,
        background: '#aaa',
      }"
    >
      Button
    </button>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ area; style }>()
</script>

<style scoped lang="postcss"></style>
