<template>
  <transition name="habitat-slide-up">
    <div
      v-if="filteredEmojis.length"
      class="habitat-emojis-container"
      :style="{ bottom: `${$parent.$refs.channelFooter.clientHeight}px` }"
    >
      <div
        v-for="(emoji, index) in filteredEmojis"
        :key="emoji"
        class="habitat-emoji-element"
        :class="{ 'habitat-emoji-element-active': index === activeItem }"
        @mouseover="activeItem = index"
        @click="$emit('select-emoji', emoji)"
      >
        {{ emoji }}
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ChannelEmojis',

  props: {
    filteredEmojis: { type: Array, required: true },
    selectItem: { type: Boolean, default: null },
    activeUpOrDown: { type: Number, default: null }
  },

  emits: ['select-emoji', 'activate-item'],

  data () {
    return {
      activeItem: null
    }
  },

  watch: {
    filteredEmojis () {
      this.activeItem = 0
    },
    selectItem (val) {
      if (val) {
        this.$emit('select-emoji', this.filteredEmojis[this.activeItem])
      }
    },
    activeUpOrDown () {
      if (
        this.activeUpOrDown > 0 &&
        this.activeItem < this.filteredEmojis.length - 1
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
