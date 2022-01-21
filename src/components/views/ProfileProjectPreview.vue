<template>
  <div class="habitat-preview-container">
    <div class="habitat-preview-body">
      <div v-if="!images.length">
        <div class="row m-1">
          <div class="col-12 px-1">
            <div class="habitat-preview-image missing-image">
              <b-button href="#" tabindex="0" :id="`${project.id}-add-images`">Add images to your project</b-button>
            </div>
          </div>
        </div>
      </div>
      <div class="hover" @click="$router.push({ name: 'project-view', params: { projectId: project.id } })">
        <div v-if="images.length === 1">
          <div class="row m-1">
            <div class="col-12 px-1">
              <div class="habitat-preview-image" :style="{ backgroundImage: `url(${images[0].url})`, height: '400px' }" />
            </div>
          </div>
        </div>
        <div v-else-if="images.length === 2">
          <div class="row m-1">
            <div class="col-12 px-1">
              <div class="habitat-preview-image" :style="{ backgroundImage: `url(${images[0].url})` }"></div>
            </div>
          </div>
          <div class="row m-1">
            <div class="col-12 px-1">
              <div class="habitat-preview-image" :style="{ backgroundImage: `url(${images[1].url})` }"></div>
            </div>
          </div>
        </div>
        <div v-else-if="images.length > 2">
          <div class="row m-1">
            <div class="col-12 px-1">
              <div class="habitat-preview-image" :style="{ backgroundImage: `url(${images[0].url})` }"></div>
            </div>
          </div>
          <div class="row m-1">
            <div class="col-4 px-1">
              <div
                class="habitat-preview-image"
                :style="images[1] ? { backgroundImage: `url(${images[1].url})` } : null"
              ></div>
            </div>
            <div class="col-8 px-1">
              <div
                class="habitat-preview-image"
                :style="images[2] ? { backgroundImage: `url(${images[2].url})` } : null"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div id="habitat-info" class="align-items-center">
        <div class="d-flex flex-column justify-content-center">
          <h6 class="hover" @click="$router.push({ name: 'project-view', params: { projectId: project.id } })">
            {{ project.name }}
          </h6>
          <p :style="{ marginBottom: '0px' }">{{ project.habitat.name }}</p>
        </div>
        <b-button :id="`${project.id}-menu`">
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
        :moodboardId="project.moodboard.id"
      />
    </b-modal>
    <SettingsMenuPopover :target="`${project.id}-menu`" @team="handleManageTeam" />
    <AddImagePopover :target="`${project.id}-add-images`" @uploadImage="handleUploadImageClick" />
  </div>
</template>
<script>
// import api from '@/api'
import { mapState } from 'vuex'
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import Menu from '@streamlinehq/streamline-regular/lib/interface-essential/Menu'
import { BModal, BButton } from 'bootstrap-vue'
import Dropzone from '../../components/form/DropZone'
import SettingsMenuPopover from './popovers/SettingsMenuPopover'
import AddImagePopover from './popovers/AddImagePopover'

export default {
  name: 'ProfileProjectPreview',
  props: ['project'],
  components: {
    StreamLineIcon,
    BModal,
    Dropzone,
    BButton,
    SettingsMenuPopover,
    AddImagePopover
  },
  data () {
    return {
      Menu,
      containerWidth: null,
      popoverShow: false,
      showAddImagePopover: false,
      showModal: false,
      showTeamModal: false,
      hoverCheck: true,
      url: process.env.VUE_APP_API_URL + '/v1/media/dropzone'
    }
  },
  computed: {
    ...mapState({
      iconColour: (state) => {
        if (state.auth.user === null || state.auth.user.theme === 'light') {
          return '#000000'
        }

        return '#ffffff'
      },
      headers: (state) => {
        return { Authorization: 'Bearer ' + state.auth.tokens.access.token }
      }
    }),
    images: function () {
      return this.project.moodboard.images
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
    ok () {
      this.$emit('ok')
    },
    handleManageTeam () {
      this.showTeamModal = !this.showTeamModal
    }
  }
}
</script>
