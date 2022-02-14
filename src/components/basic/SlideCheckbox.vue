<template>
  <div class="slide-checkbox">
    <input :id="id" :checked="modelValue" type="checkbox" @input="$emit('update:modelValue', $event.target.checked)" />
    <label :for="id">
      <slot />
    </label>
  </div>
</template>

<script setup lang="ts">
const { id, modelValue = false } = defineProps<{
  id: string
  modelValue?: boolean
}>()
defineEmits(['update:modelValue'])
</script>

<style lang="postcss" scoped>
input {
  position: relative;
  top: 1px;
  opacity: 0.8;
  &:checked {
    opacity: 1;
  }
}
</style>
