<template>
  <div class="habitat-preview-container">
    <div class="habitat-preview-body">
      <div v-if="!images.length">
        <div class="habitat-preview-image missing-image">
          <b-button href="#" tabindex="0" :id="`${habitat.id}-add-images`">
            <b-icon-card-image style="width: 30px; height: 30px;"></b-icon-card-image>
            Add images to your habitat</b-button
          >
        </div>
      </div>
      <div class="hover" @click="handleViewHabitat">
        <div v-if="images.length > 0">
          <div class="habitat-preview-image" :style="{ backgroundImage: `url(${images[0].url})` }"></div>
        </div>
        <!-- <div v-else-if="images.length === 2">
          <div class="row">
            <div class="col-12 p-1">
              <div class="habitat-preview-image" :style="{ backgroundImage: `url(${images[0].url})` }"></div>
            </div>
          </div>
          <div class="row">
            <div class="col-12 p-1">
              <div class="habitat-preview-image" :style="{ backgroundImage: `url(${images[1].url})` }"></div>
            </div>
          </div>
        </div> -->
        <!-- <div v-else-if="images.length > 2">
          <div class="row">
            <div class="col-12 p-1">
              <div class="habitat-preview-image" :style="{ backgroundImage: `url(${images[0].url})` }"></div>
            </div>
          </div>
          <div class="row">
            <div class="col-4 p-1">
              <div
                class="habitat-preview-image"
                :style="images[1] ? { backgroundImage: `url(${images[1].url})` } : null"
              ></div>
            </div>
            <div class="col-8 p-1">
              <div
                class="habitat-preview-image"
                :style="images[2] ? { backgroundImage: `url(${images[2].url})` } : null"
              ></div>
            </div>
          </div>
        </div> -->
      </div>
      <div class="py-2 px-3">
        <div class="d-flex flex-direction-row justify-content-between">
          <h6 class="hover mb-0" @click="handleViewHabitat">
            {{ habitat.name }}
          </h6>
          <!-- <p class="last-updated">Updated {{ updatedDate }} ago</p> -->
        </div>

        <div>
          <small class="text-dark">{{ projectCountString }}</small>
        </div>
        <div>
          <small>Updated {{ updatedDate }} ago </small>
        </div>
      </div>

      <div class="py-2 px-2">
        <b-avatar-group size="34px">
          <template v-for="(owner, i) in habitat.owners">
            <b-avatar
              v-if="owner.image"
              :id="`${habitat.id}-owner-${i}`"
              :key="`${habitat.id}-owner-${i}`"
              variant="primary"
              v-b-tooltip.hover
              :title="owner.fullName"
              :src="owner.image.url"
            >
            </b-avatar>
            <b-avatar
              v-else
              :id="`${habitat.id}-owner-${i}`"
              :key="`${habitat.id}-owner-${i}`"
              variant="secondary"
              :text="initialAvatarText(owner.firstName, owner.lastName)"
            ></b-avatar>
          </template>
          <template v-for="(user, i) in habitat.users">
            <b-avatar
              v-if="user.image"
              variant="info"
              :key="`userImage${i}`"
              :id="`${habitat.id}-userImage-${i}`"
              v-b-tooltip.hover
              :title="user.fullName"
              :src="user.image.url"
            ></b-avatar>
            <b-avatar
              v-else
              :id="`${habitat.id}-owner-${i}`"
              :key="`${habitat.id}-owner-${i}`"
              variant="secondary"
              :text="initialAvatarText(user.firstName, user.lastName)"
            ></b-avatar>
          </template>
        </b-avatar-group>
      </div>

      <div class="habitat-action">
        <b-button variant="light" :id="`${habitat.id}-menu`">
          <span>
            <stream-line-icon :icon="Menu.NavigationMenuHorizontal" :stroke="iconColour" :size="20" />
          </span>
        </b-button>
      </div>
    </div>
    <b-modal v-model="showModal" title="Upload Images" ok-only ok-title="Done" @ok="ok">
      <dropzone
        id="dropzone"
        :url="url"
        accepted-file-types="image/*"
        :header="headers"
        :moodboardId="habitat.moodboard.id"
      />
    </b-modal>
    <SettingsMenuPopover
      :target="`${habitat.id}-menu`"
      @team="handleManageTeam"
      @settings="handleSettings"
      @archive="handleArchive"
      :isArchived="habitat.isArchived"
    />
    <TeamModal :show="showTeamModal" @hide="showTeamModal = false" :habitat="habitat" />
    <AddImagePopover :target="`${habitat.id}-add-images`" @uploadImage="handleUploadImageClick" />
    <HabitatSettingsModal
      :habitat="habitat"
      :show="showHabitatSettingsModal"
      @closeModal="showHabitatSettingsModal = false"
    />
  </div>
</template>
<script>
import api from '@/api'
import { mapState } from 'vuex'
import placeholder from '@/assets/icons/placeholder@2x.png'
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import Menu from '@streamlinehq/streamline-regular/lib/interface-essential/Menu'
import { BModal, BButton, BIconCardImage } from 'bootstrap-vue'
import Dropzone from '../../components/form/DropZone'
import SettingsMenuPopover from './popovers/SettingsMenuPopover'
import TeamModal from './modals/TeamModal'
import AddImagePopover from './popovers/AddImagePopover'
import HabitatSettingsModal from '@/components/views/modals/HabitatSettingsModal'
import moment from 'moment'

export default {
  props: ['habitat'],
  components: {
    StreamLineIcon,
    BModal,
    Dropzone,
    BButton,
    SettingsMenuPopover,
    TeamModal,
    AddImagePopover,
    HabitatSettingsModal,
    BIconCardImage
  },
  data () {
    return {
      Menu,
      placeholder,
      images: [],
      containerWidth: null,
      popoverShow: false,
      showAddImagePopover: false,
      showModal: false,
      showTeamModal: false,
      hoverCheck: true,
      url: process.env.VUE_APP_API_URL + '/v1/media/dropzone',
      showHabitatSettingsModal: false
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
      }
    }),
    projectNames: function () {
      let string = ''
      if (this.habitat && this.habitat.projects.length) {
        for (let i = 0; i < (this.habitat.projects.length <= 4 ? this.habitat.projects.length : 4); i++) {
          if (i === 0) {
            string += this.habitat.projects[i].name
          } else {
            string += ` &#183; ${this.habitat.projects[i].name}`
          }
        }
      }
      return string
    },
    projectCountString: function () {
      let string = ''
      if (this.habitat && this.habitat.projects.length) {
        if (this.habitat.projects.length === 1) {
          string = '1 project'
        } else {
          string = this.habitat.projects.length + ' projects'
        }
      } else {
        string = 'No projects'
      }
      return string
    },
    updatedDate: function () {
      return moment().from(this.habitat.updatedAt, true)
    }
  },
  watch: {
    habitat: {
      deep: true,
      handler () {
        this.collateHabitatImages()
      }
    }
  },
  methods: {
    handlePopoverClick () {
      this.showAddImagePopover = !this.showAddImagePopover
    },
    handleUploadImageClick () {
      this.showModal = true
      this.showAddImagePopover = false
    },
    collateHabitatImages () {
      this.images = []
      this.images = this.images.concat(this.habitat.moodboard.images)
      this.habitat.projects.forEach(project => {
        this.images = this.images.concat(project.moodboard.images)
      })
    },
    ok () {
      this.$emit('ok')
    },
    handleManageTeam () {
      this.showTeamModal = !this.showTeamModal
    },
    handleSettings () {
      this.showHabitatSettingsModal = true
    },
    handleArchive () {
      if (this.habitat.isArchived) {
        this.handleUnarchiveHabitat()
      } else {
        this.handleArchiveHabitat()
      }
    },
    handleViewHabitat () {
      if (!this.habitat.isArchived) {
        this.$router.push({ name: 'habitat-view', params: { habitatId: this.habitat.id } })
      }
    },
    initialAvatarText (firstName, lastName) {
      return firstName && lastName
        ? firstName.substring(0, 1) + lastName.substring(0, 1)
        : ''
    },
    async handleArchiveHabitat () {
      try {
        const response = await api.habitats.update({ id: this.habitat.id, isArchived: true })
        this.habitat = response.data
        this.$toasted.success('Habitat archived')
        this.ok()
      } catch (e) {
        this.$toasted.error('Habitat not archived')
      }
    },
    async handleUnarchiveHabitat () {
      try {
        const response = await api.habitats.update({ id: this.habitat.id, isArchived: false })
        this.habitat = response.data
        this.$toasted.success('Habitat unarchived')
        this.ok()
      } catch (e) {
        this.$toasted.error('Something went wrong')
      }
    }
  },
  mounted () {
    this.collateHabitatImages()
    // console.log(this.habitat)
  }
}
</script>
