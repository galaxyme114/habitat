<template>
    <v-image :config="configImage" @dragend="dragEnd" @dragmove="handleDragMove" @click="handleClick" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave"/>
</template>
<script>
import { mapState } from 'vuex'
// import WALLCONSTANTS from '../walls/constants'
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
  data () {
    return {
      image: null
    }
  },
  computed: {
    ...mapState({
      element (state) {
        return state.roomPlans.elements[this.indexElement]
      },
      config (state) { return state.roomPlans.elements[this.indexElement].config },
      isSelected (state) { return state.roomPlans.selectedElementIndex === this.indexElement },
      configImage () {
        return {
          image: this.image,
          draggable: true,
          name: 'element',
          width: this.element.config.width,
          height: this.element.config.height,
          x: this.element.config.x,
          y: this.element.config.y
        }
      }
    })
  },
  methods: {
    dragEnd (e) {
      const pos = e.target.position()
      this.$store.commit(ROOMPLAN.ELEMENTS.UPDATE, {
        config: pos,
        index: this.indexElement
      })
    },
    handleClick () {
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
      console.log(pos)
      // e.target.position({ x: 0, y: 0 })
      // const firstSegment = this.element.segments[0]
      // const firstPos = {
      //   x: pos.x + firstSegment.x,
      //   y: pos.y + firstSegment.y
      // }
      // const corners = e.target.getStage().find('.corner')
      // corners.forEach(corner => {
      //   if (Math.abs(corner.x() - firstPos.x) < WALLCONSTANTS.SNAP_OFFSET) {
      //     firstPos.x = corner.x()
      //   }
      //   if (Math.abs(corner.y() - firstPos.y) < WALLCONSTANTS.SNAP_OFFSET) {
      //     firstPos.y = corner.y()
      //   }
      // })
      // const dx = firstPos.x - firstSegment.x
      // const dy = firstPos.y - firstSegment.y
      // e.target.move({ x: dx, y: dy })
    }
  },
  created () {
    console.log('CREATED SVG', this.element)
    const img = new window.Image()
    img.onload = () => {
      console.log('loaded img', img)
      this.image = img
    }
    img.src = this.element.src
  }
}
</script>
