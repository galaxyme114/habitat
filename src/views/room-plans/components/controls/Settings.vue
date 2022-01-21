<template>
  <div>
    <div class="form-group">
      <select class="form-control" v-model="dimensionUnits">
        <option value="mm">Millimetres</option>
        <option value="cm">Centimetres</option>
        <option value="m">Metres</option>
      </select>
    </div>
  </div>
</template>
<script>
import { ROOMPLAN } from '@/store/mutation-types'

export default {
  computed: {
    dimensionUnits: {
      get () {
        return this.$store.state.roomPlans.dimensionUnits
      },
      set (units) {
        this.$store.commit(ROOMPLAN.DIMENSIONUNITS.SET, units)
      }
    }
  }
}
</script>
