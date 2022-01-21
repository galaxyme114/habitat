<template>
  <div class="catalogue">
    <div><img class="drag-svg" draggable="true" @dragstart="dragStart" :src="getImageUrl('svg/Windows/thpa-window-awning-01.svg')" alt=""></div>
    <div><img class="drag-svg" draggable="true" @dragstart="dragStart" :src="getImageUrl('svg/Windows/thpa-window-double-hung-01.svg')" alt=""></div>
    <div><img class="drag-svg" draggable="true" @dragstart="dragStart" :src="getImageUrl('svg/Windows/thpa-window-fixed-01.svg')" alt=""></div>
    <div><img class="drag-svg" draggable="true" @dragstart="dragStart" :src="getImageUrl('svg/Windows/thpa-window-hopper-01.svg')" alt=""></div>
    <div><img class="drag-svg" draggable="true" @dragstart="dragStart" :src="getImageUrl('svg/Windows/thpa-window-jalousie-01.svg')" alt=""></div>
    <div><img class="drag-svg" draggable="true" @dragstart="dragStart" :src="getImageUrl('svg/Windows/thpa-window-pivoting-01.svg')" alt=""></div>
    <div><img class="drag-svg" draggable="true" @dragstart="dragStart" :src="getImageUrl('svg/Windows/thpa-window-sliding-01.svg')" alt=""></div>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  methods: {
    dragStart (e) {
      this.$emit('catalogue-drag-start', e)
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
