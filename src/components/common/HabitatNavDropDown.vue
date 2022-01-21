<template>
  <b-popover id="habitat-mega-menu" :target="target" :placement="'bottomright'" triggers="focus">
    <div class="header">Recent</div>
    <div class="top-divider" />

    <div v-for="habitat in habitats.slice(0, 3)" v-bind:key="habitat.id">
      <div class="option-container" @click="handleViewHabitat(habitat.id)">
        <img v-if="habitat.moodboard.images[0]" :src="habitat.moodboard.images[0].url" class="option-image" />
        <span v-else :style="{ backgroundColor: '#F8F8F8', padding: '10px', borderRadius: '8px', marginRight: '15px' }">
          <b-icon-house-door style="width: 20px; height: 20px;"></b-icon-house-door>
        </span>
        <div class="option-text">
          <div class="option-title">{{ habitat.name }}</div>
          <div class="option-description">
            <small v-if="habitat.users && habitat.users.length > 0">{{ habitat.users.length }} members</small>
            <small v-else-if="habitat.users && habitat.users.length == 0">1 member</small>
            •
            <small v-if="habitat.projects && habitat.projects.length > 1">{{ habitat.projects.length }} projects</small>
            <small v-else-if="habitat.projects && habitat.projects.length == 1">{{ habitat.projects.length }} project</small>
            <small v-else>No projects</small>
          </div>
        </div>
      </div>
    </div>

    <div class="divider" />
    <div class="option-container" @click="handleViewHabitat('')">
      <span :style="{ backgroundColor: '#F8F8F8', padding: '10px', borderRadius: '8px', marginRight: '10px' }">
        <b-icon-folder2-open style="width: 20px; height: 20px;"></b-icon-folder2-open>
      </span>
      <div class="option-text">
        <div class="option-title">All Habitats</div>
      </div>
    </div>
    <div class="divider" />

    <div class="option-footer" @click="handleCreateClick('habitat')">
      <div class="option-text">
        <div class="option-title">+ Create Habitat</div>
      </div>
    </div>
  </b-popover>
</template>

<script>
import { mapState } from 'vuex'
import { ALOADHABITATS } from '@/store/action-types'
import { BIconHouseDoor, BIconFolder2Open, BPopover } from 'bootstrap-vue'

export default {
  name: 'HabitatNavDropDown',
  props: ['show', 'target', 'recentHabitats'],
  components: {
    BIconHouseDoor,
    BIconFolder2Open,
    BPopover
  },
  data () {
    return {}
  },
  computed: {
    ...mapState({
      habitats: state => state.habitats.habitats
    })
  },
  methods: {
    async fetchHabitats () {
      await this.$store.dispatch(ALOADHABITATS)
    },

    async refresh () {
      this.archived = []
      await this.$store.dispatch(ALOADHABITATS)
      // this.getArchivedHabitats()
      // this.selected = 'all-habitats'
    },

    handleViewHabitat (id) {
      if (id) {
        this.$router.push({ name: 'habitat-view', params: { habitatId: id } })
      } else {
        this.$router.push({ name: 'habitats-view' })
      }
      this.$root.$emit('bv::hide::popover')
    },

    handleCreateClick (type) {
      this.$emit('optionSelected', type)
    }
  },

  // watch: {
  //   habitats (newVal) {
  //     this.projectOptions = [
  //       {
  //         value: null,
  //         image: '',
  //         text: ''
  //       }
  //     ]
  //     newVal.forEach(habitat => {
  //       console.log(habitat)
  //       this.projectOptions.push({
  //         type: 'habitat',
  //         value: habitat.moodboard.id,
  //         text: habitat.name,
  //         image: habitat.moodboard.images.length ? habitat.moodboard.images[0].url : '',
  //         projects: habitat.projects.length,
  //         members: habitat.owners.length + habitat.users.length
  //       })
  //     })
  //   }
  // },
  async mounted () {
    await this.$store.dispatch(ALOADHABITATS)
  }
}
</script>
