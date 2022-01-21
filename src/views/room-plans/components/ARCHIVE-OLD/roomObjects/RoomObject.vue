<template>
    <v-group @dragend="dragEnd" @transformEnd="transformEnd" @dragmove="handleDragMove" @click="handleClick" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave"  :config="{ x: element.segments[0].x, y: element.segments[0].y, draggable: true, name: 'element', scaleX: element.config.width / 100, scaleY: element.config.height / 100 }"  ref="image">
      <component :is="element.objectName" :element="element"/>
    </v-group>
<!--    <v-transformer ref="transformer" :config="configTransformer" />-->
</template>
<script>

import { mapState } from 'vuex'

import ThpaWindowAwning01 from './thpa-window-awning-01'

import WALLCONSTANTS from '../walls/constants'
import {
  ROOMPLAN
} from '@/store/mutation-types'

export default {
  props: {
    element: {
      required: true
    },
    indexElement: {
      required: true,
      type: Number
    }
  },
  components: {
    ThpaWindowAwning01
  },
  computed: {
    ...mapState({
      segments (state) { return state.roomPlans.elements[this.indexElement].segments },
      isSelected (state) {
        const isSelected = state.roomPlans.selectedElementIndex === this.indexElement
        // if (isSelected) {
        //   this.$refs.transformer.getNode().nodes([this.$refs.group.getNode()])
        // } else {
        //   this.$refs.transformer.getNode().nodes([])
        // }
        // this.$refs.transformer.getNode().getLayer().batchDraw()
        return isSelected
      },
      configTransformer () {
        return {
          rotationSnaps: [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 185, 300, 315, 330, 345],
          rotationSnapTolerance: 5,
          enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
          // enabledAnchors: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right']
          // boundBoxFunc: (oldBox, newBox) => {
          //   if (newBox.width < 5 || newBox.height < 5) {
          //     return oldBox
          //   }
          //   return newBox
          // }
        }
      }
    })
  },
  methods: {
    dragEnd (e) {
      const pos = e.target.position()
      // e.target.position({ x: 0, y: 0 })
      this.$store.commit(ROOMPLAN.ELEMENTS.UPDATE, {
        config: {
          segments: [pos]
        },
        index: this.indexElement
      })
      // this.$store.commit(ROOMPLAN.ELEMENTS.SNAP, {
      //   index: this.indexElement
      // })
    },
    transformEnd (e) {
      const pos = e.target.position()
      const scaleX = e.target.scaleX()
      const scaleY = e.target.scaleY()
      e.target.scale({ x: 1, y: 1 })
      // e.target.position({ x: 0, y: 0 })
      this.$store.commit(ROOMPLAN.ELEMENTS.UPDATE, {
        config: {
          segments: [pos],
          config: {
            width: 100 * scaleX,
            height: 100 * scaleY,
            rotation: e.target.rotation()
          }
        },
        index: this.indexElement
      })
      // this.$store.commit(ROOMPLAN.ELEMENTS.SNAP, {
      //   index: this.indexElement
      // })
    },
    handleClick (e) {
      // NOTE Can handle selection and transoformation here or in the index
      this.$store.commit(ROOMPLAN.ELEMENTS.SELECT, { elementIndex: this.indexElement })
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
