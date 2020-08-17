<template>
  <select
    :value="modelValue"
    class="unit-select"
    @input="$emit('update:modelValue', $event.target.value)"
  >
    <option v-for="option in options" :value="option" :key="option">{{ option }}</option>
  </select>
</template>

<script>
const units = {
  grid: ['fr', 'px', '%', 'em', 'auto', 'min-content', 'max-content', 'minmax'],
  flex: ['px', '%', 'em'],
  default: ['px', '%', 'em'],
}

export default {
  name: 'UnitSelect',
  props: {
    modelValue: { type: String, default: 'px' },
    type: { type: String, default: 'default' }, //  default, grid, flex
  },
  computed: {
    options() {
      return units[this.type]
    },
  },
}
</script>

<style scoped lang="scss">
.unit-select {
  background: #fff;
  border: 0;
  width: 100%;
  font-size: 14px;
}
</style>
