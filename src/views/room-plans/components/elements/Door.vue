<template>
  <v-group :config="configGroup" @dragstart="dragStart" @dragmove="dragMove" @dragend="dragEnd" @click="handleClick" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" @transformend="transformEnd">
    <v-rect :config="configRect "/>
    <v-image :config="configImage" />
  </v-group>
</template>
<script>
import { mapState } from 'vuex'
import { ROOMPLAN } from '@/store/mutation-types'
const snapTolerance = 5
const offset = {
  x: -1,
  y: -2
}

export default {
  props: {
    indexElement: {
      required: true,
      type: Number
    }
  },
  data () {
    return {
      image: null,
      originalPosition: { x: null, y: null }
    }
  },
  computed: {
    ...mapState({
      element (state) {
        return state.roomPlans.elements[this.indexElement]
      },
      config (state) { return state.roomPlans.elements[this.indexElement].config },
      isSelected (state) { return state.roomPlans.selectedElementIndex === this.indexElement },
      configGroup () {
        return {
          draggable: true,
          name: 'element',
          width: this.element.config.width,
          height: this.element.config.height,
          x: this.element.config.x,
          y: this.element.config.y,
          offsetX: offset.x,
          offsetY: offset.y,
          rotation: this.element.config.rotation
        }
      },
      configImage () {
        return {
          image: this.image,
          width: this.element.config.width,
          height: this.element.config.height,
          x: 0,
          y: 0
        }
      },
      configRect () {
        return {
          width: this.element.assetConfig.box.width,
          height: this.element.assetConfig.box.height,
          x: this.element.assetConfig.box.x,
          y: this.element.assetConfig.box.y,
          fill: '#ffffff'
          // stroke: '#009900',
          // strokeWidth: 1
        }
      }
    })
  },
  methods: {
    handleClick (e) {
      e.cancelBubble = true
      console.log('door click')
      this.$store.commit(ROOMPLAN.ELEMENTS.SELECT, { elementIndex: this.indexElement })
    },
    handleMouseEnter (e) {
      this.$store.commit(ROOMPLAN.CURSORS.GRAB)
    },
    handleMouseLeave (e) {
      this.$store.commit(ROOMPLAN.CURSORS.DEFAULT)
    },
    dragStart (e) {
      this.$store.commit(ROOMPLAN.CURSORS.GRABBING)
    },
    snap (e) {
      const point = e.target.position()
      const delta = {
        x: this.originalPosition.x - point.x,
        y: this.originalPosition.y - point.y
      }

      // snap to snapTolerance
      if (delta.x > 0) {
        point.x = Math.ceil(point.x / snapTolerance) * snapTolerance
      } else {
        point.x = Math.floor(point.x / snapTolerance) * snapTolerance
      }

      if (delta.y > 0) {
        point.y = Math.ceil(point.y / snapTolerance) * snapTolerance
      } else {
        point.y = Math.floor(point.y / snapTolerance) * snapTolerance
      }

      this.originalPosition = point
      return point
    },
    dragMove (e) {
      // TODO: move all snap functions into one utility mixin
      // NOTE need to calculate the delta position in order to work out whether to snap up or down so that jiggling disappears
      const point = this.snap(e)
      e.target.position(point)
    },
    dragEnd (e) {
      this.$store.commit(ROOMPLAN.CURSORS.GRAB)
      const point = this.snap(e)

      this.$store.commit(ROOMPLAN.ELEMENTS.UPDATE, {
        index: this.indexElement,
        config: point,
        segments: [point]
      })
    },

    transformEnd (e) {
      console.log('transformEnd', e)
      const config = e.target.attrs
      this.$store.commit(ROOMPLAN.ELEMENTS.UPDATE, {
        index: this.indexElement,
        config: config,
        segments: [{ x: config.x, y: config.y }]
      })
    }
  },
  created () {
    const img = new window.Image()
    img.onload = () => {
      console.log('loaded img', img)
      this.image = img
    }
    img.src = this.element.src
    this.originalPosition.x = this.config.x
    this.originalPosition.y = this.config.y
  }
}
</script>
