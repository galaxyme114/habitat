<template>
  <v-group :config="{ draggable: true, name: 'element' }" @dragend="dragEnd" @dragmove="handleDragMove" @click="handleClick" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <v-line :config="{ points: segments.map(p => [p.x, p.y]).flat(), stroke: isSelected ? 'red' : 'black', strokeWidth: 15 }"/>
    <v-line :config="{ points: segments.map(p => [p.x, p.y]).flat(), stroke: 'white', strokeWidth: 10 }"/>
    <!-- <v-line :config="{ points: segments.map(p => [p.x, p.y]).flat(), stroke: 'black', strokeWidth: 20 }"/> -->
  </v-group>
</template>
<script>
import { mapState } from 'vuex'
import WALLCONSTANTS from '../walls/constants'
import {
  ROOMPLAN
} from '@/store/mutation-types'

export default {
  props: {
    indexElement: {
      required: true,
      type: Number
    }
  },
  computed: {
    ...mapState({
      segments (state) { return state.roomPlans.elements[this.indexElement].segments },
      isSelected (state) { return state.roomPlans.selectedElementIndex === this.indexElement }
    })
  },
  methods: {
    handleClick (e) {
      this.$store.commit(ROOMPLAN.ELEMENTS.SELECT, { elementIndex: this.indexElement })
    },
    dragEnd (e) {
      const pos = e.target.position()
      e.target.position({ x: 0, y: 0 })
      this.$store.commit(ROOMPLAN.ELEMENTS.UPDATE, {
        config: {
          segments: this.segments.map(p => ({ x: p.x + pos.x, y: p.y + pos.y }))
        },
        index: this.indexElement
      })
      this.$store.commit(ROOMPLAN.ELEMENTS.SNAP, {
        index: this.indexElement
      })
    },
    handleMouseEnter (e) {
      e.target.getStage().container().style.cursor = 'pointer'
    },
    handleMouseLeave (e) {
      e.target.getStage().container().style.cursor = ''
    },
    handleDragMove (e) {
      // TODO: move all snap functions into one utility file
      const pos = e.target.position()
      e.target.position({ x: 0, y: 0 })
      const firstSegment = this.segments[0]
      const firstPos = {
        x: pos.x + firstSegment.x,
        y: pos.y + firstSegment.y
      }
      const corners = e.target.getStage().find('.corner')
      corners.forEach(corner => {
        if (Math.abs(corner.x() - firstPos.x) < WALLCONSTANTS.SNAP_OFFSET) {
          firstPos.x = corner.x()
        }
        if (Math.abs(corner.y() - firstPos.y) < WALLCONSTANTS.SNAP_OFFSET) {
          firstPos.y = corner.y()
        }
      })
      const dx = firstPos.x - firstSegment.x
      const dy = firstPos.y - firstSegment.y
      e.target.move({ x: dx, y: dy })
    }
  }
}
</script>
