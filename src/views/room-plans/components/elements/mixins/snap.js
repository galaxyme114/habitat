import { ROOMPLAN } from '@/store/mutation-types'
const snapTolerance = 5
const offset = {
  x: -1,
  y: -2
}

export default {
  data () {
    return {
      originalPosition: { x: null, y: null }
    }
  },
  methods: {
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
    }
  }
}
