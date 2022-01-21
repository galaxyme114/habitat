<template>
  <v-group ref="walls" v-if="walls.length > 0">
    <wall v-for="i in walls.length" :key="'wall-' + i" :index-wall="i - 1"/>
  </v-group>
</template>
<script>
import Wall from '@/views/room-plans/components/walls/Wall'
import { mapState } from 'vuex'
// TODO Need to work out ui and functions for deleting and adding walls
export default {
  components: {
    Wall
  },
  computed: {
    ...mapState({
      walls: state => state.roomPlan.walls
    })
  }
}
</script>
