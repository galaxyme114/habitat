<template>
  <div class="catalogue">
    <div>
      <img class="drag-room-object" data-name="ThpaWindowAwning01" draggable="true" @dragstart="dragStart" :src="getImageUrl('svg/Windows/thpa-window-awning-01.svg')" alt="Window Awning">
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  methods: {
    dragStart (e) {
      this.$emit('room-object-drag-start', e)
    },
    getImageUrl (url) {
      return process.env.BASE_URL + url
    }
  }
}
</script>
<style lang="scss">
.catalogue {
  display: flex;
  flex-wrap: wrap;
  width: 240px;
}
.drag-svg {
  width: 100px;
  height: 100px;
  margin: 10px;
  cursor: grab;
}
.drag-room-object {
  width: 100px;
  height: 100px;
  margin: 10px;
  cursor: grab;
}
</style>
