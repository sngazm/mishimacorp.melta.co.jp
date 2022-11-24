<template>
  <div class="annotation" :data-x="positionX" :data-y="positionY" :data-z="positionZ">
    <slot />
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend ({
  name: 'Annotation',
  props: {
    positionX: {
      type: Number,
      default: 0
    },
    positionY: {
      type: Number,
      default: 0
    },
    positionZ: {
      type: Number,
      default: 0
    }
  },
  mounted() {
  }
})
</script>

<style>

</style>
