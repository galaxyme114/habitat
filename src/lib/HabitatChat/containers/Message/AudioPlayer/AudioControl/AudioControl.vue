<template>
  <div
    ref="progress"
    class="habitat-player-bar"
    @mousedown="onMouseDown"
    @mouseover="$emit('hover-audio-progress', true)"
    @mouseout="$emit('hover-audio-progress', false)"
  >
    <div class="habitat-player-progress">
      <div class="habitat-line-container">
        <div class="habitat-line-progress" :style="{ width: `${percentage}%` }" />
        <div
          class="habitat-line-dot"
          :class="{ 'habitat-line-dot__active': isMouseDown }"
          :style="{ left: `${percentage}%` }"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    percentage: { type: Number, default: 0 }
  },

  emits: ['hover-audio-progress', 'change-linehead'],

  data () {
    return {
      isMouseDown: false
    }
  },

  methods: {
    onMouseDown (ev) {
      this.isMouseDown = true
      const seekPos = this.calculateLineHeadPosition(ev, this.$refs.progress)
      this.$emit('change-linehead', seekPos)
      document.addEventListener('mousemove', this.onMouseMove)
      document.addEventListener('mouseup', this.onMouseUp)
    },
    onMouseUp (ev) {
      this.isMouseDown = false
      document.removeEventListener('mouseup', this.onMouseUp)
      document.removeEventListener('mousemove', this.onMouseMove)
      const seekPos = this.calculateLineHeadPosition(ev, this.$refs.progress)
      this.$emit('change-linehead', seekPos)
    },
    onMouseMove (ev) {
      const seekPos = this.calculateLineHeadPosition(ev, this.$refs.progress)
      this.$emit('change-linehead', seekPos)
    },
    calculateLineHeadPosition (ev, element) {
      const progressWidth = element.getBoundingClientRect().width
      const leftPosition = element.getBoundingClientRect().left
      let pos = (ev.clientX - leftPosition) / progressWidth

      pos = pos < 0 ? 0 : pos
      pos = pos > 1 ? 1 : pos

      return pos
    }
  }
}
</script>
