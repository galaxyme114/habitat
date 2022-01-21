<template>
  <div class="catalogue catalogue-cabinets">
    <div>
      <div class="drag-cabinet" draggable="true" @dragstart="dragStart"></div>
      <div class="text-center">Ground Level Cabinet</div>
    </div>
    <div>
      <div><img class="drag-cabinet-shape l-shape-ground" draggable="true" @dragstart="dragStart" :src="getImageUrl('svg/Cabinets/l-shape.svg')" alt=""></div>
      <div class="text-center">Corner Ground Level Cabinet</div>
    </div>
    <div>
      <div class="drag-cabinet-overhead" draggable="true" @dragstart="dragStart"></div>
      <div class="text-center">Overhead Cabinet</div>
    </div>
    <div>
      <div><img class="drag-cabinet-shape l-shape-overhead" draggable="true" @dragstart="dragStart" :src="getImageUrl('svg/Cabinets/l-shape-overhead.svg')" alt=""></div>
      <div class="text-center">Corner Overhead Cabinet</div>
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
      this.$emit('catalogue-drag-start', e)
    },
    getImageUrl (url) {
      return process.env.BASE_URL + url
    }
  }
}
</script>
<style lang="scss">
.catalogue-cabinets {
  display: flex;
  flex-wrap: wrap;
  width: 300px;

  > div {
    padding: 0.5rem;
  }
}
.drag-cabinet, .drag-cabinet-overhead {
  width: 60px;
  height: 60px;
  margin: 10px;
  cursor: grab;
  border: 2px solid #000;
}
.drag-cabinet-overhead {
  border: 2px dashed #000;
  width: 32px;
}
.drag-cabinet-shape {
  width: 150px;
  height: 150px;
}
</style>
