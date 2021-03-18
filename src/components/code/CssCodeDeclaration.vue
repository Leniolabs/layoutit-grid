<template>
  {{ ident }}<span class="token property">{{ property }}</span
  >: <span class="token string"><slot /></span>;
</template>

<script setup>
import { defineProps } from 'vue'
defineProps({
  property: { type: String, required: true },
  ident: { type: String, default: '\n  ' },
})
</script>

<style scoped lang="postcss"></style>
