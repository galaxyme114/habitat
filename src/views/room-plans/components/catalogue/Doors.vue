<template>
  <div class="catalogue">
    <div><img class="drag-svg" draggable="true" @dragstart="dragStart" data-layer="doors-windows" data-type="door" data-index="0" :src="getImageUrl('svg/Doors/thpa-door-acting-new.svg')" alt=""></div>
    <div><img class="drag-svg" draggable="true" @dragstart="dragStart" data-layer="doors-windows" data-type="door" data-index="1" :src="getImageUrl('svg/Doors/thpa-door-acting-01.svg')" alt=""></div>
    <div><img class="drag-svg" draggable="true" @dragstart="dragStart" :src="getImageUrl('svg/Doors/thpa-door-bypass-01.svg')" alt=""></div>
    <div><img class="drag-svg" draggable="true" @dragstart="dragStart" :src="getImageUrl('svg/Doors/thpa-door-double.svg')" alt=""></div>
    <div><img class="drag-svg" draggable="true" @dragstart="dragStart" :src="getImageUrl('svg/Doors/thpa-door-double-acting-01.svg')" alt=""></div>
    <div><img class="drag-svg" draggable="true" @dragstart="dragStart" :src="getImageUrl('svg/Doors/thpa-door-double-pocket-01.svg')" alt=""></div>
    <div><img class="drag-svg" draggable="true" @dragstart="dragStart" :src="getImageUrl('svg/Doors/thpa-door-garage-01.svg')" alt=""></div>
    <div><img class="drag-svg" draggable="true" @dragstart="dragStart" :src="getImageUrl('svg/Doors/thpa-door-opening-01.svg')" alt=""></div>
    <div><img class="drag-svg" draggable="true" @dragstart="dragStart" :src="getImageUrl('svg/Doors/thpa-door-pocket-01.svg')" alt=""></div>
    <div><img class="drag-svg" draggable="true" @dragstart="dragStart" :src="getImageUrl('svg/Doors/thpa-door-single.svg')" alt=""></div>
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
