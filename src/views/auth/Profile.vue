<template>
  <div id="user-profile">
    <div class="user">
      <div class="user-info-wrap">
        <div
          v-if="user.image"
          class="profile-image"
          :style="{ backgroundImage: `url(${user.image.url})`, height: '120px', width: '120px' }"
        />
        <img v-else :src="placeholder" :alt="user.fullName" />
        <div class="user-info">
          <h3>{{ user.fullName }}</h3>
          <p>{{ user.bio }}</p>
        </div>
        <!-- <b-button pill size="sm" class="btn-primary d-block d-lg-none ml-1">Follow</b-button> -->
      </div>
      <div class="follow-buttons d-flex mt-3">
        <b-button pill size="sm" variant="light" class="btn-primary d-lg-none mr-2" style="color: #a7c7c5 !important">{{ user.followers.length }} followers</b-button>
        <b-button pill size="sm" variant="light" class="btn-primary d-lg-none" style="color: #f26b6b !important">{{ user.followed_users.length }} following</b-button>
      </div>
      <!-- <div class="user-buttons">
        <b-button variant="light" class="btn btn-rounded btn-primary d-none d-lg-block">Follow</b-button>
      </div> -->
      <div class="follow-buttons d-flex">
        <b-button variant="light" class="btn btn-rounded btn-primary d-none d-lg-block mr-2" style="color: #a7c7c5 !important">{{ user.followers.length }} followers</b-button>
        <b-button variant="light" class="btn btn-rounded btn-primary d-none d-lg-block" style="color: #f26b6b !important">{{ user.followed_users.length }} following</b-button>
      </div>
    </div>
    <div class="filter-bar">
      <div class="content-types">
        <span class="icon-border">
          <div class="d-flex align-items-center" @click="focus">
              <stream-line-icon
                :height="16"
                :width="16"
                :icon="Search.Search"
                :stroke="iconColour"
              />
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
        <div class="item-border" :class="{ highlight: selected == 'habitats' }" @click="selected = 'habitats'">Habitats</div>
        <div class="item-border" :class="{ highlight: selected == 'projects' }" @click="selected = 'projects'">Projects</div>
        <div class="item-border" :class="{ highlight: selected == 'articles' }" @click="selected = 'articles'">Articles</div>
      </div>
      <b-button class="d-flex align-items-center" id="filter-button" ref="filterButton">
        <div>{{ filterLabel }}</div>
        <span class="px-2">
          <stream-line-icon :icon="Arrows.ArrowDown1" :stroke="iconColour" :size="14" />
        </span>
      </b-button>
    </div>
    <div class="content-wrap">
      <div class="row" v-if="selected === 'habitats'">
        <div v-for="(habitat, i) in displayed" :key="'habitat' + i" class="col-12 col-md-6 col-lg-4">
          <HabitatPreview :habitat="habitat" @ok="fetchHabitats" />
        </div>
      </div>
      <div class="row" v-else-if="selected === 'projects'">
        <div v-for="(project, i) in displayed" :key="'project' + i" class="col-12 col-md-6 col-lg-4">
          <ProfileProjectPreview :project="project" @ok="fetchHabitats" />
        </div>
      </div>
      <stack
        monitor-images-loaded
        :column-min-width="250"
        :gutter-width="8"
        :gutter-height="8"
        horizontal
        v-else-if="selected === 'articles'"
      >
        <stack-item v-for="(article, i) in articles" :key="i">
          <ArticlePreview
            :article="article"
            @onClick="handleArticleNavigation(article.project.habitat, article.project.id, article.id)"
          />
        </stack-item>
      </stack>
    </div>
    <b-popover id="filter-menu-popover" target="filter-button" :placement="'bottom'" triggers="focus">
      <div @click="selectFilter('recent')" class="dropdown-item">Most Recent</div>
      <div @click="selectFilter('alphabetical')" class="dropdown-item">A - Z</div>
    </b-popover>
  </div>
</template>
<script>
import { AGETAUTHENTICATEDUSER, ALOADHABITATS } from '@/store/action-types'
import { mapState } from 'vuex'
import placeholder from '@/assets/icons/placeholder@2x.png'
import { BButton, BPopover } from 'bootstrap-vue'
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import Search from '@streamlinehq/streamline-regular/lib/interface-essential/Search'
import Arrows from '@streamlinehq/streamline-regular/lib/arrows-diagrams/Arrows'
import Delete from '@streamlinehq/streamline-regular/lib/interface-essential/Delete'
import HabitatPreview from '@/components/views/HabitatPreview'
import ProfileProjectPreview from '@/components/views/ProfileProjectPreview'
import ArticlePreview from '@/components/views/ArticlePreview'
import { Stack, StackItem } from 'vue-stack-grid'

export default {
  components: {
    BButton,
    BPopover,
    StreamLineIcon,
    HabitatPreview,
    ProfileProjectPreview,
    ArticlePreview,
    Stack,
    StackItem
  },
  data () {
    return {
      placeholder,
      Search,
      Arrows,
      Delete,
      selected: 'habitats',
      projects: [],
      articles: [],
      search: null,
      filter: 'recent'
    }
  },
  computed: {
    ...mapState({
      iconColour: (state) => {
        if (state.auth.user === null || state.auth.user.theme === 'light') {
          return '#1E212B'
        }

        return 'ffffff'
      },
      user: (state) => state.auth.user,
      habitats: (state) => state.habitats.habitats
    }),
    displayed: function () {
      let toReturn
      switch (this.selected) {
        case 'habitats':
          if (this.search) {
            toReturn = this.habitats.filter((habitat) => habitat.name.toLowerCase().includes(this.search.toLowerCase()))
          } else {
            toReturn = this.habitats
          }
          break
        case 'projects':
          if (this.search) {
            toReturn = this.projects.filter((project) => project.name.toLowerCase().includes(this.search.toLowerCase()))
          } else {
            toReturn = this.projects
          }
          break
        case 'articles':
          return this.articles
        default:
          return []
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
    habitats: {
      deep: true,
      handler: function (newVal) {
        this.projects = []
        this.articles = []
        newVal.forEach((habitat) => {
          this.projects = this.projects.concat(habitat.projects)
          habitat.projects.forEach((project) => {
            this.articles = this.articles.concat(project.articles)
          })
        })
      }
    }
  },
  methods: {
    async fetchUser () {
      await this.$store.dispatch(AGETAUTHENTICATEDUSER)
    },
    async fetchHabitats () {
      await this.$store.dispatch(ALOADHABITATS)
    },
    handleArticleNavigation (habitatId, projectId, articleId) {
      this.$router.push({
        name: 'article-view',
        params: { habitatId, projectId, articleId }
      })
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
  mounted () {
    this.fetchUser()
    this.fetchHabitats()
  }
}
</script>
