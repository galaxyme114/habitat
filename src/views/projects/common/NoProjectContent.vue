<template>
  <div
    :style="{
      backgroundImage: `url(${NoProjectContent})`
    }"
    class="no-project-content"
  >
    <div class="add-content">
      <img :src="ContentPlaceholder" />
      <p>No content in this project yet</p>
      <b-button ref="no-content-button" variant="primary" @click="clicked" id="no-content-button" class="btn btn-rounded btn-primary alt-button"
        >Add Content</b-button
      >
    </div>
  </div>
</template>
<script>
import NoProjectContent from '@/assets/img/no-project-content.png'
import ContentPlaceholder from '@/assets/img/content-placeholder.png'
import { BButton } from 'bootstrap-vue'

export default {
  components: {
    BButton
  },
  data () {
    return {
      NoProjectContent,
      ContentPlaceholder
    }
  },
  methods: {
    handleNewProjectNavigation () {
      this.$router.push({ name: 'project-new' })
    },
    clicked () {
      this.$emit('onClick')
    }
  }
}
</script>
