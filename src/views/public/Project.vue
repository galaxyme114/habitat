<template>
  <div class="container px-0 px-lg-1" id="project-container">
    <h1 class="d-none d-lg-block" :style="{ paddingLeft: '16px' }">{{ project.name }}</h1>
    <h4 class="d-block d-lg-none" :style="{ paddingLeft: '16px' }">{{ project.name }}</h4>
    <div class="moodboard-container">
      <div class="row no-gutters m-0 flex-nowrap flex-sm-wrap">
        <div class="col-10 col-md-4 p-1">
          <div
            v-if="this.project.moodboard.images[0]"
            class="bgImage"
            :style="{
              backgroundImage: `url(${this.project.moodboard.images[0].url})`
            }"
          />
        </div>
        <div class="col-10 col-md-2">
          <div class="row no-gutters m-0">
            <div class="col p-1">
              <div
                v-if="this.project.moodboard.images[1]"
                class="bgImage small"
                :style="{
                  backgroundImage: `url(${this.project.moodboard.images[1].url})`
                }"
              />
            </div>
          </div>
          <div class="row no-gutters m-0">
            <div class="col-12 col-md-6 p-1">
              <div
                v-if="this.project.moodboard.images[2]"
                class="bgImage small"
                :style="{
                  backgroundImage: `url(${this.project.moodboard.images[2].url})`
                }"
              />
            </div>
            <div class="col-12 col-md-6 p-1">
              <div
                v-if="this.project.moodboard.images[3]"
                class="bgImage small"
                :style="{
                  backgroundImage: `url(${this.project.moodboard.images[3].url})`
                }"
              />
            </div>
          </div>
        </div>
        <div class="col-12 col-md-2">
          <div class="row no-gutters m-0">
            <div class="col p-1">
              <div
                v-if="this.project.moodboard.images[4]"
                class="bgImage"
                :style="{
                  backgroundImage: `url(${this.project.moodboard.images[4].url})`
                }"
              />
            </div>
          </div>
        </div>
        <div class="col-12 cold-md-4">
          <div class="row no-gutters m-0">
            <div class="col-8 p-1">
              <div
                v-if="this.project.moodboard.images[5]"
                class="bgImage small"
                :style="{
                  backgroundImage: `url(${this.project.moodboard.images[5].url})`
                }"
              />
            </div>
            <div class="col-4 p-1">
              <div
                v-if="this.project.moodboard.images[6]"
                class="bgImage small"
                :style="{
                  backgroundImage: `url(${this.project.moodboard.images[6].url})`
                }"
              />
            </div>
          </div>
          <div class="row no-gutters m-0">
            <div class="col-12 col-md-4 p-1">
              <div
                v-if="this.project.moodboard.images[7]"
                class="bgImage small"
                :style="{
                  backgroundImage: `url(${this.project.moodboard.images[7].url})`
                }"
              />
            </div>
            <div class="col-12 col-md-8 p-1">
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
    <div class="d-flex flex-column justify-content-center mt-5">
      <div class="content-bar">
        <h3 class="d-none d-lg-block">Resources</h3>
        <h4 class="d-block d-lg-none">Resources</h4>
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
      </div>
      <div class="d-none d-lg-block p-3">
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
              :article="resource.data"
              @onClick="handleArticleNavigation(resource.data.id)"
              class="cursor"
            />
            <link-preview v-else-if="resource.type === 'link'" :link="resource.data" />
            <note-preview v-else-if="resource.type === 'note'" :note="resource.data" />
            <room-plan-preview
              v-else-if="resource.type === 'floor-plan'"
              :room-plan="resource.data"
              @click="
                $router.push({
                  name: 'room-plans-edit',
                  params: { habitatId: project.habitat.id, projectId: project.id, roomPlanId: resource.data.id }
                })
              "
              class="cursor"
            />
          </stack-item>
        </stack>
        <div v-else :style="{ height: '500px' }" />
      </div>
      <div class="d-md-none d-md-block">
        <stack
          monitor-images-loaded
          :column-min-width="240"
          :gutter-width="8"
          :gutter-height="8"
          ref="stackRef"
          v-if="changed"
        >
          <stack-item v-for="(resource, i) in toRender" :key="`resource-${i}`" class="fade-in">
            <article-preview
              v-if="resource.type === 'article'"
              :article="resource.data"
              @onClick="handleArticleNavigation(resource.data.id)"
              class="cursor"
            />
            <link-preview v-else-if="resource.type === 'link'" :link="resource.data" />
            <note-preview v-else-if="resource.type === 'note'" :note="resource.data" />
            <room-plan-preview
              v-else-if="resource.type === 'floor-plan'"
              :room-plan="resource.data"
              @click="
                $router.push({
                  name: 'room-plans-edit',
                  params: { habitatId: project.habitat.id, projectId: project.id, roomPlanId: resource.data.id }
                })
              "
              class="cursor"
            />
          </stack-item>
        </stack>
        <div v-else :style="{ height: '500px' }" />
      </div>
      <div class="d-block d-sm-none">
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
              :article="resource.data"
              @onClick="handleArticleNavigation(resource.data.id)"
              class="cursor"
            />
            <link-preview v-else-if="resource.type === 'link'" :link="resource.data" />
            <note-preview v-else-if="resource.type === 'note'" :note="resource.data" />
            <room-plan-preview
              v-else-if="resource.type === 'floor-plan'"
              :room-plan="resource.data"
              @click="
                $router.push({
                  name: 'room-plans-edit',
                  params: { habitatId: project.habitat.id, projectId: project.id, roomPlanId: resource.data.id }
                })
              "
              class="cursor"
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
  </div>
</template>
<script>
import { mapState } from 'vuex'
import api from '@/api'
import { BPopover, BButton } from 'bootstrap-vue'
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import ColorsPainting from '@streamlinehq/streamline-regular/lib/design/ColorsPainting'
import TravelMetaphor from '@streamlinehq/streamline-regular/lib/travel/TravelMetaphor'
import Search from '@streamlinehq/streamline-regular/lib/interface-essential/Search'
import Arrows from '@streamlinehq/streamline-regular/lib/arrows-diagrams/Arrows'
import Folders from '@streamlinehq/streamline-regular/lib/files-folders/Folders'
import LinkUnlink from '@streamlinehq/streamline-regular/lib/interface-essential/LinkUnlink'
import Delete from '@streamlinehq/streamline-regular/lib/interface-essential/Delete'
import ArticlePreview from '@/components/views/ArticlePreview'
import RoomPlanPreview from '@/components/views/RoomPlanPreview'
import LinkPreview from '@/components/views/LinkPreview'
import NotePreview from '@/components/views/NotePreview'
import { Stack, StackItem } from 'vue-stack-grid'
import placeholder from '@/assets/icons/placeholder@2x.png'

export default {
  name: 'PublicProject',
  components: {
    StreamLineIcon,
    ArticlePreview,
    RoomPlanPreview,
    LinkPreview,
    NotePreview,
    Stack,
    StackItem,
    BPopover,
    BButton
  },
  data () {
    return {
      ColorsPainting,
      TravelMetaphor,
      Folders,
      Search,
      Arrows,
      LinkUnlink,
      Delete,
      placeholder,
      selected: 'all',
      project: {
        habitat: {
          name: ''
        },
        name: '',
        moodboard: {
          images: []
        }
      },
      landscapeImages: [],
      portraitImages: [],
      focused: false,
      search: '',
      resources: [],
      changed: true,
      filter: 'recent'
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
    })
  },
  methods: {
    async fetchProject () {
      const response = await api.publicApi.getProject(this.$route.params.projectId)
      this.project = response.data
      console.log(this.project)
      this.project.articles.forEach(article => {
        this.resources.push({ type: 'article', data: article })
      })
      this.project.links.forEach(link => {
        this.resources.push({ type: 'link', data: link })
      })
      this.project.notes.forEach(note => {
        this.resources.push({ type: 'note', data: note })
      })
      this.project.roomPlans.forEach(roomPlan => {
        this.resources.push({ type: 'floor-plan', data: roomPlan })
      })
    },
    focus () {
      this.$refs.searchRef.focus()
    },
    handleArticleNavigation (articleId) {
      this.$router.push({
        name: 'public-article',
        params: { articleId }
      })
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
    filterFocus () {
      this.$refs.filterButton.focus()
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
  mounted () {
    this.fetchProject()
  }
}
</script>
