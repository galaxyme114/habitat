<template>
  <div id="no-projects-container">
    <img :src="NoProjects" />
    <h3>Its time to create your first Habitat</h3>
    <button @click="handleNewHabitat" class="btn btn-rounded btn-primary">Create a new Habitat</button>
  </div>
</template>
<script>
import NoProjects from '@/assets/img/no-projects.png'

export default {
  data () {
    return {
      NoProjects
    }
  },
  methods: {
    handleNewHabitat () {
      this.$emit('newHabitat')
    }
  }
}
</script>
