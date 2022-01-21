<template>
  <div class="container w-100 px-0 px-lg-2">
    <b-breadcrumb>
      <b-breadcrumb-item href="/habitats"> Your Habitats </b-breadcrumb-item>
      <b-breadcrumb-item :href="`/habitats/${$route.params.habitatId}`">{{ $route.params.habitatName }}</b-breadcrumb-item>
      <b-breadcrumb-item active> Archived Projects </b-breadcrumb-item>
    </b-breadcrumb>
    <div v-if="loaded && archived.length">
      <ProjectPreview
        v-for="project in archived"
        :key="project.name"
        :project="project"
        @update-habitat="fetchArchived($route.params.habitatId)"
        @refresh="fetchArchived($route.params.habitatId)"
      />
    </div>
    <div v-else-if="loaded" id="no-inspiration" class="d-flex justify-content-center">
      <div class="d-flex flex-column align-items-center">
        <img :src="ContentPlaceholder" />
        <p>No Archived Projects</p>
      </div>
    </div>
  </div>
</template>
<script>
import { BBreadcrumb, BBreadcrumbItem } from 'bootstrap-vue'
import ContentPlaceholder from '@/assets/img/content-placeholder.png'
import api from '@/api'
import ProjectPreview from '@/components/views/ProjectPreview.vue'

export default {
  components: {
    BBreadcrumb,
    BBreadcrumbItem,
    ProjectPreview
  },
  data () {
    return {
      ContentPlaceholder,
      loaded: false
    }
  },
  methods: {
    async fetchArchived (id) {
      this.loaded = false
      try {
        this.archived = await api.projects.getArchived(id)
        console.log(this.archived)
        this.loaded = true
      } catch (e) {
        this.$toasted.error('Error loading archived projects')
      }
    },
    explore () {
      this.$router.push({ name: 'explore', params: { description: 'Find inspiration for your habitat' } })
    }
  },
  mounted () {
    this.fetchArchived(this.$route.params.habitatId)
  }
}
</script>
<style scoped>
.radius {
  border-radius: 16px !important;
}
.icon-add {
  position: absolute;
  right: 20px;
  top: 20px;
  padding: 5px;
  border-radius: 30px;
  z-index: 99;
  background-color: rgba(30, 33, 43, 0.5);
  width: 34px;
  transition: all 0.5s;
  align-self: center;
}
.icon-add:hover {
  background-color: #a7c7c5;
  cursor: pointer;
}
.bigger {
  width: 220px;
  background-color: white;
}
.alt-button {
  display: flex;
  justify-content: center;
  padding: 10px;
  border-radius: 12px;
  margin: 0px 10px 0px 10px;
  transition: transform 0.6s cubic-bezier(0.65, 0, 0.35, 1);
  background-color: #f26b6b;
  cursor: pointer;
  color: white;
}
.alt-button:hover {
  background-color: #ef4848;
}
.checkbox-padding {
  padding-top: 8px;
  padding-bottom: 5px;
}
.checkbox-active {
  background-color: #e9f4f3;
}
.checkbox-active label {
  font-weight: 700;
}
.bgImage {
  background-size: cover;
  background-position: center;
  height: 155px;
  width: 245px;
  z-index: 99;
}
.tagCard {
  margin: 10px;
}
.tagText {
  margin-top: 5px;
  text-transform: capitalize;
}
.pill-badge {
  height: 16px;
  width: 24px;
  color: #fff;
  background-color: #70a288;
  border-radius: 16px;
  font-size: 12px;
  margin-left: 10px;
  display: inline-block;
}
</style>
