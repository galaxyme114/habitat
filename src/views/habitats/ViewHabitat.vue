<template>
  <div class="entry habitat-landing-template ">
    <div class="container">
      <div class="d-flex justify-content-between align-items-end">
        <div class="entry-header">
          <!-- <b-breadcrumb>
            <b-breadcrumb-item href="/habitats">My Habitats </b-breadcrumb-item>
            <b-breadcrumb-item active>{{ habitat.name }}</b-breadcrumb-item>
          </b-breadcrumb> -->

          <b-button variant="link" href="/habitats/" class="btn-back ">&lt; back to Habitats</b-button>

          <div class="d-flex align-items-end">
            <div class="hero-image" v-if="habitat.moodboard.images.length > 0">
              <b-img v-bind="mainProps" left :src="habitat.moodboard.images[0].url" rounded></b-img>
            </div>
            <div>
              <h2>{{ habitat.name }}</h2>
              <small class="habitat-address">{{ habitat && habitat.address ? habitat.address.fullAddress : '' }}</small>
            </div>
          </div>
        </div>
        <div>
          <!-- <pre>{{ habitat.owners }}</pre> -->
          <!-- <div class="py-2 px-2">
            <b-avatar-group size="34px">
              <b-avatar
                v-for="(owner, i) in habitat.owners"
                :id="`${habitat.id}-owner-${i}`"
                :key="`${habitat.id}-owner-${i}`"
                variant="primary"
                v-b-tooltip.hover
                :title="owner.fullName"
                :src="owner.image.url"
              >
              </b-avatar>
              <b-avatar
                variant="info"
                v-for="(user, i) in habitat.users"
                :key="`userImage${i}`"
                :id="`${habitat.id}-userImage-${i}`"
                v-b-tooltip.hover
                :title="user.fullName"
                :src="user.image.url"
              ></b-avatar>
            </b-avatar-group>
          </div> -->
          <b-button variant="light" id="settings-button" @click="showHabitatSettingsModal = true">
            <b-icon-gear></b-icon-gear
          ></b-button>
        </div>
      </div>
    </div>

    <div class="container ">
      <!-- <div class="title-box"> -->
      <!--  <div class="pills-container d-flex">
          TODO Move the pill to its own component and populate with data from server
          <div class="pill">
            <div
              class="d-flex justify-content-between align-items-center"
              @click="$router.push({ name: 'habitat-inspiration', params: { habitatId: habitat.id, type: 'images' } })"
            >
              <span class="mr-1">
                <stream-line-icon :icon="ColorsPainting.ColorPaletteSample1" stroke="grey" :size="20" />
              </span>
              Images
              <span class="pill-badge d-flex align-items-center justify-content-center ml-2 ml-md-5">{{ imageNo }}</span>
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
              <span class="pill-badge d-flex align-items-center justify-content-center ml-2 ml-md-5">{{ resourceNo }}</span>
            </div>
          </div>
          <div class="pill">
            <div
              class="d-flex justify-content-between align-items-center"
              @click="
                $router.push({ name: 'archived-projects', params: { habitatId: habitat.id, habitatName: habitat.name } })
              "
            >
              <span class="mr-1">
                <stream-line-icon :icon="ColorsPainting.ColorPaletteSample1" stroke="grey" :size="20" />
              </span>
              Archived
              <span class="pill-badge d-flex align-items-center justify-content-center ml-2 ml-md-5">{{ archivedNo }}</span>
            </div>
          </div>
        </div>-->
      <!-- </div> -->
      <hr class="my-4" />

      <div class="row justify-content-between mb-2">
        <div class="col">
          <h4 class="">Projects</h4>
        </div>
        <div class="col text-right">
          <b-button ref="no-content-button" variant="outline-primary" @click="handleCreateClick()"
            >+ Create Project</b-button
          >
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col">
          <div class="filter-bar ">
            <div class="content-types">
              <!-- <span class="icon-border">
                <div class="d-flex align-items-center" @click="focus">
                  <stream-line-icon :height="16" :width="16" :icon="Search.Search" :stroke="iconColour" />
                </div>
                <input
                  class="default"
                  placeholder="Enter Keywords"
                  v-model="search"
                  @focus="focused = true"
                  @blur="focused = false"
                  :class="{ focused: !!search }"
                  ref="searchRef"
                />
                <div @click="search = null" :class="{ show: !!search }" class="clear" :style="{ display: 'none' }">
                  <stream-line-icon :height="16" :width="16" :icon="Delete.Delete1" :stroke="iconColour" />
                </div>
              </span> -->

              <button
                ref="all"
                id="current"
                class="item-border"
                :class="{ highlight: selected == 'current' }"
                @click="
                  selected = 'current'
                  $refs.all.focus()
                "
              >
                Current
              </button>

              <div
                id="archived"
                class="item-border"
                :class="{ highlight: selected == 'archived' }"
                @click="selected = 'archived'"
              >
                Archived
              </div>
            </div>

            <b-dropdown id="dropdownFilter" :text="filterLabel" block right class="btn-habitat-filter">
              <b-dropdown-item @click="selectFilter('recent')" class="dropdown-item">Most Recent </b-dropdown-item>
              <b-dropdown-item @click="selectFilter('alphabetical')" class="dropdown-item">A - Z</b-dropdown-item>
            </b-dropdown>

            <!-- <b-button class="d-flex align-items-center" id="filter-button" ref="filterButton">
            <div>{{ filterLabel }}</div>
            <span class="px-2">
              <stream-line-icon :icon="Arrows.ArrowDown1" :stroke="iconColour" :size="14" />
            </span>
          </b-button> -->
          </div>

          <!-- <div class="filter-bar mt-1 pl-0">
            <div class="content-types">
              <div
                id="all-habitats"
                class="item-border"
                :class="{ highlight: selected == 'current-projects' }"
                @click="selected = 'current-projects'"
              >
                Current
              </div>
              <div
                id="archived"
                class="item-border"
                :class="{ highlight: selected == 'archived-projects' }"
                @click="selected = 'archived-projects'"
              >
                Archived
              </div>
            </div>
          </div> -->
        </div>
      </div>

      <NoProjects v-if="!habitat.projects.length && fetched" />
      <div v-else class="row">
        <ProjectPreview
          v-for="project in displayedProjects"
          :key="project.name"
          :project="project"
          @update-habitat="fetchHabitat($route.params.habitatId)"
          @refresh="fetchHabitat($route.params.habitatId)"
        />
      </div>
      <!-- Menu Popover -->
      <HabitatSettingsModal :habitat="habitat" :show="showHabitatSettingsModal" @closeModal="handleCloseModal" />
    </div>
  </div>
</template>
<script>
import api from '@/api'
import { mapState } from 'vuex'
import {
  // BBreadcrumb,
  // BBreadcrumbItem,
  BButton,
  BIconGear
} from 'bootstrap-vue'
import Settings from '@streamlinehq/streamline-regular/lib/interface-essential/Settings'
import ColorsPainting from '@streamlinehq/streamline-regular/lib/design/ColorsPainting'
import NoProjects from './common/NoProjects'
import ProjectPreview from '@/components/views/ProjectPreview'
import HabitatSettingsModal from '@/components/views/modals/HabitatSettingsModal'

export default {
  components: {
    // BBreadcrumb,
    // BBreadcrumbItem,
    ProjectPreview,
    NoProjects,
    BButton,
    HabitatSettingsModal,
    BIconGear
  },
  data () {
    return {
      ColorsPainting,
      Settings,
      habitat: {
        projects: [],
        archivedProjects: [],
        address: {
          fullAddress: ''
        }
      },
      fetched: false,
      showHabitatSettingsModal: false,
      imageNo: 0,
      resourceNo: 0,
      archivedNo: 0,
      selected: 'current'
    }
  },
  computed: {
    ...mapState({
      // iconColour: state => {
      //   if (state.auth.user === null || state.auth.user.theme === 'light') {
      //     return '#000000'
      //   }

      //   return '#ffffff'
      // },
      headers: state => {
        return { Authorization: 'Bearer ' + state.auth.tokens.access.token }
      },
      userId: state => state.auth.user.id
    }),
    filterLabel: function () {
      switch (this.filter) {
        case 'recent':
          return 'Most Recent'
        case 'alphabetical':
          return 'A - Z'
        default:
          return 'Most Recent'
      }
    },
    displayedProjects: function () {
      // console.log(this)
      // console.log(this.habitat)
      // let habitatPlaceholder = this.habitats
      // if (this.selected === 'archived') {
      //   habitatPlaceholder = this.archived
      // } else if (this.selected === 'my-habitats') {
      //   habitatPlaceholder = this.habitats.filter(habitat => habitat.owners.map(owner => owner.id).includes(this.userId))
      // }

      let toReturn

      switch (this.selected) {
        case 'current':
          toReturn = this.habitat.projects
          break

        case 'archived':
          // toReturn = this.habitat.projects
          toReturn = this.habitat.archivedProjects
          break

        default:
          toReturn = this.habitat.projects
          break
      }

      console.log('To Return', toReturn)

      // if (this.selected === 'current') {
      //   toReturn = this.habitat.projects
      // } else {
      //   toReturn = this.habitat.projects

      //   // toReturn = this.resources.filter(resource => resource.type === this.selected)
      // }

      // if (this.search) {
      //   toReturn = habitatPlaceholder.filter(habitat => habitat.name.toLowerCase().includes(this.search.toLowerCase()))
      // } else {
      //   toReturn = habitatPlaceholder
      // }

      // switch (this.filter) {
      //   case 'recent':
      //     toReturn = toReturn.sort(this.sortRecent)
      //     break
      //   case 'alphabetical':
      //     toReturn = toReturn.sort(this.sortAlphabetical)
      //     break
      //   default:
      //     toReturn = toReturn.sort(this.sortRecent)
      // }

      return toReturn
    }
  },
  methods: {
    async fetchHabitat (id) {
      try {
        const response = await api.habitats.get(id)
        this.habitat = response
        const archived = await api.projects.getArchived(id)
        this.habitat.archivedProjects = archived
        this.archivedNo = archived.length
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
    },

    async refresh () {
      this.archived = []
      // await this.$store.dispatch(ALOADHABITATS)
      // this.getArchivedHabitats()
      this.selected = 'current'
    },
    handleCreateClick () {
      this.$router.push({ name: 'project-new' })
    },
    handleCloseModal () {
      this.showHabitatSettingsModal = false
      this.fetchHabitat(this.$route.params.habitatId)
    }
  },
  mounted () {
    this.fetchHabitat(this.$route.params.habitatId)
    this.fetchInspiration(this.$route.params.habitatId)
  }
}
</script>
