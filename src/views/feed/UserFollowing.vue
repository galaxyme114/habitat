<template>
  <div id="user-following">
    <div class="container">
      <div id="header-box" class="justify-content-center">
        <h3 id="title" class="mb-1"><strong>Add to your feed</strong></h3>
        <p id="description" class="text-center">You can populate their interests with following.</p>
        <div class="input-wrap shadow">
          <span class="mr-2">
            <stream-line-icon :icon="Search.SearchBar" :stroke="'#1e212b'" />
          </span>
          <input class="input  pl-2" placeholder="Search" v-model="searchText" v-on:keyup.enter="onSearch" />
        </div>
      </div>
      <div :style="{ height: '50px', width: '50px', margin: '10px 0px 10px -25px', position: 'absolute', left: '50%' }">
        <loader :loading="loading" colour="#f26b6b" />
      </div>
      <div class="d-flex justify-content-center">
        <div class="user-list">
          <div
            v-for="(user, i) in followingUsers"
            class="d-table table-fixed col-12 width-full py-2 border-bottom color-border-muted"
            :key="`user-${i}`"
          >
            <div class="d-table-cell col-2 col-lg-1 px-0 px-sm-1 px-md-2">
              <router-link :to="`/public/profile/${user.id}`" class="d-inline-block">
                <b-avatar v-if="user.image" variant="secondary" :src="user.image" size="4rem"></b-avatar>
                <b-avatar v-else variant="secondary" :text="user.initialAvatarText" size="4rem"></b-avatar>
              </router-link>
            </div>
            <div class="d-table-cell col-9 v-align-top pr-3">
              <router-link v-if="user.fullName" :to="`/public/profile/${user.userId}`" class="user-name d-inline-block no-underline mb-1">
                <span>{{ user.fullName }}</span>
              </router-link>
              <div class="text-muted text-small mb-2">
                <b>{{ user.projectsCount }}</b> Public Projects
              </div>
            </div>
            <div class="d-table-cell col-2 v-align-top text-right">
              <div class="user-following-button">
                <button type="button" class="btn btn-secondary btn-md" @click="followUser(user.userId)">Follow</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/api'
import { mapState } from 'vuex'
import Search from '@streamlinehq/streamline-regular/lib/interface-essential/Search'
import Loader from '@/components/Loader'
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'

export default {
  components: {
    StreamLineIcon,
    Loader
  },
  data () {
    return {
      Search,
      loading: false,
      searchText: '',
      followingUsers: []
    }
  },
  computed: {
    ...mapState({
      userId: state => state.auth.user.id,
      currentUser: state => state.auth.user
    })
  },
  methods: {
    onSearch () {
      this.fetchFollowingUsers()
    },
    async followUser (userId) {
      try {
        const meId = this.userId
        await api.user.followUser(meId, userId)
        this.sendNotification(userId) // Send notification for the following
        this.fetchFollowingUsers()
        this.$toasted.success('User followed')
      } catch (e) {
        console.log(e)
      }
    },
    async fetchFollowingUsers () {
      try {
        const users = []
        const response = await api.user.fetchFollowingUsers(this.userId, this.searchText)
        response.data.forEach((user) => {
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
        this.followingUsers = users
      } catch (e) {
        console.log(e)
      }
    },
    async sendNotification (recipientId) {
      try {
        const notificationTitle = 'Someone has interest for you.'
        const notificationText = `${this.currentUser.fullName} followed you.`
        await api.notifications.send(recipientId, this.userId, notificationTitle, notificationText)
      } catch (e) {
        console.error(e)
      }
    }
  },
  async mounted () {
    this.fetchFollowingUsers()
  }
}
</script>
