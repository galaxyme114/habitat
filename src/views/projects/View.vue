<template>
  <div id="project-container" class="entry">
    <div class="container">
      <div class="d-flex justify-content-between align-items-end">
        <div class="entry-header">
          <b-breadcrumb>
            <b-breadcrumb-item href="/habitats">Habitats</b-breadcrumb-item>
            <b-breadcrumb-item :to="{ name: 'habitat-view', params: { habitatId: $route.params.habitatId } }">{{
              project.habitat.name
            }}</b-breadcrumb-item>
            <b-breadcrumb-item active>{{ project.name }}</b-breadcrumb-item>
          </b-breadcrumb>
          <div class="d-flex align-items-end">
            <div>
              <h2>{{ project.name }}</h2>
              <!-- <small class="habitat-address">{{ habitat && habitat.address ? habitat.address.fullAddress : '' }}</small> -->
            </div>
          </div>
        </div>
        <div class="d-flex">
          <b-button @click="focusButton" ref="button" variant="primary" class="mr-1" id="add-content-button"
            >+ Add Content</b-button
          >
          <!-- <b-button variant="light" id="share-button" class="mr-1" @click="shareProject">
            <span><stream-line-icon :icon="GeomerticCloseUpMultipleUsers.MultipleManWoman1" :stroke="iconColour"/></span
            >Share
          </b-button> -->
          <b-button variant="light" id="settings-button" @click="showSettingsModal = true">
            <b-icon-gear></b-icon-gear>
          </b-button>
          <!-- <b-button variant="light" id="settings-button" @click="showHabitatSettingsModal = true">
            <b-icon-gear></b-icon-gear>
          </b-button> -->
        </div>
      </div>
    </div>

    <div class="settings-container mt-3">
      <div class="d-flex d-lg-none">
        <b-button
          variant="outline-primary"
          v-if="!project.isArchived"
          @click="mobFocus"
          ref="mobButton"
          id="add-content-mob-button"
          class="d-block d-lg-none"
        >
          <stream-line-icon :icon="RemoveAdd.Add" :stroke="iconColour" :size="20" />
        </b-button>
        <b-button
          :id="`project-menu`"
          @click="focusProjectButton"
          ref="projectButton"
          class="ml-2 d-flex align-items-center btn-outline-secondary bg-transparent"
        >
          <stream-line-icon :icon="Menu.NavigationMenuHorizontal" :stroke="iconColour" :size="20" />
        </b-button>
      </div>
    </div>

    <div class="moodboard-container">
      <NoProjectContent v-if="!project.moodboard.images.length" @onClick="noContentFocus" ref="no-content" />
      <div class="row no-gutters m-0 flex-nowrap flex-lg-wrap project-images">
        <div class="col-10 col-sm-8 col-md-6 col-lg-4 p-1 project-image">
          <div v-if="this.project.moodboard.images[0]">
            <div
              class="bgImage"
              :style="{
                backgroundImage: `url(${this.project.moodboard.images[0].url})`
              }"
            />
            <button
              class="delete-button"
              @click="confirmDelete(project.moodboard.images[0].id)"
            >
              <stream-line-icon :icon="RemoveAdd.Remove" stroke="#f26b6b" :size="20" />
            </button>
          </div>
        </div>
        <div class="col-10 col-sm-8 col-md-4 col-lg-2">
          <div class="row no-gutters m-0">
            <div class="col p-1 project-image">
              <div v-if="this.project.moodboard.images[1]">
                <div
                  class="bgImage small"
                  :style="{
                    backgroundImage: `url(${this.project.moodboard.images[1].url})`
                  }"
                />
                <button
                  class="delete-button"
                  @click="confirmDelete(project.moodboard.images[1].id)"
                >
                  <stream-line-icon :icon="RemoveAdd.Remove" stroke="#f26b6b" :size="20" />
                </button>
              </div>
            </div>
          </div>
          <div class="row no-gutters m-0">
            <div class="col-6 p-1 project-image">
              <div v-if="this.project.moodboard.images[2]">
                <div
                  class="bgImage small"
                  :style="{
                    backgroundImage: `url(${this.project.moodboard.images[2].url})`
                  }"
                />
                <button
                  class="delete-button"
                  @click="confirmDelete(project.moodboard.images[2].id)"
                >
                  <stream-line-icon :icon="RemoveAdd.Remove" stroke="#f26b6b" :size="20" />
                </button>
              </div>
            </div>
            <div class="col-6 p-1 project-image">
              <div v-if="this.project.moodboard.images[3]">
                <div
                  class="bgImage small"
                  :style="{
                    backgroundImage: `url(${this.project.moodboard.images[3].url})`
                  }"
                />
                <button
                  class="delete-button"
                  @click="confirmDelete(project.moodboard.images[3].id)"
                >
                  <stream-line-icon :icon="RemoveAdd.Remove" stroke="#f26b6b" :size="20" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-10 col-sm-8 col-md-4 col-lg-2">
          <div class="row no-gutters m-0">
            <div class="col p-1 project-image">
              <div v-if="this.project.moodboard.images[4]">
                <div
                  class="bgImage"
                  :style="{
                    backgroundImage: `url(${this.project.moodboard.images[4].url})`
                  }"
                />
                <button
                  class="delete-button"
                  @click="confirmDelete(project.moodboard.images[4].id)"
                >
                  <stream-line-icon :icon="RemoveAdd.Remove" stroke="#f26b6b" :size="20" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-4">
          <div class="row no-gutters m-0">
            <div class="col-8 p-1 project-image">
              <div v-if="this.project.moodboard.images[5]">
                <div
                  class="bgImage small"
                  :style="{
                    backgroundImage: `url(${this.project.moodboard.images[5].url})`
                  }"
                />
                <button
                  class="delete-button"
                  @click="confirmDelete(project.moodboard.images[5].id)"
                >
                  <stream-line-icon :icon="RemoveAdd.Remove" stroke="#f26b6b" :size="20" />
                </button>
              </div>
            </div>
            <div class="col-4 p-1 project-image">
              <div v-if="this.project.moodboard.images[6]">
                <div
                  class="bgImage small"
                  :style="{
                    backgroundImage: `url(${this.project.moodboard.images[6].url})`
                  }"
                />
                <button
                  class="delete-button"
                  @click="confirmDelete(project.moodboard.images[6].id)"
                >
                  <stream-line-icon :icon="RemoveAdd.Remove" stroke="#f26b6b" :size="20" />
                </button>
              </div>
            </div>
          </div>
          <div class="row no-gutters m-0">
            <div class="col-4 p-1 project-image">
              <div v-if="project.moodboard.images[7]">
                <div
                  class="bgImage small"
                  :style="{
                    backgroundImage: `url(${this.project.moodboard.images[7].url})`
                  }"
                />
                <button
                  class="delete-button"
                  @click="confirmDelete(project.moodboard.images[7].id)"
                >
                  <stream-line-icon :icon="RemoveAdd.Remove" stroke="#f26b6b" :size="20" />
                </button>
              </div>
            </div>
            <div class="col-8 p-1 project-image">
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
                  @click="$router.push({ name: 'moodboard', params: { projectId: $route.params.projectId } })"
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
                  <div :style="{ fontSize: '32px', color: 'white' }">
                    {{ `+${this.project.moodboard.images.length - 9}` }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <hr />

    <div class="container ">
      <div class="row justify-content-between mt-5 ">
        <div class="col">
          <h4 class="mt-2">Resources</h4>
        </div>
        <!-- <div class="col text-right">
        <b-button ref="no-content-button" variant="outline-primary" @click="handleCreateClick()">+ Create Project</b-button>
      </div> -->
      </div>

      <div class="d-flex flex-column justify-content-center mt-1">
        <!-- <div class="content-bar"> -->
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
            <button
              ref="all"
              id="all"
              class="item-border"
              :class="{ highlight: selected == 'all' }"
              @click="
                selected = 'all'
                $refs.all.focus()
              "
            >
              All
            </button>
            <button
              ref="articles"
              id="articles"
              class="item-border"
              :class="{ highlight: selected == 'article' }"
              @click="
                selected = 'article'
                $refs.articles.focus()
              "
            >
              Articles
            </button>
            <button
              ref="links"
              id="links"
              class="item-border"
              :class="{ highlight: selected == 'link' }"
              @click="
                selected = 'link'
                $refs.links.focus()
              "
            >
              Links
            </button>
            <button
              ref="notes"
              id="notes"
              class="item-border"
              :class="{ highlight: selected == 'note' }"
              @click="
                selected = 'note'
                $refs.notes.focus()
              "
            >
              Notes
            </button>
            <button
              ref="floor-plans"
              id="floor-plans"
              class="item-border"
              :class="{ highlight: selected == 'floor-plan' }"
              @click="
                selected = 'floor-plan'
                $refs['floor-plan'].focus()
              "
            >
              Floor Plans
            </button>
          </div>
          <b-button class="d-flex align-items-center" id="filter-button" ref="filterButton" @click="filterFocus">
            <div>{{ filterLabel }}</div>
            <span class="px-2">
              <stream-line-icon :icon="Arrows.ArrowDown1" :stroke="iconColour" :size="14" />
            </span>
          </b-button>
        </div>
        <!-- </div> -->
        <div class="d-none d-sm-block p-0 p-lg-3" :style="{ minHeight: '400px' }">
          <stack
            monitor-images-loaded
            :column-min-width="320"
            :gutter-width="8"
            :gutter-height="8"
            ref="stackRef"
            v-if="changed"
          >
            <stack-item v-for="(resource, i) in toRender" :key="`resource-${i}`" class="fade-in">
              <article-preview
                v-if="resource.type === 'article'"
                :article="resource"
                @onClick="handleArticleNavigation(resource.id)"
                class="cursor"
              />
              <link-preview v-else-if="resource.type === 'link'" :link="resource" />
              <note-preview v-else-if="resource.type === 'note'" :note="resource" />
              <room-plan-preview
                v-else-if="resource.type === 'floor-plan'"
                :room-plan="resource"
                @click="
                  $router.push({
                    name: 'room-plans-edit',
                    params: {
                      habitatId: $route.params.habitatId,
                      projectId: $route.params.projectId,
                      roomPlanId: resource.id
                    }
                  })
                "
                class="cursor"
              />
            </stack-item>
          </stack>
          <div v-else :style="{ height: '500px' }" />
        </div>
        <div class="d-block d-sm-none p-0 p-lg-3" :style="{ minHeight: '400px' }">
          <stack
            monitor-images-loaded
            :column-min-width="160"
            :gutter-width="8"
            :gutter-height="8"
            ref="stackRef"
            v-if="changed"
          >
            <stack-item v-for="(resource, i) in toRender" :key="`resource-${i}`" class="fade-in">
              <article-preview
                v-if="resource.type === 'article'"
                :article="resource"
                @onClick="handleArticleNavigation(resource.id)"
                class="cursor"
                @refresh="refresh"
              />
              <link-preview v-else-if="resource.type === 'link'" :link="resource" @refresh="refresh" />
              <note-preview
                v-else-if="resource.type === 'note'"
                :note="resource"
                @refresh="refresh"
                :activeUsers="project.habitat.users"
              />
              <room-plan-preview
                v-else-if="resource.type === 'floor-plan'"
                :room-plan="resource"
                @click="
                  $router.push({
                    name: 'room-plans-edit',
                    params: {
                      habitatId: $route.params.habitatId,
                      projectId: $route.params.projectId,
                      roomPlanId: resource.id
                    }
                  })
                "
                class="cursor"
                @refresh="refresh"
              />
            </stack-item>
          </stack>
          <div v-else :style="{ height: '500px' }" />
        </div>
      </div>
      <b-popover id="filter-menu-popover" target="filter-button" :placement="'bottom'" triggers="focus">
        <div @click="selectFilter('recent')" class="dropdown-item">Most Recent</div>
        <div @click="selectFilter('alphabetical')" class="dropdown-item">A - Z</div>
      </b-popover>
      <ProjectSettingsModal
        v-if="showSettingsModal"
        :show="showSettingsModal"
        @closeModal="closeSettingsModal"
        :project="this.project"
        @projectSaved="refresh()"
      />
      <AddContentPopover
        :target="'add-content-button'"
        @image="handleUploadImageClick"
        @article="handleArticleModal"
        @note="handleNoteModal"
        @link="handleLinkModal"
        @roomPlan="handleRoomPlanModal"
      />
      <AddContentPopover
        :target="'add-content-mob-button'"
        @image="handleUploadImageClick"
        @article="handleArticleModal"
        @note="handleNoteModal"
        @link="handleLinkModal"
        @roomPlan="handleRoomPlanModal"
      />
      <AddContentPopover
        :target="'no-content-button'"
        @image="handleUploadImageClick"
        @article="handleArticleModal"
        @note="handleNoteModal"
        @link="handleLinkModal"
        @roomPlan="handleRoomPlanModal"
      />
      <ImageUploadModal
        @ok="fetchHabitat($route.params.habitatId)"
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
      <NoteCreationModal
        :show="showNoteModal"
        :selectedProject="project.id"
        :activeUsers="project.habitat.users"
        :userId="userId"
        @close="showNoteModal = false"
        @ok="refresh()"
      />
      <AddLinkModal :show="showAddLinkModal" :selectedProject="project.id" @hide="showAddLinkModal = false" @ok="refresh" />
      <DeleteImageModal
        :show="showConfirmDeleteModal"
        :selectedImageId="selectedImageId"
        :moodboardId="project.moodboard.id"
        @close="showConfirmDeleteModal = false"
        @ok="refresh"
      />
      <RoomPlanCreationModal
        :show="showAddRoomPlanModal"
        :selectedProject="project.id"
        @close="showAddRoomPlanModal = false"
        :habitat="project.habitat.id"
      />
      <!-- <ProjectMenuPopover
        :target="`project-menu`"
        @navigate="handleViewProject"
        @archive="handleArchiveProject"
        @unarchive="handleArchiveProject(false)"
        @settings="showSettingsModal = true"
        @share="shareProject"
        :isArchived="project.isArchived"
      /> -->
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { BBreadcrumb, BBreadcrumbItem, BButton, BPopover, BIconGear } from 'bootstrap-vue'
import api from '@/api'
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import ColorsPainting from '@streamlinehq/streamline-regular/lib/design/ColorsPainting'
import TravelMetaphor from '@streamlinehq/streamline-regular/lib/travel/TravelMetaphor'
import Search from '@streamlinehq/streamline-regular/lib/interface-essential/Search'
import Delete from '@streamlinehq/streamline-regular/lib/interface-essential/Delete'
import Settings from '@streamlinehq/streamline-regular/lib/interface-essential/Settings'
import Arrows from '@streamlinehq/streamline-regular/lib/arrows-diagrams/Arrows'
import Folders from '@streamlinehq/streamline-regular/lib/files-folders/Folders'
import GeomerticCloseUpMultipleUsers from '@streamlinehq/streamline-regular/lib/users/GeomerticCloseUpMultipleUsers'
import ArticlePreview from '@/components/views/ArticlePreview'
import RoomPlanPreview from '@/components/views/RoomPlanPreview'
import LinkPreview from '@/components/views/LinkPreview'
import NotePreview from '@/components/views/NotePreview'
import { Stack, StackItem } from 'vue-stack-grid'
import ProjectSettingsModal from '@/components/common/ProjectSettingsModal'
import AddLinkModal from '@/components/views/modals/AddLinkModal'
import NoteCreationModal from '@/components/views/modals/NoteCreationModal'
import ArticleCreationModal from '@/components/views/modals/ArticleCreationModal'
import ImageUploadModal from '@/components/views/modals/ImageUploadModal'
import AddContentPopover from '@/components/views/popovers/AddContentPopover'
// import ProjectMenuPopover from '@/components/views/popovers/ProjectMenuPopover'
import RoomPlanCreationModal from '@/components/views/modals/RoomPlanCreationModal'
import DeleteImageModal from '@/components/views/modals/DeleteImageModal'
import NoProjectContent from './common/NoProjectContent'
import RemoveAdd from '@streamlinehq/streamline-regular/lib/interface-essential/RemoveAdd'
import Menu from '@streamlinehq/streamline-regular/lib/interface-essential/Menu'

export default {
  components: {
    StreamLineIcon,
    BBreadcrumb,
    BBreadcrumbItem,
    BButton,
    BPopover,
    BIconGear,
    NoProjectContent,
    Stack,
    StackItem,
    ProjectSettingsModal,
    ArticlePreview,
    RoomPlanPreview,
    LinkPreview,
    NotePreview,
    AddLinkModal,
    NoteCreationModal,
    ArticleCreationModal,
    ImageUploadModal,
    AddContentPopover,
    // ProjectMenuPopover,
    RoomPlanCreationModal,
    DeleteImageModal
  },
  data () {
    return {
      ColorsPainting,
      TravelMetaphor,
      Folders,
      Search,
      Delete,
      RemoveAdd,
      Menu,
      Arrows,
      GeomerticCloseUpMultipleUsers,
      Settings,
      selected: 'all',
      project: {
        habitat: {
          name: ''
        },
        name: '',
        moodboard: {
          id: '',
          images: []
        },
        articles: []
      },
      landscapeImages: [],
      portraitImages: [],
      showSettingsModal: false,
      showAddContentPopover: false,
      showMenuPopover: false,
      showUploadModal: false,
      showArticleModal: false,
      showNoteModal: false,
      showColourPicker: false,
      showAddLinkModal: false,
      showAddRoomPlanModal: false,
      showConfirmDeleteModal: false,
      focused: false,
      search: '',
      resources: [],
      changed: true,
      filter: 'recent',
      selectedImageId: ''
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
      userId: state => state.auth.user.id
    }),
    toRender: function () {
      let toReturn
      // filter out type
      if (this.selected === 'all') {
        toReturn = this.resources
      } else {
        toReturn = this.resources.filter(resource => resource.type === this.selected)
      }

      // filter out by search
      if (this.search) {
        toReturn = toReturn.filter(resource => {
          if (resource.name) {
            return resource.name.toLowerCase().includes(this.search.toLowerCase())
          }
        })
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
  watch: {
    toRender: function () {
      this.changed = false
      setTimeout(() => {
        this.changed = true
      }, 50)
    }
  },
  methods: {
    confirmDelete (imageId) {
      console.log(imageId)
      this.selectedImageId = imageId
      this.showConfirmDeleteModal = true
    },
    async fetchProject () {
      const response = await api.projects.get(this.$route.params.projectId)

      this.project = response
      this.project.articles.forEach(article => {
        this.resources.push({ ...article, type: 'article' })
      })
      this.project.links.forEach(link => {
        this.resources.push({ ...link, type: 'link' })
      })
      this.project.notes.forEach(note => {
        this.resources.push({ ...note, type: 'note' })
      })
      this.project.roomPlans.forEach(roomPlan => {
        this.resources.push({ ...roomPlan, type: 'floor-plan' })
      })
    },
    async shareProject () {
      try {
        const response = await api.projects.update({ id: this.project.id, isPublic: true })
        this.project = response.data
        this.$toasted.success('Project shared')
      } catch (e) {
        this.$toasted.error('Project not shared')
      }
    },
    handleArticleNavigation (articleId) {
      this.$router.push({
        name: 'article-view',
        params: { habitatId: this.project.habitat.id, projectId: this.project.id, articleId: articleId }
      })
    },
    async handleArchiveProject (isArchived = true) {
      try {
        await api.projects.update({ id: this.project.id, isArchived })
        this.$toasted.success(isArchived ? 'Project Archived' : 'Project Unarchived')
        this.fetchProject()
      } catch (e) {
        this.$toasted.error('Project not archived')
      }
    },
    closeSettingsModal () {
      this.showSettingsModal = false
    },
    refresh () {
      this.resources = []
      this.fetchProject()
    },
    handleUploadImageClick () {
      this.showAddContentPopover = false
      this.showUploadModal = true
    },
    handleNoteModal () {
      this.showAddContentPopover = false
      this.showNoteModal = true
    },
    handleArticleModal () {
      this.showAddContentPopover = false
      this.showArticleModal = true
    },
    handleLinkModal () {
      this.showAddContentPopover = false
      this.showAddLinkModal = true
    },
    handleRoomPlanModal () {
      this.showAddContentPopover = false
      this.showAddRoomPlanModal = true
    },
    focus () {
      this.$refs.searchRef.focus()
    },
    focusButton () {
      this.$refs.button.focus()
    },
    mobFocus () {
      this.$refs.mobButton.focus()
    },
    focusProjectButton () {
      this.$refs.projectButton.focus()
    },
    filterFocus () {
      this.$refs.filterButton.focus()
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
    selectFilter (filter) {
      this.filter = filter
    },
    noContentFocus () {
      this.$refs['no-content'].$refs['no-content-button'].focus()
    }
  },
  async mounted () {
    await this.fetchProject()
    window.dispatchEvent(new Event('resize'))
  }
}
</script>
<style scoped>
.bgImage {
  background-size: cover;
  background-position: center;
  height: 416px;
  border-radius: 20px;
  z-index: 99;
}
.small {
  height: 200px;
}
.pills-container {
  flex-wrap: wrap;
  margin-top: 25px;
  height: 50px;
  width: 90%;
}
.pill {
  cursor: pointer;
  width: 227px;
  background-color: #fff;
  border-radius: 24px;
  box-shadow: 0px 4px 8px rgba(30, 33, 43, 0.05);
  padding: 10px;
  margin: 10px;
}
.pill-badge {
  width: 40px;
  height: 28px;
  color: #fff;
  background-color: #f26b6b;
  border-radius: 16px;
}
.content-bar {
  width: 80%;
}
.cursor {
  cursor: pointer;
}
</style>
