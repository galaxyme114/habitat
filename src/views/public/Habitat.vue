<template>
  <div class="container">
    <div class="title-box">
      <p class="habitat-address">{{ habitat && habitat.address ? habitat.address.fullAddress : '' }}</p>
      <div class="d-flex justify-content-between">
        <h1 :style="{ paddingLeft: '16px' }">{{ habitat.name }}</h1>
      </div>
      <div class="pills-container d-flex">
        <!-- TODO Move the pill to its own component and populate with data from server -->
        <div class="pill">
          <div
            class="d-flex justify-content-between align-items-center"
            @click="$router.push({ name: 'habitat-inspiration', params: { habitatId: habitat.id, type: 'images' } })"
          >
            <span class="mr-1">
              <stream-line-icon :icon="ColorsPainting.ColorPaletteSample1" stroke="grey" :size="20" />
            </span>
            Images
            <span class="pill-badge d-flex align-items-center justify-content-center ml-5">{{ imageNo }}</span>
          </div>
        </div>
        <div class="pill">
          <div
            class="d-flex justify-content-between align-items-center"
            @click="$router.push({ name: 'habitat-inspiration', params: { habitatId: habitat.id, type: 'resources' } })"
          >
            <span class="mr-1">
              <stream-line-icon :icon="ColorsPainting.ColorPaletteSample1" stroke="grey" :size="20" />
            </span>
            Resources
            <span class="pill-badge d-flex align-items-center justify-content-center ml-5">{{ resourceNo }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!habitat.projects.length" id="no-projects-container">
      <img :src="NoProjects" />
      <h3>No Projects</h3>
      <p>This Habitat has no public projects</p>
    </div>
    <PublicHabitatProjectPreview v-else v-for="project in habitat.projects" :key="project.name" :project="project" />
  </div>
</template>
<script>
import api from '@/api'
import { mapState } from 'vuex'
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import Settings from '@streamlinehq/streamline-regular/lib/interface-essential/Settings'
import ColorsPainting from '@streamlinehq/streamline-regular/lib/design/ColorsPainting'
import PublicHabitatProjectPreview from '@/components/views/previews/PublicHabitatProjectPreview'
import NoProjects from '@/assets/img/no-projects.png'

export default {
  components: {
    StreamLineIcon,
    PublicHabitatProjectPreview
  },
  data () {
    return {
      ColorsPainting,
      Settings,
      NoProjects,
      habitat: {
        projects: [],
        address: {
          fullAddress: ''
        }
      },
      fetched: false,
      showHabitatSettingsModal: false,
      imageNo: 0,
      resourceNo: 0
    }
  },
  computed: {
    ...mapState({
      iconColour: state => {
        if (state.auth.user === null || state.auth.user.theme === 'light') {
          return '#000000'
        }

        return '#ffffff'
      },
      headers: state => {
        return { Authorization: 'Bearer ' + state.auth.tokens.access.token }
      },
      userId: state => state.auth.user.id
    })
  },
  methods: {
    async fetchHabitat (id) {
      try {
        const response = await api.publicApi.getHabitat(id)
        this.habitat = response.data
        this.fetched = true
      } catch (error) {
        console.log(error)
      }
    },
    async fetchInspiration (id) {
      try {
        const response = await api.habitats.getInspiration(id)
        this.imageNo = response.items.filter(item => item.type === 'image').length
        this.resourceNo = response.items.filter(item => item.type !== 'image').length
      } catch (error) {
        console.log(error)
      }
    }
  },
  mounted () {
    this.fetchHabitat(this.$route.params.habitatId)
    // this.fetchInspiration(this.$route.params.habitatId)
  }
}
</script>
