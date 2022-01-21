<template>
  <v-group @click="$emit('click', $event)">
    <v-circle :config="circleBackgroundConfig"/>
    <v-circle :config="circleConfig"/>
    <v-group>
      <v-line :config="verticalLineConfig" v-if="config.add"/>
      <v-line :config="horizontalLineConfig"/>
    </v-group>
  </v-group>
</template>
<script>
export default {
  props: {
    config: {
      required: true,
      type: Object,
      default () {
        return {
          add: true,
          size: 100,
          x: 0,
          y: 0,
          stroke: '#1E212B',
          fill: '#ffffff'
        }
      }
    }
  },
  computed: {
    circleBackgroundConfig () {
      // This is for the hover
      return {
        x: this.config.x,
        y: this.config.y,
        radius: this.config.size
      }
    },
    circleConfig () {
      return {
        x: this.config.x,
        y: this.config.y,
        radius: this.config.size / 2,
        strokeWidth: 2,
        stroke: this.config.stroke,
        fill: this.config.fill
      }
    },
    verticalLineConfig () {
      return {
        x: this.config.x,
        y: this.config.y,
        points: [-this.config.size / 2 + this.config.size / 6, 0, this.config.size / 2 - this.config.size / 6, 0],
        strokeWidth: 2,
        stroke: this.config.stroke,
        fill: this.config.fill
      }
    },
    horizontalLineConfig () {
      return {
        x: this.config.x,
        y: this.config.y,
        points: [0, -this.config.size / 2 + this.config.size / 6, 0, this.config.size / 2 - this.config.size / 6],
        strokeWidth: 2,
        stroke: this.config.stroke,
        fill: this.config.fill
      }
    }
  }
}
</script>
