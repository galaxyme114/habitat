<template>
  <v-group>
    <component v-for="(element, i) of elements" :ref="'element-' + i" :key="'element-' + i" :is="element.type" :index-element="i" :element="element" />
  </v-group>
</template>
<script>

import Wall from '@/views/room-plans/components/walls/Wall'
import Cabinet from '@/views/room-plans/components/elements/Cabinet'
import CabinetShape from '@/views/room-plans/components/elements/CabinetShape'
import SvgKonva from '@/views/room-plans/components/elements/SvgKonva'
import Door from '@/views/room-plans/components/elements/Door'

import { mapState } from 'vuex'

export default {
  components: {
    Wall,
    Cabinet,
    CabinetShape,
    SvgKonva,
    Door
  },
  computed: {
    ...mapState({
      elements: state => state.roomPlans.elements
    })
  }
}
</script>
