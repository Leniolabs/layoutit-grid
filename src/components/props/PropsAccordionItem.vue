<template>
  <div class="props-accordion-item">
    <h1 @click="accordion.active = heading">{{ heading }}</h1>
    <div v-if="accordion.active === heading" class="props-accordion-content">
      <slot />
    </div>
  </div>
</template>

<script setup="props">
export default {
  name: 'AreaProps',
  props: {
    heading: { type: String, required: true },
    accordion: { type: Object, required: true },
  },
}
</script>

<style scoped lang="scss">
.props-accordion-item {
  overflow: hidden;
  margin: 0;
}

h1 {
  margin: 1px 0 0 0;
  font-size: 0.9em;
  width: 100%;
  padding: 1px 0 0 5px;
  height: 1.5em;
  border: 1px solid white;
  background-color: #ddd;
  color: black;
}

.props-accordion-content {
  padding-top: 8px;
}

* {
  scrollbar-width: thin;
  scrollbar-color: #491988 #300748;
}
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar:horizontal {
  height: 5px;
}
::-webkit-scrollbar-track {
  background: #300748;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  background: #491988;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #5c26a2;
}

.items {
  font-size: 11px;
  margin-bottom: 10px;
}
</style>
