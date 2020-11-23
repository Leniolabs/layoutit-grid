<template>
  <div class="grid-settings-container">
    <div class="items">
      <div class="inner-items">
        <div>
          Flex Direction
          <select id :value="flex.direction" name @input="flex.direction = $event.target.value">
            <option value="row">row</option>
            <option value="row-reverse">row-reverse</option>
            <option value="column">column</option>
            <option value="column-reverse">column-reverse</option>
          </select>
        </div>
        <br />
        <div>
          Flex Wrap
          <select id :value="flex.wrap" name @input="flex.wrap = $event.target.value">
            <option value="nowrap">nowrap</option>
            <option value="wrap">wrap</option>
            <option value="wrap-reverse">wrap-reverse</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup="props">
import { computed } from 'vue'

export default {
  props: {
    area: { type: Object, required: true },
  },
}

export const flex = computed(() => props.area.flex)
</script>

<style scoped lang="scss">
h2 {
  margin: 0 0 10px;
  font-family: 'Alegreya Sans', 'Helvetica Neue', Arial, sans-serif;
  margin-top: 10px;
  margin-bottom: 0.625em;
  font-size: 16px;
  span {
    font-weight: normal;
  }
}

.inner-items-container {
  max-height: 400px;
  overflow: auto;
}

.items {
  margin-bottom: 20px;

  .inner-items {
    max-height: 185px;
    overflow: auto;
    font-family: arial;
    > div {
      display: grid;
      grid-template-columns: 70px auto;
      padding-right: 10px;
      grid-gap: 0 5px;
      border-radius: 2px;
      //overflow: hidden;
      height: 30px;
      margin-bottom: 6px;
      input {
        text-align: center;
        width: 100%;
        border: 0;
        border-radius: 2px;
        padding: 0.313em;
        font-size: 14px;
        &.dragging {
          background: #bbe5b3;
        }
      }
      button {
        margin-bottom: 0;
        background: #b0184b;
        &:hover {
          background: #c11651;
        }
        svg {
          width: 100%;
          height: 100%;
          padding: 4px;
        }
      }
      select {
        background: #fff;
        border: 0;
        width: 100%;
        font-size: 14px;
      }
    }
  }
}

.flex-item.selected {
  background: #12906a;
}

.flex-item.selected h2:after {
  content: '';
  width: 10px;
  height: 10px;
  display: inline-block;
  margin-left: 10px;
  border-radius: 50%;
  background: #fdd835;
}
</style>
