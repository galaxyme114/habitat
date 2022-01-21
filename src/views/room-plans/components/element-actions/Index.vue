<template>
  <div id="element-actions">
    <component :is="actionComponent" :length="length" :element="element" :index="selectedElementIndex" @change-length="handleLengthChange" @delete-element="deleteElement"/>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { ROOMPLAN } from '@/store/mutation-types'

import Default from '@/views/room-plans/components/element-actions/Default'
import Wall from '@/views/room-plans/components/element-actions/Wall'
import Door from '@/views/room-plans/components/element-actions/Door'
import Cabinet from '@/views/room-plans/components/element-actions/Cabinet'

// TODO: abstract it into utillity and reuse in mutations
function dist (p1, p2) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
}

export default {
  props: {},
  components: {
    Default,
    Cabinet,
    Door,
    Wall
  },
  data () {
    return { isDragging: false }
  },
  computed: {
    ...mapState({
      selectedElementIndex: state => state.roomPlans.selectedElementIndex,
      selectedSegmentIndex: state => state.roomPlans.selectedSegmentIndex || 0,
      element: state => state.roomPlans.elements[state.roomPlans.selectedElementIndex],
      node () {
        return this.$parent.$refs.drawing.getNode().children[0].children[this.selectedElementIndex]
      },
      position (state) {
        // TODO: what if stage is scaled or moved?
        // position will be different
        const element = state.roomPlans.elements[this.selectedElementIndex]
        if (!element || !element.segments) {
          return { x: 0, y: 0 }
        }
        return element.segments[state.roomPlans.selectedSegmentIndex || 0]
      },
      length (state) {
        const element = state.roomPlans.elements[this.selectedElementIndex]
        if (!element || !element.segments || element.segments.length < 2) {
          return 0
        }
        const index = state.roomPlans.selectedSegmentIndex || 0
        const segment = [element.segments[index], element.segments[index + 1]]
        return Math.round(dist(...segment))
      }
    }),
    actionComponent () {
      switch (this.element.type) {
        case 'wall':
          return 'Wall'
        case 'door':
          return 'Door'
        case 'cabinet':
          return 'Cabinet'
        default:
          return 'Default'
      }
    }
  },
  methods: {
    deleteElement () {
      this.$store.commit(ROOMPLAN.ELEMENTS.DELETE)
    },
    handleLengthChange (e) {
      const length = parseFloat(e.target.value)
      const p1 = this.element.segments[this.selectedSegmentIndex]
      const p2 = this.element.segments[this.selectedSegmentIndex + 1]
      const x = p2.x - p1.x
      const y = p2.y - p1.y
      const radians = Math.atan2(y, x)

      const moved = {
        x: p1.x + Math.cos(radians) * length,
        y: p1.y + Math.sin(radians) * length
      }
      this.$store.commit(ROOMPLAN.WALLSEGMENT.UPDATE, {
        indexWall: this.selectedElementIndex,
        indexSegment: this.selectedSegmentIndex + 1,
        wallSegment: moved
      })
    }
  }
}
</script>
