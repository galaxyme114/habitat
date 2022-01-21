<template>
  <transition name="habitat-fade-spinner" appear>
    <div
      v-if="show"
      class="habitat-loader-wrapper"
      :class="{
        'habitat-container-center': !infinite,
        'habitat-container-top': infinite
      }"
    >
      <slot name="spinner-icon" v-bind="{ show, infinite }">
        <div id="habitat-circle" />
      </slot>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Loader',

  props: {
    show: { type: Boolean, default: false },
    infinite: { type: Boolean, default: false }
  }
}
</script>
