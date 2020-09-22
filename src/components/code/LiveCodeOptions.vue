<template>
  <div class="output-settings">
    <SlideCheckbox id="checkbox-repeat" v-model="modelValue.repeat">
      Apply CSS
      <strong>
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/CSS/repeat"
          rel="noreferrer"
          target="_blank"
        >repeat</a>
      </strong>
      function.
    </SlideCheckbox>
    <SlideCheckbox id="checkbox-template-areas" v-model="modelValue.templateAreas">
      Use
      <strong>
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas"
          rel="noreferrer"
          target="_blank"
        >grid-template-areas</a>
      </strong>
      for positioning.
    </SlideCheckbox>
    <SlideCheckbox id="checkbox-old-spec" v-model="modelValue.oldSpec">
      Include support for
      <strong>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://rachelandrew.co.uk/archives/2016/11/26/should-i-try-to-use-the-ie-implementation-of-css-grid-layout/"
        >legacy grid spec</a>
      </strong>
      (for IE 10/11).
    </SlideCheckbox>
    <div v-if="modelValue.oldSpec" class="checkbox-warning">
      <strong>Warning:</strong> the legacy grid specification does not support
      <a
        target="_blank"
        rel="noreferrer"
        class="auto-placement-link"
        href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Auto-placement_in_CSS_Grid_Layout"
      >auto-placement of elements!</a>
    </div>
  </div>
</template>

<script setup="props">
export { default as SlideCheckbox } from '../basic/SlideCheckbox.vue'

export default {
  props: {
    modelValue: { type: Object, required: true },
  },
}
</script>

<style scoped lang="scss">
.checkbox-warning {
  color: #333;
  margin-bottom: 10px;
  margin-top: 5px;
  padding: 6px 10px;
  border-radius: 2px;
  background-color: #fdd835;
  width: 100%;
  font-size: 14px;
  .auto-placement-link {
    font-weight: 600;
  }
}

.output-settings {
  margin: auto 0 0 0;
  width: 100%;
  font-size: 14px;
  user-select: none;
  a {
    color: #3094b4;
  }
  .slide-checkbox {
    padding-bottom: 5px;
    &:last-child {
      padding-bottom: 0;
    }
  }
  > {
    padding-bottom: 5px;
  }
}
</style>
