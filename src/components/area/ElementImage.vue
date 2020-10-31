<template>
  <div
    :style="{
      ...style,
      position: 'relative',
      'object-fit': 'cover',
      background: `url(https://picsum.photos/seed/${area.items ? area.type + '-' + item : area.name}/500?grayscale)`,
    }"
  >
    <slot />
  </div>
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
