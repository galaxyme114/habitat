<template>
  <v-layer ref="grid" :config="configLayer">
    <v-line v-for="x in smallGridX" :key="'x1-' + x" :config="{
      x: (x * GRIDSIZE / DIVISIONS) - transform[4],
      y: -transform[5],
      points: [0, 0, 0, config.height / transform[0]],
      stroke: '#F6F7F9',
      strokeWidth: 1
    }"/>
    <v-line v-for="y in smallGridY" :key="'y1-' + y" :config="{
      x: -transform[4],
      y: (y * GRIDSIZE / DIVISIONS) - transform[5],
      points: [0, 0, config.width / transform[0], 0],
      stroke: '#F6F7F9',
      strokeWidth: 1
    }"/>
    <v-line v-for="x in gridX" :key="'x2-' + x" :config="{
      x: (x * GRIDSIZE) - transform[4],
      y: -transform[5],
      points: [0, 0, 0, config.height / transform[0]],
      stroke: '#E8E8E9',
      strokeWidth: 1
    }"/>
    <v-line v-for="y in gridY" :key="'y2-' + y" :config="{
      x: -transform[4],
      y: (y * GRIDSIZE) - transform[5],
      points: [0, 0, config.width / transform[0], 0],
      stroke: '#E8E8E9',
      strokeWidth: 1
    }"/>
  </v-layer>
</template>
<script>
// NOTE Should this be a group or a layer ie in its own canvas
// TODO Could add caching using toImage() so that the grid is only redrawn on zoom

const GRIDSIZE = 100
const DIVISIONS = 5

export default {
  props: {
    config: {
      type: Object,
      require: true
    }
  },
  computed: {
    configLayer () {
      return {
        x: this.config.x,
        y: this.config.y
      }
    },
    gridX () {
      return Math.round(this.config.width / (this.transform[0] * this.GRIDSIZE))
    },
    smallGridX () {
      return this.gridX * this.DIVISIONS
    },
    gridY () {
      return Math.round(this.config.height / (this.transform[0] * this.GRIDSIZE))
    },
    smallGridY () {
      return this.gridY * this.DIVISIONS
    }
  },
  data () {
    return {
      GRIDSIZE,
      DIVISIONS,
      transform: [1, 0, 0, 1, 0, 0]
    }
  },
  watch: {
    config: {
      deep: true,
      handler () {
        this.transform = this.$refs.grid.getNode().getAbsoluteTransform().m
      }
    }
  }
}
</script>
