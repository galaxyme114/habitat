<template>
  <div class="catalogue">

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
