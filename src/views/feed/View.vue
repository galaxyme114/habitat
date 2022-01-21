<template>
  <div id="feeds" :style="{ minHeight: exploreHeight }">
    <div class="feeds-container">
      <div>
        <h1 class="normal mb-2 d-md-block d-none">Feeds</h1>
        <h3 class="d-block d-md-none">Feeds</h3>
      </div>
      <div class="d-md-flex flex-md-row d-block px-1 px-md-0">
        <div class="d-md-flex flex-md-column left d-block">
          <div id="search-container">
            <div class="d-md-flex mb-md-3 input-wrap justify-content-between">
              <div :style="{ width: '70%', display: 'flex' }">
                <span class="mr-2">
                  <stream-line-icon :icon="Search.SearchBar" :stroke="iconColour" />
                </span>
                <input class="pl-2 input" placeholder="Keywords" v-on:keyup.enter="onSearch" v-model="searchTerm" />
              </div>
              <b-form-select v-model="searchSelect">
                <b-form-select-option :value="'all'">All</b-form-select-option>
                <b-form-select-option :value="'articles'">Articles</b-form-select-option>
                <b-form-select-option :value="'users'">Users</b-form-select-option>
                <b-form-select-option :value="'projects'">Projects</b-form-select-option>
              </b-form-select>
            </div>
            <div id="tag-container">
              <p>Popular Tags</p>
              <div id="popular-tags">
                <div
                  v-for="(tag, i) in popularTags"
                  class="tag-pill"
                  :key="`tag-${i}`"
                  @click="$router.push({ name: 'search', params: { type: searchSelect, term: tag } })"
                >
                  {{ tag }}
                </div>
              </div>
            </div>
          </div>
          <!-- feeds list -->
          <div class="tag-row" v-for="(tag, i) in followedTaggedProjects" :key="`tag-row-${i}`">
            <h2>{{ `#${tag.name}` }}</h2>
            <div :style="{ overflow: 'auto', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }">
              <tagged-project-preview v-for="(project, i) in tag.projects" :key="`${tag.name}-project-${i}`" :project="project" />
            </div>
          </div>
          <div class="tag-row" v-for="(user, i) in followedUserProjects" :key="`user-row-${i}`">
            <h2>{{ `${user.firstName} ${user.lastName}` }}</h2>
            <div :style="{ overflow: 'auto', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }">
              <tagged-project-preview
                v-for="(project, i) in user.projects"
                :key="`${project._id}-project-${i}`"
                :project="project"
              />
            </div>
          </div>
          <!-- /. -->
        </div>
        <div class="feeds-right-content right mt-sm-0 mt-1">
          <div id="followed-tags">
            <div class="title" style="color: #F04848">Tags You Followed</div>
            <div class="body">
              <div class="followed-tag-pill" v-for="(tag, i) in followedTags" :key="`followed-${i}`">
                <span># </span>{{ tag }} <span @click="removeFollowedTag"><stream-line-icon :icon="RemoveAdd.Remove" stroke="#000000" :size="10" stroke-width="2" /></span>
              </div>
              <div id="add-tag" @click="showModal = true">
                <stream-line-icon :icon="RemoveAdd.Add" stroke="#F04848" :size="14" stroke-width="2" />
              </div>
            </div>
          </div>
          <div id="followed-users">
            <div class="title" style="color: #50a14f">Users You Followed</div>
            <div class="body">
              <div class="followed-user-pill" v-for="(user, i) in followedUsers" :key="`followed-user-${i}`" :id="`followed-user-${i}`">
                <router-link  :to="`/public/profile/${user.userId}`">
                  <b-avatar v-if="user.image" variant="secondary" :src="user.image" size="2.5rem"></b-avatar>
                  <b-avatar v-else variant="secondary" :text="user.initialAvatarText" size="2.5rem"></b-avatar>
                  <b-popover :target="`followed-user-${i}`" triggers="hover" placement="top" custom-class="followed-user-popover">
                    <div class="user-fullname">{{ user.fullName }}</div>
                    <b>{{ user.projectsCount }}</b> Public projects
                  </b-popover>
                </router-link>
              </div>
              <router-link id="following-user" to="/feed/user-following">
                <stream-line-icon :icon="RemoveAdd.Add" stroke="#50a14f" :size="14" stroke-width="2" />
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-modal id="tag-modal" v-model="showModal" title="Follow">
      <b-form-input list="tag-list" v-model="selectedTag"></b-form-input>
      <b-form-datalist id="tag-list" :options="allTags"></b-form-datalist>
      <template #modal-footer="{ cancel }">
        <b-button size="sm" variant="primary" @click="handleAddTag"> OK </b-button>
        <b-button size="sm" variant="secondary" @click="cancel()"> Cancel </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import api from '@/api'
import { mapState } from 'vuex'
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import Search from '@streamlinehq/streamline-regular/lib/interface-essential/Search'
import RemoveAdd from '@streamlinehq/streamline-regular/lib/interface-essential/RemoveAdd'
import { BFormSelect, BModal, BFormDatalist, BButton, BFormInput, BFormSelectOption, BPopover } from 'bootstrap-vue'
import TaggedProjectPreview from '@/components/views/TaggedProjectPreview'
import { AGETAUTHENTICATEDUSER } from '@/store/action-types'

export default {
  components: {
    StreamLineIcon,
    BFormSelect,
    BModal,
    BPopover,
    BFormDatalist,
    BButton,
    BFormInput,
    TaggedProjectPreview,
    BFormSelectOption
  },
  data () {
    return {
      Search,
      RemoveAdd,
      showModal: false,
      allTags: [],
      popularTags: [],
      followedTags: [],
      followedTaggedProjects: [],
      followedUserProjects: [],
      selectedTag: '',
      searchSelect: 'projects',
      searchTerm: '',
      exploreHeight: '80vh',
      followedUsers: []
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
      user: (state) => state.auth.user
    })
  },
  methods: {
    async fetchPopularTags () {
      try {
        const tags = await api.tags.fetchPopular()
        this.popularTags = tags.data.map((tag) => tag.tag)
      } catch (e) {
        console.log(e)
      }
    },
    async fetchAllTags () {
      try {
        const tags = await api.tags.fetchAll()
        this.allTags = tags.data
      } catch (e) {
        console.log(e)
      }
    },
    async handleAddTag () {
      try {
        const updatedUser = await api.user.followTag(this.user.id, this.selectedTag)
        await this.$store.dispatch(AGETAUTHENTICATEDUSER)
        // TODO change this to fetch user again and update store
        this.followedTags = updatedUser.data.followed_tags
        this.selectedTag = ''
      } catch (e) {
        console.log(e)
      }
      this.showModal = false
    },
    async fetchProjectsForFollowedTags () {
      try {
        const projects = await api.tags.fetchFollowed(this.user.followed_tags)
        this.followedTaggedProjects = projects.data
        this.followedTaggedProjects.forEach((tag) => {
          tag.projects = tag.projects.filter((project) => !project.habitat.isArchived)
          tag.projects.sort(this.compare)
        })
        this.followedTaggedProjects = this.followedTaggedProjects.filter((array) => !array.length)
        // TODO change this to fetch user again and update store
      } catch (e) {
        console.log(e)
      }
    },
    async fetchProjectsForFollowedUsers () {
      try {
        const response = await api.tags.fetchFollowedUserProjects(this.user.followed_users)
        this.followedUserProjects = response.data
      } catch (e) {
        console.log(e)
      }
    },
    compare (a, b) {
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
    async onSearch () {
      if (this.searchSelect && this.searchTerm) {
        this.$router.push({ name: 'search', params: { type: this.searchSelect, term: this.searchTerm } })
      } else {
        this.$router.push('/feed/search')
      }
    },
    async fetchFollowedUsers () {
      try {
        const users = []
        const response = await api.user.fetchFollowedUsers(this.user.id)

        response.data.followed_users.forEach((user) => {
          const userData = {
            userId: user.id,
            image: user.image ? user.image.url : '',
            initialAvatarText: user.firstName ? user.firstName.substring(0, 1) + user.lastName.substring(0, 1) : '',
            fullName: user.fullName,
            projectsCount: 0
          }

          const habitats = user.habitats.owner
          let projectsCount = 0
          if (habitats.length > 0) {
            habitats.forEach((habitat) => {
              projectsCount += habitat.projects.length
            })
            userData.projectsCount = projectsCount
          }

          users.push(userData)
        })
        this.followedUsers = users
      } catch (e) {
        console.error(e)
      }
    },
    removeFollowedTag () {
      console.log('removeFollowedTag')
    }
  },
  mounted () {
    this.fetchPopularTags()
    this.fetchAllTags()
    this.fetchProjectsForFollowedTags()
    this.fetchProjectsForFollowedUsers()
    this.fetchFollowedUsers()
    this.followedTags = this.user.followed_tags
    this.exploreHeight = document.body.scrollHeight - 128 + 'px'
  }
}
</script>
