<template>
  <div class="project-preview-container">
    <div class="project-title d-flex justify-content-between">
      <div class="d-flex flex-column">
        <h3 @click="handleViewProject" class="hover">{{ project.name }}</h3>
        <p class="last-updated">Updated {{ lastUpdated }} ago</p>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <b-button v-if="!project.isArchived" @click="focus" variant="primary" ref="button">
          View Project
        </b-button>
        <!-- <b-button
          v-if="!project.isArchived"
          @click="focus"
          variant="primary"
          ref="button"
          :id="`${project.id}-add-content`"
          class="btn btn-rounded btn-primary d-none d-lg-block"
        >
          Add Content
        </b-button> -->
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
        <b-button :id="`${project.id}-menu`" class="menu-box d-flex align-items-center">
          <stream-line-icon :icon="Menu.NavigationMenuHorizontal" :stroke="iconColour" :size="20" />
        </b-button>
      </div>
    </div>
    <div
      v-if="images.length"
      class="row no-gutters m-0 pointer flex-nowrap flex-lg-wrap project-images"
      @click="handleViewProject"
    >
      <div class="col-10 col-sm-8 col-md-6 col-lg-4 p-1">
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
      <div class="col-10 col-sm-8 col-md-4 col-lg-2">
        <div class="row no-gutters m-0">
          <div class="col p-1" v-if="images[1]">
            <div
              class="bgImage small"
              :style="{
                backgroundImage: `url(${this.images[1].url})`
              }"
            />
            <div class="tag-row">
              <div v-for="(tag, i) in images[1].tags" :key="`tag2${i}`" class="tag-pill" :style="{ ...getColor(tag) }">
                # {{ tag.charAt(0).toUpperCase() + tag.slice(1) }}
              </div>
            </div>
          </div>
        </div>
        <div class="row no-gutters m-0">
          <div class="col-6 p-1" v-if="images[2]">
            <div
              class="bgImage small"
              :style="{
                backgroundImage: `url(${images[2].url})`
              }"
            />
            <div class="tag-row">
              <div v-for="(tag, i) in images[2].tags" :key="`tag2${i}`" class="tag-pill" :style="{ ...getColor(tag) }">
                # {{ tag.charAt(0).toUpperCase() + tag.slice(1) }}
              </div>
            </div>
          </div>
          <div class="col-6 p-1" v-if="images[3]">
            <div
              class="bgImage small"
              :style="{
                backgroundImage: `url(${images[3].url})`
              }"
            />
            <div class="tag-row">
              <div v-for="(tag, i) in images[3].tags" :key="`tag2${i}`" class="tag-pill" :style="{ ...getColor(tag) }">
                # {{ tag.charAt(0).toUpperCase() + tag.slice(1) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="col-10 col-sm-8 col-md-4 col-lg-2">
        <div class="row no-gutters m-0">
          <div class="col p-1" v-if="images[4]">
            <div
              class="bgImage"
              :style="{
                backgroundImage: `url(${images[4].url})`
              }"
            />
            <div class="tag-row">
              <div v-for="(tag, i) in images[4].tags" :key="`tag2${i}`" class="tag-pill" :style="{ ...getColor(tag) }">
                # {{ tag.charAt(0).toUpperCase() + tag.slice(1) }}
              </div>
            </div>
          </div>
        </div>
      </div> -->
      <!-- <div class="col-12 col-md-6 col-lg-4">
        <div class="row no-gutters m-0">
          <div class="col-8 p-1" v-if="images[5]">
            <div
              class="bgImage small"
              :style="{
                backgroundImage: `url(${images[5].url})`
              }"
            />
            <div class="tag-row">
              <div v-for="(tag, i) in images[5].tags" :key="`tag2${i}`" class="tag-pill" :style="{ ...getColor(tag) }">
                # {{ tag.charAt(0).toUpperCase() + tag.slice(1) }}
              </div>
            </div>
          </div>
          <div class="col-4 p-1" v-if="images[6]">
            <div
              class="bgImage small"
              :style="{
                backgroundImage: `url(${images[6].url})`
              }"
            />
            <div class="tag-row">
              <div v-for="(tag, i) in images[6].tags" :key="`tag2${i}`" class="tag-pill" :style="{ ...getColor(tag) }">
                # {{ tag.charAt(0).toUpperCase() + tag.slice(1) }}
              </div>
            </div>
          </div>
        </div>
        <div class="row no-gutters m-0">
          <div class="col-4 p-1" v-if="images[7]">
            <div
              class="bgImage small"
              :style="{
                backgroundImage: `url(${images[7].url})`
              }"
            />
            <div class="tag-row">
              <div v-for="(tag, i) in images[7].tags" :key="`tag2${i}`" class="tag-pill" :style="{ ...getColor(tag) }">
                # {{ tag.charAt(0).toUpperCase() + tag.slice(1) }}
              </div>
            </div>
          </div>
          <div class="col-8 p-1">
            <div
              v-if="this.project.moodboard.images[8]"
              class="bgImage small"
              :style="{
                backgroundImage: `url(${this.project.moodboard.images[8].url})`
              }"
            >
              <div
                v-if="this.project.moodboard.images.length > 9"
                class="bgImage small"
                @click="$router.push({ name: 'mood-images', params: { moodboardId: $route.params.moodboardId } })"
                :style="{
                  position: 'absolute',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 'calc(100% - 1rem)',
                  zIndex: 99,
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  cursor: 'pointer'
                }"
              >
                <div :style="{ fontSize: '32px', color: 'white' }">{{ `+${this.project.moodboard.images.length - 9}` }}</div>
              </div>
            </div>
          </div>
        </div>
      </div> -->
    </div>
    <div v-else class="no-images d-flex justify-content-center align-items-center flex-column">
      No images in this project yet
      <div
        v-if="!project.isArchived"
        :id="`${project.id}-2`"
        class="btn btn-rounded btn-primary alt-button mt-3"
        @click="handleUploadImageClick"
      >
        Add Images
      </div>
    </div>
    <AddContentPopover
      :target="`${project.id}-add-content`"
      @image="handleUploadImageClick"
      @article="handleArticleModal"
      @note="handleNoteModal"
      @link="handleLinkModal"
      @roomPlan="handleRoomPlanModal"
    />
    <AddContentPopover
      :target="`${project.id}-add-mob-content`"
      @image="handleUploadImageClick"
      @article="handleArticleModal"
      @note="handleNoteModal"
      @link="handleLinkModal"
      @roomPlan="handleRoomPlanModal"
    />
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
    <ArticleCreationModal
      :show="showArticleModal"
      :selectedProject="project.id"
      :userId="userId"
      @close="showArticleModal = false"
    />
    <NoteCreationModal :show="showNoteModal" :selectedProject="project.id" :userId="userId" @close="showNoteModal = false" />
    <AddLinkModal :show="showAddLinkModal" :selectedProject="project.id" @hide="showAddLinkModal = false" />
    <RoomPlanCreationModal
      :show="showAddRoomPlanModal"
      :selectedProject="project.id"
      @close="showAddRoomPlanModal = false"
      :habitat="project.habitat"
    />
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
import AddContentPopover from '@/components/views/popovers/AddContentPopover'
import ImageUploadModal from '@/components/views/modals/ImageUploadModal'
import ArticleCreationModal from '@/components/views/modals/ArticleCreationModal'
import AddLinkModal from '@/components/views/modals/AddLinkModal'
import NoteCreationModal from '@/components/views/modals/NoteCreationModal'
import RoomPlanCreationModal from '@/components/views/modals/RoomPlanCreationModal'
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
    AddContentPopover,
    ImageUploadModal,
    ArticleCreationModal,
    AddLinkModal,
    NoteCreationModal,
    RoomPlanCreationModal,
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
