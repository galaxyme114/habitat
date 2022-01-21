<template>
    <v-group>
      <v-image :config="configImage" @dragend="dragEnd" @transformEnd="transformEnd" @dragmove="handleDragMove" @click="handleClick" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" ref="image"/>
    </v-group>
</template>
<script>
import { mapState } from 'vuex'
import WALLCONSTANTS from '../walls/constants'
import {
  ROOMPLAN
} from '@/store/mutation-types'

export default {
  components: {
  },
  props: {
    indexElement: {
      required: true,
      type: Number
    }
  },
  data: () => {
    return {
      image: null
    }
  },
  computed: {
    ...mapState({
      element (state) { return state.roomPlans.elements[this.indexElement] },
      segments (state) { return state.roomPlans.elements[this.indexElement].segments },
      isSelected (state) { return state.roomPlans.selectedElementIndex === this.indexElement },
      configImage () {
        return {
          width: this.element.config.width,
          height: this.element.config.height,
          rotation: this.element.config.rotation,
          image: this.image,
          // stroke: 'black',
          draggable: true,
          name: 'element',
          x: this.element.segments[0].x,
          y: this.element.segments[0].y
        }
      },
      configTransformer () {
        return {
          enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
          boundBoxFunc: (oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox
            }
            return newBox
          }
        }
      },
      p0 () {
        return this.segments[0]
      },
      p1 () {
        return this.segments[1]
      },
      length () {
        const x = this.p0.x - this.p1.x
        const y = this.p0.y - this.p1.y
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
      },
      angle () {
        const PI2 = Math.PI * 2
        const x = this.p1.x - this.p0.x
        const y = this.p1.y - this.p0.y
        const radians = (Math.atan2(y, x) + PI2) % PI2
        const deg = radians * 180 / Math.PI
        return deg
      }
    })
  },
  created () {
    const img = new window.Image()
    img.onload = () => {
      this.image = img
    }
    img.src = this.element.src
  },
  watch: {
    // isSelected () {
    //   debugger
    //   if (this.isSelected) {
    //     this.$refs.tr.getNode().nodes([this.$refs.image.getNode()])
    //   } else {
    //     this.$refs.tr.getNode().nodes([])
    //   }
    //   this.$refs.tr.getNode().getLayer().batchDraw()
    // }
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
      const scale = e.target.scaleX()
      e.target.scale({ x: 1, y: 1 })
      // e.target.position({ x: 0, y: 0 })
      this.$store.commit(ROOMPLAN.ELEMENTS.UPDATE, {
        config: {
          segments: [pos],
          config: {
            width: e.target.width() * scale,
            height: e.target.height() * scale,
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
