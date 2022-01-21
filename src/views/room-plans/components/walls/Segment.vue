<template>
  <v-group :config="groupConfig" @click="handleClick">
    <!-- <v-line :config="configBottom"/> -->
    <!-- <v-rect :config="configRect"/> -->
    <v-line :config="configLine"/>
<!--    <v-line :config="configLine2"/>-->
    <v-group v-if="measuresEnabled" :config="configMeasureGroup">
      <v-line :config="configMeasureStart" />
      <v-line :config="configMeasureEnd" />
      <v-line :config="configMeasureLine" />
      <v-rect :config="configMeasureTextBackground" />
      <v-text :config="configMeasureText" />

<!--      <v-arc :config="configMeasureArc" />-->
<!--      <v-text :config="configMeasureArcText" />-->
    </v-group>

    <v-group v-if="this.indexSegment === 1" :visible="false">
      <v-circle :config="previousAnchorCircle"/>
      <v-circle :config="cornerCircle"/>
      <v-circle :config="anchorCircle"/>
    </v-group>
  </v-group>
</template>
<script>
import WALLCONSTANTS from './constants'
import { mapState } from 'vuex'
import {
  ROOMPLAN
} from '@/store/mutation-types'

const pixelsToMillimeters = px => (px * 10).toFixed(0)

const vectorAB = (a, b) => {
  return {
    x: b.x - a.x,
    y: b.y - a.y
  }
}
const magnitude = a => Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2))
const dot = (a, b) => (a.x * b.x) + (a.y * b.y)

const MEASURE_OFFSET = 40

export default {
  props: {
    indexWall: {
      required: true,
      type: Number
    },
    indexSegment: {
      required: true,
      type: Number
    },
    measuresEnabled: Boolean
  },
  data () {
    return {
      lineDefaults: {
        stroke: WALLCONSTANTS.COLOURS.GREY,
        strokeWidth: WALLCONSTANTS.STROKEWIDTH,
        lineCap: 'round'
      },
      rectDefaults: {
        strokeWidth: WALLCONSTANTS.STROKEWIDTH,
        cornerRadius: WALLCONSTANTS.BORDERRADIUS,
        stroke: WALLCONSTANTS.COLOURS.PINK,
        fill: WALLCONSTANTS.COLOURS.PINK,
        lineCap: 'round'
      },
      dragging: false
    }
  },
  computed: {
    ...mapState({
      wall (state) { return state.roomPlans.elements[this.indexWall] },
      dimensionUnits (state) {
        return state.roomPlans.dimensionUnits
      },
      dimensionUnitsMultiplier (state) {
        switch (state.roomPlans.dimensionUnits) {
          case 'm':
            return 0.01
          case 'cm':
            return 0.1
          case 'mm':
            return 1
        }
      }
    }),
    groupConfig () {
      return {
        listening: this.wall.config.isDrawing === false
        // opacity: 0.5
        // x: this.corner.x,
        // y: this.corner.y
      }
    },
    // The previous anchor corner
    previousAnchor () {
      if (this.indexSegment > 0) {
        return this.wall.segments[this.indexSegment - 1]
      }
      return this.wall.segments[this.indexSegment]
    },
    // The wall and corner rendered
    corner () {
      return this.wall.segments[this.indexSegment]
    },
    // The anchor corner after
    anchor () {
      // NOTE no actual closed loops at the moment
      // if (this.corner.connect) {
      //   // Closed loop
      //   if (this.indexSegment === 0) {
      //     return this.wall.segments[this.wall.segments.length - 1]
      //   }
      //   return this.wall.segments[this.indexSegment - 1]
      // }

      if (this.indexSegment < this.wall.segments.length - 1) {
        return this.wall.segments[this.indexSegment + 1]
      }

      return this.wall.segments[this.indexSegment]
    },

    /*
     * Length Dimensions/Measurement
     */
    length () {
      const x = this.anchor.x - this.corner.x
      const y = this.anchor.y - this.corner.y
      return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
    },
    measureAngleRadians () {
      const PI2 = Math.PI * 2
      const x = this.anchor.x - this.corner.x
      const y = this.anchor.y - this.corner.y
      const radians = (Math.atan2(y, x) + PI2) % PI2
      return radians
    },
    measureAngleDegrees () {
      return this.measureAngleRadians * 180 / Math.PI // Degrees
    },
    offsetCorner () {
      return {
        x: this.corner.x + MEASURE_OFFSET * Math.cos(this.measureAngleRadians - Math.PI / 2),
        y: this.corner.y + MEASURE_OFFSET * Math.sin(this.measureAngleRadians - Math.PI / 2)
      }
    },
    offsetAnchor () {
      return {
        x: this.anchor.x + MEASURE_OFFSET * Math.cos(this.measureAngleRadians - Math.PI / 2),
        y: this.anchor.y + MEASURE_OFFSET * Math.sin(this.measureAngleRadians - Math.PI / 2)
      }
    },
    configMeasureGroup () {
      return {
        x: this.offsetCorner.x,
        y: this.offsetCorner.y,
        rotation: this.measureAngleDegrees
      }
    },
    configMeasureStart () {
      return {
        points: [0, -20, 0, MEASURE_OFFSET],
        stroke: WALLCONSTANTS.COLOURS.PINK,
        strokeWidth: 1
      }
    },
    configMeasureEnd () {
      return {
        points: [this.length, -20, this.length, MEASURE_OFFSET],
        stroke: WALLCONSTANTS.COLOURS.PINK,
        strokeWidth: 1
      }
    },
    configMeasureLine () {
      return {
        points: [0, 0, this.length, 0],
        stroke: WALLCONSTANTS.COLOURS.PINK,
        strokeWidth: 1,
        fill: WALLCONSTANTS.COLOURS.PINK
      }
    },
    // TODO Text and background will need to hide at some threshold
    configMeasureTextBackground () {
      // TODO How to make the dimensions of this relative to the dimensions of the text
      return {
        width: this.length / 2,
        height: 20,
        y: -11,
        x: this.length / 4,
        fill: WALLCONSTANTS.COLOURS.PINK
      }
    },
    configMeasureText () {
      const reverse = this.measureAngleDegrees > 90 && this.measureAngleDegrees < 270

      return {
        width: this.length,
        align: 'center',
        fontSize: 14,
        fill: WALLCONSTANTS.COLOURS.WHITE,
        y: reverse ? 14 - 5 : -10,
        text: (pixelsToMillimeters(this.length) * this.dimensionUnitsMultiplier) + ' ' + this.dimensionUnits, // FOR Testing + ' ' + this.arcAngleDegrees.toFixed(2) + '°',
        x: reverse ? this.length : 0,
        scaleX: reverse ? -1 : 1,
        scaleY: reverse ? -1 : 1,
        height: 20,
        verticalAlign: 'middle'
      }
    },
    // configMeasureArrow () {
    //   return {
    //     points: [0, 0, this.length, 0],
    //     stroke: 'grey',
    //     strokeWidth: 1,
    //     pointerAtBeginning: true,
    //     y: -7,
    //     text: pixelsToMillimeters(this.length) + ' m',
    //     fill: WALLCONSTANTS.COLOURS.WHITE
    //   }
    // },

    /**
     * Arc angle between lines
     */
    ba () {
      return vectorAB(this.corner, this.previousAnchor)
    },
    bc () {
      return vectorAB(this.corner, this.anchor)
    },
    dot () {
      return dot(this.ba, this.bc)
    },
    arcTan2 () {
      return (Math.atan2(this.bc.y, this.bc.x) - Math.atan2(this.ba.y, this.ba.x)) * 180 / Math.PI
    },
    arcAngleRadians () {
      console.log(this.arcTan2)
      return Math.acos(this.dot / (magnitude(this.ba) * magnitude(this.bc)))
    },
    arcAngleDegrees () {
      return this.arcAngleRadians * 180 / Math.PI // Degrees
    },
    configMeasureArc () {
      const angle = this.arcAngleDegrees
      const reverse = this.arcTan2 > 0 && this.arcTan2 < 180

      return {
        angle: reverse ? 180 - angle : angle,
        rotation: reverse ? 180 : 0,
        stroke: WALLCONSTANTS.COLOURS.PINK,
        strokeWidth: 4,
        innerRadius: 50,
        outerRadius: 50,
        x: 0,
        y: 40,
        visible: !isNaN(angle)
      }
    },
    configMeasureArcText () {
      const angle = this.arcAngleDegrees

      return {
        width: 50,
        align: 'center',
        fontSize: 12,
        fill: WALLCONSTANTS.COLOURS.PINK,
        y: 60,
        x: -20,
        text: angle.toFixed(2) + '°',
        scaleX: 1,
        scaleY: 1,
        height: 20,
        verticalAlign: 'middle',
        visible: !isNaN(angle)
      }
    },

    // The wall segment
    configLine () {
      return {
        points: [this.corner.x, this.corner.y, this.anchor.x, this.anchor.y],
        ...this.lineDefaults
      }
    },
    configLine2 () {
      return {
        points: [this.corner.x, this.corner.y, this.anchor.x, this.anchor.y],
        stroke: WALLCONSTANTS.COLOURS.WHITE,
        strokeWidth: 2,
        lineCap: 'round'
      }
    },
    // configBottom () {
    //   return {
    //     x: this.corner.x,
    //     y: this.corner.y,
    //     points: [0, 0, this.anchor.x - this.corner.x, this.anchor.y - this.corner.y],
    //     ...this.lineDefaults
    //   }
    // },
    // configRect () {
    //   return {
    //     x: this.corner.x,
    //     y: this.corner.y,
    //     width: this.length + WALLCONSTANTS.THICKNESS,
    //     height: WALLCONSTANTS.THICKNESS,
    //     rotation: this.angle,
    //     offset: {
    //       x: WALLCONSTANTS.THICKNESS / 2,
    //       y: WALLCONSTANTS.THICKNESS / 2
    //     },
    //     ...this.rectDefaults
    //   }
    // },

    /**
     * Some Testing Stuff
     */
    previousAnchorCircle () {
      return {
        radius: WALLCONSTANTS.THICKNESS * 2,
        x: this.previousAnchor.x,
        y: this.previousAnchor.y,
        fill: '#009900'
      }
    },
    cornerCircle () {
      return {
        radius: WALLCONSTANTS.THICKNESS * 2,
        x: this.corner.x,
        y: this.corner.y,
        fill: '#990000'
      }
    },
    anchorCircle () {
      return {
        radius: WALLCONSTANTS.THICKNESS * 2,
        x: this.anchor.x,
        y: this.anchor.y,
        fill: '#000099'
      }
    }
  },
  methods: {
    handleClick () {
      this.$store.commit(ROOMPLAN.ELEMENTS.SELECT, { elementIndex: this.indexWall, segmentIndex: this.indexSegment })
    }
  }
}
</script>
