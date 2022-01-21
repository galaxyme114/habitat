<template>
  <transition name="habitat-slide-up">
    <div
      v-if="filteredTemplatesText.length"
      class="habitat-template-container habitat-app-box-shadow"
      :style="{ bottom: `${$parent.$refs.channelFooter.clientHeight}px` }"
    >
      <div
        v-for="(template, index) in filteredTemplatesText"
        :key="index"
        class="habitat-template-box"
        :class="{ 'habitat-template-active': index === activeItem }"
        @mouseover="activeItem = index"
        @click="$emit('select-template-text', template)"
      >
        <div class="habitat-template-info">
          <div class="habitat-template-tag">
            /{{ template.tag }}
          </div>
          <div class="habitat-template-text">
            {{ template.text }}
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ChannelTemplatesText',

  props: {
    filteredTemplatesText: { type: Array, required: true },
    selectItem: { type: Boolean, default: null },
    activeUpOrDown: { type: Number, default: null }
  },

  emits: ['select-template-text', 'activate-item'],

  data () {
    return {
      activeItem: null
    }
  },

  watch: {
    filteredTemplatesText () {
      this.activeItem = 0
    },
    selectItem (val) {
      if (val) {
        this.$emit(
          'select-template-text',
          this.filteredTemplatesText[this.activeItem]
        )
      }
    },
    activeUpOrDown () {
      if (
        this.activeUpOrDown > 0 &&
        this.activeItem < this.filteredTemplatesText.length - 1
      ) {
        this.activeItem++
      } else if (this.activeUpOrDown < 0 && this.activeItem > 0) {
        this.activeItem--
      }
      this.$emit('activate-item')
    }
  }
}
</script>
