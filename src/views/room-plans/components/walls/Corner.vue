<template>
  <v-group ref="corner" :config="groupConfig" @mouseover="hover = true" @mouseout="hover = false" @dragstart="dragging = true" @dragMove="dragMove" @dragend="handleDragEnd">
    <v-rect ref="rect" :config="rect"/>
    <v-line ref="lines" v-for="i in 3" :key="'line-' + i" :config="lineConfig(i)"/>
    <v-group ref="icons" :config="iconGroupConfig" @click="addCorner">
      <icon-add-remove :config="addConfig" />
    </v-group>
  </v-group>
</template>
<script>
import Konva from 'konva'
import { mapState } from 'vuex'
import WALLCONSTANTS from './constants'
import {
  ROOMPLAN
} from '@/store/mutation-types'

import iconAddRemove from '@/views/room-plans/components/icons/AddRemove.vue'
// import { cloneDeep } from 'lodash'

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
    dragStart: {
      required: true,
      type: Function
    },
    dragEnd: {
      required: true,
      type: Function
    }
  },
  components: {
    iconAddRemove
  },
  data () {
    return {
      hover: false,
      dragging: false,
      rect: {
        width: WALLCONSTANTS.THICKNESS,
        height: WALLCONSTANTS.THICKNESS,
        x: 0,
        y: 0,
        stroke: WALLCONSTANTS.COLOURS.GREY,
        strokeWidth: WALLCONSTANTS.STROKEWIDTH / 10,
        cornerRadius: WALLCONSTANTS.BORDERRADIUS,
        fill: WALLCONSTANTS.COLOURS.WHITE,
        offsetX: WALLCONSTANTS.THICKNESS / 2,
        offsetY: WALLCONSTANTS.THICKNESS / 2
      },
      anim: null
    }
  },
  computed: {
    ...mapState({
      wall (state) { return state.roomPlans.elements[this.indexWall] },
      isStart () { return this.wall.segments.length === 1 },
      isDrawingWall (state) { return state.roomPlans.drawingMode === 'wall' }
    }),
    segment () { return this.wall.segments[this.indexSegment] },
    isFirst () { return this.indexSegment === 0 },
    isLast () { return this.wall.segments.length - 1 === this.indexSegment },
    isEdge () { return this.isLast || this.isFirst },
    groupConfig () {
      console.log('WALL', this.wall, this.isDrawingWall)
      return {
        // opacity: 0.5,
        name: 'corner',
        x: this.segment.x,
        y: this.segment.y,
        draggable: true
        // listening: this.isDrawingWall || (this.wall.config.isDrawing === true && this.isEdge)
      }
    },
    node () {
      return this.$refs.corner.getNode()
    },
    iconGroupConfig () {
      const showIcon = this.isDrawingWall && this.wall.config.isDrawing !== 'start' && this.wall.config.isDrawing !== 'end' && this.isEdge
      return {
        visible: showIcon,
        listening: showIcon
      }
    },
    addConfig () {
      return {
        size: 30,
        stroke: WALLCONSTANTS.COLOURS.PINK,
        fill: '#ffffff',
        add: true
      }
    }
  },
  methods: {
    lineConfig (i) {
      return {
        width: WALLCONSTANTS.THICKNESS * 0.2,
        height: WALLCONSTANTS.THICKNESS * 0.2,
        x: WALLCONSTANTS.THICKNESS * 0.2,
        y: (WALLCONSTANTS.THICKNESS * 0.25) + (WALLCONSTANTS.THICKNESS * 0.5 / 2) * (i - 1),
        stroke: WALLCONSTANTS.COLOURS.GREY,
        strokeWidth: WALLCONSTANTS.STROKEWIDTH / 10,
        points: [0, 0, WALLCONSTANTS.THICKNESS * 0.6, 0],
        lineCap: 'round',
        offsetX: WALLCONSTANTS.THICKNESS / 2,
        offsetY: WALLCONSTANTS.THICKNESS / 2
      }
    },
    dragMove () {
      const position = this.node.getPosition()
      const corners = this.node.getStage().find('.corner')
      corners.forEach(corner => {
        if (corner === this.node) {
          return
        }
        if (Math.abs(corner.x() - position.x) < WALLCONSTANTS.SNAP_OFFSET) {
          position.x = corner.x()
        }
        if (Math.abs(corner.y() - position.y) < WALLCONSTANTS.SNAP_OFFSET) {
          position.y = corner.y()
        }
      })
      // reset position manually
      this.node.position(position)
      // update state
      this.$store.commit(ROOMPLAN.WALLSEGMENT.UPDATE, {
        wallSegment: {
          x: position.x,
          y: position.y
        },
        indexWall: this.indexWall,
        indexSegment: this.indexSegment
      })
    },
    handleDragEnd () {
      this.dragging = false
      this.$store.commit(ROOMPLAN.HISTORY.SAVE)
    },
    addCorner (e) {
      console.log('addCorner')
      e.cancelBubble = true
      const wallSegment = e.currentTarget.getAbsolutePosition(e.currentTarget.getStage())
      let isDrawing = 'end'
      let indexSegment = this.wall.segments.length
      if (!this.isStart && this.isFirst) {
        isDrawing = 'start'
        indexSegment = 0
      }
      this.$store.commit(ROOMPLAN.ELEMENTS.UPDATE, {
        index: this.indexWall,
        config: {
          isDrawing: isDrawing
        }
      })
      this.$store.commit(ROOMPLAN.WALLSEGMENT.ADD, {
        indexWall: this.indexWall,
        indexSegment,
        wallSegment
      })
    }
  },
  watch: {
    hover (val) {
      const rect = this.$refs.rect.getNode()
      const lines = this.$refs.lines
      const anim = {
        node: rect,
        duration: WALLCONSTANTS.HOVERDURATION,
        easing: Konva.Easings.EaseInOut,
        stroke: WALLCONSTANTS.COLOURS.GREY
      }
      let cursor = ROOMPLAN.CURSORS.DEFAULT
      if (val) {
        cursor = ROOMPLAN.CURSORS.GRAB
        anim.stroke = WALLCONSTANTS.COLOURS.PINK
      }

      this.$store.commit(cursor)
      const tween = new Konva.Tween(anim)
      tween.play()

      lines.forEach(line => {
        anim.node = line.getNode()
        const tween = new Konva.Tween(anim)
        tween.play()
      })
    },
    dragging (val) {
      let cursor = ROOMPLAN.CURSORS.GRAB
      if (val) {
        cursor = ROOMPLAN.CURSORS.GRABBING
      }
      if (val) {
        this.dragStart()
      } else {
        this.dragEnd()
      }
      this.$store.commit(cursor)
    }
  }
}
</script>
