<template>
  <div class="slide-checkbox">
    <fieldset>
      <input
        :id="id"
        :checked="modelValue"
        class="input-switch"
        type="checkbox"
        @input="$emit('update:modelValue', $event.target.checked)"
      />
      <label />
      <span class="switch-bg" />
      <span class="switch-labels" />
    </fieldset>
    <div>
      <label :for="id">
        <slot />
      </label>
    </div>
  </div>
</template>

<script setup="props">
export default {
  props: {
    modelValue: { type: Boolean, default: false },
    id: { type: String, required: true },
  },
}
</script>

<style scoped lang="scss">
div {
  display: inline-block;
  vertical-align: top;
  padding-left: 5px;
  padding-top: 3px;
  font-family: arial;
  width: calc(100% - 50px);
}
fieldset {
  position: relative;
  width: 38px;
  height: 22px;
  border: 0;
  border-radius: 20px;
  padding: 0;
  text-transform: uppercase;
  overflow: hidden;
  display: inline-block;
  margin-bottom: 3px;
  margin-top: 3px;
  input.input-switch {
    position: absolute;
    opacity: 0;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    z-index: 999;
    height: 100%;
    cursor: pointer;
    margin: 0;
  }
  label:after {
    transition: background 0.15s ease-in;
    content: '';
    background: #ccc;
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
  }
  span.switch-bg {
    position: absolute;
    z-index: 9;
    width: 16px;
    height: calc(100% - 6px);
    left: 3px;
    top: 3px;
    background: #fff;
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2);
    transition: all 0.2s;
    -webkit-transition: all 0.2s;
    border-radius: 50%;
  }
  span.switch-labels {
    position: absolute;
    width: inherit;
    height: inherit;
    &:before,
    &:after {
      height: 30px;
      width: 50%;
      line-height: 30px;
      transition: all 0.2ss;
      -webkit-transition: all 0.2s;
      text-align: center;
      font-size: 12px;
    }
    &:before {
      content: '';
      right: 1px;
      position: absolute;
      color: #fff;
      z-index: 99;
    }
    &:after {
      content: '';
      position: absolute;
      left: 3px;
      color: #fff;
      z-index: 99;
    }
  }
  label {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
}
.input-switch:checked ~ .switch-bg {
  left: calc(100% - 19px);
}
.input-switch:checked ~ .switch-labels:before {
  color: #fff;
}
.input-switch:checked ~ .switch-labels:after {
  color: #fff;
}
.input-switch:checked ~ label:after {
  background: #2fc334;
}
</style>
