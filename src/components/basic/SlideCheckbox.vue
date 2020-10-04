<template>
  <div class="slide-checkbox">
    <input
      :id="id"
      :checked="modelValue"
      class="input-switch"
      type="checkbox"
      @input="$emit('update:modelValue', $event.target.checked)"
    />
    <label :for="id">
      <slot />
    </label>
  </div>
</template>

<script setup="props">
export default {
  props: {
    modelValue: { type: Boolean, default: false },
    id: { type: String, required: true },
  },
  emits: ['update:modelValue'],
}
</script>
