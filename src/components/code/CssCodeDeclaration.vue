<template>
  {{ ident }}<span class="token property">{{ property }}</span
  >: <span class="token string"><slot /></span>;
</template>

<script setup lang="ts">
const { property, ident = '\n  ' } = defineProps<{
  property: string
  ident?: string
}>()
</script>

<style scoped lang="postcss"></style>
