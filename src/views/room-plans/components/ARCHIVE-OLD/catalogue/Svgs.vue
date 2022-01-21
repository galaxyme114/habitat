<template>
  <div class="catalogue">
    <div>
      <img class="drag-svg" draggable="true" @dragstart="dragStart" :src="getImageUrl('svg/Appliances/thpa-appliance-dishwasher-01.svg')" alt="Dishwasher">
    </div>
    <!-- <div>
      <img class="drag-svg" draggable="true" @dragstart="dragStart" :src="getImageUrl('svg/Appliances/thpa-appliance-french-door-fridge-01.svg')" alt="French Door Fridge">
    </div>
    <div>
      <img class="drag-svg" draggable="true" @dragstart="dragStart" :src="getImageUrl('svg/Appliances/thpa-appliance-fridge-01.svg')" alt="Fridge">
    </div>
    <div>
      <img class="drag-svg" draggable="true" @dragstart="dragStart" :src="getImageUrl('svg/Appliances/thpa-appliance-stove-top-01.svg')" alt="Stove Top">
    </div> -->
    <div>
      <img class="drag-room-object" draggable="true" @dragstart="dragStart" :src="getImageUrl('svg/Windows/thpa-window-awning-01.svg')" data-name="thpa-window-awning-01" alt="Window">
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
      this.$emit('svg-drag-start', e)
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
