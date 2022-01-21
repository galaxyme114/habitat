<template>
  <div class="entry">
    <div class="container">
      <div class="d-flex justify-content-between">
        <h2>My Habitats</h2>
        <b-button ref="no-content-button" variant="outline-primary" @click="handleCreateClick()">+ Create Habitat</b-button>
      </div>
      <CreateHabitatModal :show="showCreateHabitatModal || createHabitat" @closeModal="closeModal" />

      <div class="d-flex bg-light flex-column justify-content-center align-items-center mt-0">
        <div class="filter-bar">
          <div class="content-types">
            <span class="icon-border">
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
            </span>
            <div
              id="all-habitats"
              class="item-border"
              :class="{ highlight: selected == 'all-habitats' }"
              @click="selected = 'all-habitats'"
            >
              All Habitats
            </div>
            <div
              id="my-habitats"
              class="item-border"
              :class="{ highlight: selected == 'my-habitats' }"
              @click="selected = 'my-habitats'"
            >
              Created by me
            </div>
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

            <!-- <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item active>Active action</b-dropdown-item>
            <b-dropdown-item disabled>Disabled action</b-dropdown-item> -->
          </b-dropdown>

          <!-- <b-button class="d-flex align-items-center" id="filter-button" ref="filterButton">
            <div>{{ filterLabel }}</div>
            <span class="px-2">
              <stream-line-icon :icon="Arrows.ArrowDown1" :stroke="iconColour" :size="14" />
            </span>
          </b-button> -->
        </div>
        <NoHabitats v-if="!habitats.length && selected === 'all-habitats'" @newHabitat="handleNewHabitat" />
        <div v-else class="row w-100">
          <div v-for="(habitat, i) in displayed" :key="'habitat' + i" class="col-12 col-md-6 col-lg-3">
            <habitat-preview :habitat="habitat" @ok="refresh" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/api'
import { mapState } from 'vuex'
import { ALOADHABITATS } from '@/store/action-types'
import { HANDLEHABITATMODAL } from '@/store/mutation-types'
import HabitatPreview from '@/components/views/HabitatPreview'
import Search from '@streamlinehq/streamline-regular/lib/interface-essential/Search'
import Arrows from '@streamlinehq/streamline-regular/lib/arrows-diagrams/Arrows'
import Delete from '@streamlinehq/streamline-regular/lib/interface-essential/Delete'
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import NoHabitats from './common/NoHabitats'
import CreateHabitatModal from '@/components/common/CreateHabitatModal'

// import { BPopover, BButton } from 'bootstrap-vue'

export default {
  components: {
    HabitatPreview,
    StreamLineIcon,
    NoHabitats,
    CreateHabitatModal
    // BPopover,
    // BButton
  },
  data () {
    return {
      Search,
      Arrows,
      Delete,
      selected: 'all-habitats',
      search: null,
      focused: true,
      filter: 'recent',
      showCreateHabitatModal: false
    }
  },
  computed: {
    ...mapState({
      habitats: state => state.habitats.habitats,
      createHabitat: state => state.habitats.createHabitat,
      inviteToken: state => state.habitats.inviteToken,
      currentUser: state => state.auth.user,
      userId: state => state.auth.user.id,
      iconColour: state => {
        if (state.auth.user === null || state.auth.user.theme === 'light') {
          return '#000000'
        }
        return '#ffffff'
      }
    }),
    displayed: function () {
      let habitatPlaceholder = this.habitats
      if (this.selected === 'archived') {
        habitatPlaceholder = this.archived
      } else if (this.selected === 'my-habitats') {
        habitatPlaceholder = this.habitats.filter(habitat => habitat.owners.map(owner => owner.id).includes(this.userId))
      }

      let toReturn
      if (this.search) {
        toReturn = habitatPlaceholder.filter(habitat => habitat.name.toLowerCase().includes(this.search.toLowerCase()))
      } else {
        toReturn = habitatPlaceholder
      }

      switch (this.filter) {
        case 'recent':
          toReturn = toReturn.sort(this.sortRecent)
          break
        case 'alphabetical':
          toReturn = toReturn.sort(this.sortAlphabetical)
          break
        default:
          toReturn = toReturn.sort(this.sortRecent)
      }

      return toReturn
    },
    filterLabel: function () {
      switch (this.filter) {
        case 'recent':
          return 'Most Recent'
        case 'alphabetical':
          return 'A - Z'
        default:
          return 'Most Recent'
      }
    }
  },
  methods: {
    handleCreateClick () {
      this.showCreateHabitatModal = true
    },
    deleteHabitat () {
      if (confirm('Are you sure you want to delete this habitats?')) {
        api.habitats.delete(this.habitat.id)
      }
    },
    closeModal () {
      this.showCreateHabitatModal = false
      this.$store.commit(HANDLEHABITATMODAL, false)
    },
    async refresh () {
      this.archived = []
      await this.$store.dispatch(ALOADHABITATS)
      this.getArchivedHabitats()
      this.selected = 'all-habitats'
    },
    async getArchivedHabitats () {
      try {
        const response = await api.habitats.getArchived()
        this.archived = response
      } catch (error) {
        console.log(error)
      }
    },
    handleNewHabitat () {
      this.$store.commit(HANDLEHABITATMODAL, true)
    },
    selectFilter (filter) {
      this.filter = filter
    },
    sortRecent (a, b) {
      let comparison = 0
      const dateA = a.updatedAt
      const dateB = b.updatedAt
      if (dateA > dateB) {
        comparison = 1
      } else if (dateA < dateB) {
        comparison = -1
      }
      return comparison * -1
    },
    sortAlphabetical (a, b) {
      if (a.name < b.name) {
        return -1
      } else if (a.name > b.name) {
        return 1
      }
      return 0
    },
    focus () {
      this.$refs.searchRef.focus()
    }
  },
  async mounted () {
    if (this.inviteToken) {
      this.$router.push('/habitats/invite')
    }
    await this.$store.dispatch(ALOADHABITATS)
    this.getArchivedHabitats()
  }
}
</script>
