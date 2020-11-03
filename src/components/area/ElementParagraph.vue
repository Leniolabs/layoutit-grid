<template>
  <p :style="{ ...style, 'font-size': '20px', color: '#00000088' }">
    {{ area.text }}
    <slot />
  </p>
</template>

<script setup="props">
export default {
  props: {
    area: { type: Object, required: true },
    style: { type: Object, required: true },
  },
}
</script>

<style scoped lang="scss"></style>
