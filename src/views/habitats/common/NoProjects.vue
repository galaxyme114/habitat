<template>
  <div id="no-projects-container">
    <img :src="NoProjects" />
    <h3>Its time to create your first Project</h3>
    <p>Feeling inspired? Bring your idea to life with your project.</p>
    <button @click="handleNewProjectNavigation" class="btn btn-rounded btn-primary">Create a new Project</button>
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
    handleNewProjectNavigation () {
      this.$router.push({ name: 'project-new' })
    }
  }
}
</script>
