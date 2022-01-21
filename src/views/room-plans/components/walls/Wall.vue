<template>
  <v-group :ref="'wall-' + indexElement" :config="groupConfig" @dragstart="groupDragStart" @dragMove="groupDragMove" @dragend="groupDragEnd">
    <segment v-for="i in segments - 1" :key="'segment-' + indexElement + '-' + (i - 1)" :index-wall="indexElement" :index-segment="i - 1" :measuresEnabled="measuresEnabled" />
    <corner v-for="i in segments" :key="'corner-' + indexElement + '-' + (i - 1)" :index-wall="indexElement" :index-segment="i - 1" :dragStart="handleDragStart"  :dragEnd="handleDragEnd"/>
  </v-group>
</template>
<script>
import Corner from '@/views/room-plans/components/walls/Corner'
import Segment from '@/views/room-plans/components/walls/Segment'
import { mapState } from 'vuex'
import { ROOMPLAN } from '@/store/mutation-types'
export default {
  components: {
    Corner,
    Segment
  },
  props: {
    indexElement: {
      required: true,
      type: Number
    }
  },
  data () {
    return {
      isDragging: false,
      isDraggingGroup: false,
      dragDelta: []
    }
  },
  computed: {
    ...mapState({
      wall (state) { return state.roomPlans.elements[this.indexElement] }
    }),
    groupConfig () {
      return {
        name: 'element',
        draggable: this.wall.config.isDrawing === false
      }
    },
    segments () {
      console.log('SEGMENTS', this.wall, this.wall.segments.length)
      return this.wall.segments.length
    },
    measuresEnabled () {
      return this.isDragging || this.wall.config.isDrawing !== false
    },
    node () {
      return this.$refs['wall-' + this.indexElement].getNode()
    }
  },
  methods: {
    handleDragStart () {
      this.isDragging = true
    },
    handleDragEnd () {
      this.isDragging = false
    },

    groupDragStart () {
      this.isDraggingGroup = true
      this.dragDelta[0] = this.node.getPosition()
    },
    groupDragMove (e) {
      console.log('drag wall group', e)
      const position = this.node.getPosition()

      position.x = Math.round(position.x)
      position.y = Math.round(position.y)

      // reset position manually
      this.node.position(position)

      // // update state
      // this.$store.commit(ROOMPLAN.WALLS.UPDATE, {
      //   wallSegment: {
      //     x: position.x,
      //     y: position.y
      //   },
      //   indexWall: this.indexElement,
      //   indexSegment: this.indexSegment
      // })
    },
    groupDragEnd () {
      this.isDraggingGroup = false
      this.dragDelta[1] = this.node.getPosition()
      this.node.position(this.dragDelta[0])

      this.$store.commit(ROOMPLAN.WALLS.UPDATE, {
        index: this.indexElement,
        delta: this.dragDelta
      })
    }
  }
}
</script>
