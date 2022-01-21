<template>
  <div class=" col-12 col-md-6 col-lg-4 ">
    <div class="project-preview-container">
      <div v-if="images.length" class="row no-gutters pointer project-images " @click="handleViewProject">
        <div class=" col ">
          <div
            class="bgImage"
            :style="{
              backgroundImage: `url(${images[0].url})`
            }"
          />
          <div class="tag-row">
            <div v-for="(tag, i) in images[0].tags" :key="`tag1${i}`" class="tag-pill" :style="{ ...getColor(tag) }">
              # {{ tag.charAt(0).toUpperCase() + tag.slice(1) }}
            </div>
          </div>
        </div>
        <div v-if="images.length > 2" class=" col">
          <div
            class="bgImage img-2"
            :style="{
              backgroundImage: `url(${images[1].url})`
            }"
          />
          <div class="d-flex ">
            <div
              class="col bgImage img-3"
              :style="{
                backgroundImage: `url(${images[2].url})`
              }"
            />
            <div
              class="col bgImage  img-4"
              :style="{
                backgroundImage: `url(${images[3].url})`
              }"
            />
          </div>
        </div>
      </div>

      <div v-else class="no-images d-flex justify-content-center align-items-center flex-column">
        No images in this project yet
        <div v-if="!project.isArchived" :id="`${project.id}-2`" class="btn alt-button mt-3" @click="handleUploadImageClick">
          Add Images
        </div>
      </div>

      <div class="py-3 px-3 card-body">
        <div class="d-flex flex-direction-row justify-content-between">
          <h5 @click="handleViewProject" class="hover mb-1">{{ project.name }}</h5>
        </div>
        <div>
          <small>Updated {{ lastUpdated }} ago</small>
        </div>
      </div>

      <div class="action-btn-wrapper">
        <b-button
          variant="outline-primary"
          v-if="!project.isArchived"
          @click="mobFocus"
          ref="mobButton"
          :id="`${project.id}-add-mob-content`"
          class="d-block d-lg-none"
        >
          <stream-line-icon :icon="RemoveAdd.Add" :stroke="iconColour" :size="20" />
        </b-button>
        <b-button variant="light" :id="`${project.id}-menu`" class="menu-box d-flex align-items-center">
          <stream-line-icon :icon="Menu.NavigationMenuHorizontal" :stroke="iconColour" :size="20" />
        </b-button>
      </div>
    </div>

    <!-- <AddContentPopover
      :target="`${project.id}-add-content`"
      @image="handleUploadImageClick"
      @article="handleArticleModal"
      @note="handleNoteModal"
      @link="handleLinkModal"
      @roomPlan="handleRoomPlanModal"
    /> -->
    <!-- <AddContentPopover
      :target="`${project.id}-add-mob-content`"
      @image="handleUploadImageClick"
      @article="handleArticleModal"
      @note="handleNoteModal"
      @link="handleLinkModal"
      @roomPlan="handleRoomPlanModal"
    /> -->
    <ProjectMenuPopover
      :target="`${project.id}-menu`"
      @navigate="handleViewProject"
      @archive="handleArchiveProject"
      @unarchive="handleArchiveProject(false)"
      @settings="handleSettings"
      :isArchived="project.isArchived"
    />
    <ImageUploadModal
      @ok="updateHabitat"
      :show="showUploadModal"
      @close="showUploadModal = false"
      :moodboardId="project.moodboard.id"
    />
    <!-- <ArticleCreationModal
      :show="showArticleModal"
      :selectedProject="project.id"
      :userId="userId"
      @close="showArticleModal = false"
    /> -->
    <!-- <NoteCreationModal :show="showNoteModal" :selectedProject="project.id" :userId="userId" @close="showNoteModal = false" /> -->
    <!-- <AddLinkModal :show="showAddLinkModal" :selectedProject="project.id" @hide="showAddLinkModal = false" /> -->
    <!-- <RoomPlanCreationModal
      :show="showAddRoomPlanModal"
      :selectedProject="project.id"
      @close="showAddRoomPlanModal = false"
      :habitat="project.habitat"
    /> -->
    <ProjectSettingsModal
      v-if="showSettingsModal"
      :show="showSettingsModal"
      @closeModal="closeSettingsModal"
      :project="this.project"
      @projectSaved="refresh()"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import api from '@/api'
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import Menu from '@streamlinehq/streamline-regular/lib/interface-essential/Menu'
import RemoveAdd from '@streamlinehq/streamline-regular/lib/interface-essential/RemoveAdd'
import { BButton } from 'bootstrap-vue'
// import AddContentPopover from '@/components/views/popovers/AddContentPopover'
import ImageUploadModal from '@/components/views/modals/ImageUploadModal'
// import ArticleCreationModal from '@/components/views/modals/ArticleCreationModal'
// import AddLinkModal from '@/components/views/modals/AddLinkModal'
// import NoteCreationModal from '@/components/views/modals/NoteCreationModal'
// import RoomPlanCreationModal from '@/components/views/modals/RoomPlanCreationModal'
import ProjectMenuPopover from '@/components/views/popovers/ProjectMenuPopover'
import ProjectSettingsModal from '@/components/common/ProjectSettingsModal'
import moment from 'moment'

export default {
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  components: {
    StreamLineIcon,
    BButton,
    // AddContentPopover,
    ImageUploadModal,
    // ArticleCreationModal,
    // AddLinkModal,
    // NoteCreationModal,
    // RoomPlanCreationModal,
    ProjectMenuPopover,
    ProjectSettingsModal
  },
  data () {
    return {
      Menu,
      RemoveAdd,
      moodboard: {},
      colors: [
        { text: '#70A288', background: '#D8EAE0' },
        { text: '#F76F8E', background: '#F2D9DF' },
        { text: '#784590', background: '#C3ACCE' }
      ],
      showUploadModal: false,
      showArticleModal: false,
      showNoteModal: false,
      showAddLinkModal: false,
      showAddRoomPlanModal: false,
      showSettingsModal: false
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
    }),
    lastUpdated: function () {
      return moment().from(this.project.updatedAt, true)
    },
    images: function () {
      console.log(this.project.moodboard.images)
      return this.project.moodboard.images
    }
  },

  methods: {
    handleMenuSelect (id) {
      this.$emit('menu-select', id)
    },
    updateHabitat () {
      this.$emit('update-habitat')
    },
    handleViewProject () {
      if (!this.project.isArchived) {
        this.$router.push({
          name: 'project-view',
          params: { habitatId: this.project.habitat, projectId: this.project.id }
        })
      }
    },
    handleUploadImageClick () {
      this.showUploadModal = true
    },
    handleArticleModal () {
      this.showArticleModal = true
    },
    handleNoteModal () {
      this.showNoteModal = true
    },
    handleLinkModal () {
      this.showAddLinkModal = true
    },
    handleRoomPlanModal () {
      this.showAddRoomPlanModal = true
    },
    async handleArchiveProject (isArchived = true) {
      try {
        await api.projects.update({ id: this.project.id, isArchived })
        this.$toasted.success(isArchived ? 'Project Archived' : 'Project Unarchived')
        this.updateHabitat()
      } catch (e) {
        this.$toasted.error('Project not archived')
      }
    },
    focus () {
      this.$refs.button.focus()
    },
    mobFocus () {
      this.$refs.mobButton.focus()
    },
    handleSettings () {
      this.showSettingsModal = true
    },
    closeSettingsModal () {
      this.showSettingsModal = false
    },
    refresh () {
      this.$emit('refresh')
    },
    getColor (type) {
      if (type === 'featured') {
        return { text: '#D18C08', background: '#FFF4DB' }
      }

      const rand = Math.floor(Math.random() * 3)

      return this.colors[rand]
    }
  }
}
</script>
