<template>
  <div class="card">
    <div class="card-header bg-light">
      <h1 class="h4 text-uppercase text-primary mb-0">Settings</h1>
    </div>
    <div class="card-body">
      <pre class="mb04">{{ habitat }}</pre>
      <button @click="deleteHabitat" class="btn btn-danger">Delete Habitat</button>
    </div>
  </div>
</template>
<script>
import api from '@/api'
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      habitat: state => state.habitats.current
    })
  },
  methods: {
    deleteHabitat () {
      if (confirm('Are you sure you want to delete this habitats?')) {
        api.habitats.delete(this.habitat.id)
      }
    }
  }
}
</script>
