<template>
  {{ ident }}<span class="token property">{{ property }}</span
  >: <span class="token string"><slot /></span>;
</template>

<script setup="props">
export default {
  props: {
    property: { type: String, required: true },
    ident: { type: String, default: '\n  ' },
  },
}
</script>

<style scoped lang="scss"></style>
