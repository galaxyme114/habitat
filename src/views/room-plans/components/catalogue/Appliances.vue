<template>
  <div class="catalogue">
    <div><img class="drag-svg" draggable="true" @dragstart="dragStart" :src="getImageUrl('svg/Appliances/thpa-appliance-dishwasher-01.svg')" alt=""></div>
    <div><img class="drag-svg" draggable="true" @dragstart="dragStart" :src="getImageUrl('svg/Appliances/thpa-appliance-french-door-fridge-01.svg')" alt=""></div>
    <div><img class="drag-svg" draggable="true" @dragstart="dragStart" :src="getImageUrl('svg/Appliances/thpa-appliance-fridge-01.svg')" alt=""></div>
    <div><img class="drag-svg" draggable="true" @dragstart="dragStart" :src="getImageUrl('svg/Appliances/thpa-appliance-stove-top-01.svg')" alt=""></div>
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
