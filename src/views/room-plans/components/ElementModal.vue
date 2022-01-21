<template>
  <div class="element-modal" :style="modalStyle">
    <input :value="length" v-if="element.segments.length > 1" type="number" @change="handleLengthChange"/>
    <br />
    <button class="btn btn-outline-primary" @click="remove">Delete</button>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { ROOMPLAN } from '@/store/mutation-types'

// TODO: abstract it into utillity and reuse in mutations
function dist (p1, p2) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
}

export default {
  components: {},
  props: {},
  data () {
    return { isDragging: false }
  },
  computed: {
    ...mapState({
      selectedSegmentIndex (state) {
        return state.roomPlans.selectedSegmentIndex || 0
      },
      selectedElementIndex (state) { return state.roomPlans.selectedElementIndex },
      element (state) {
        return state.roomPlans.elements[this.selectedElementIndex]
      },
      pos (state) {
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
        if (!element || !element.segments) {
          return 0
        }
        const index = state.roomPlans.selectedSegmentIndex || 0
        const segment = [element.segments[index], element.segments[index + 1]]
        return Math.round(dist(...segment))
      },
      node () {
        return this.$parent.$refs.drawing.getNode().children[0].children[this.selectedElementIndex]
      },
      modalStyle () {
        console.log('modalStyle', this.element, this.node.x(), this.node.y())
        return { left: this.pos.x + this.element.config.width + 20 + 'px', top: this.pos.y + 'px' }
      }
    })
  },
  methods: {
    remove () {
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

<style scoped>
.element-modal {
  position: absolute;
  top: 100px;
  left: 100px;
  padding: 10px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}
</style>
