<template>
  <b-modal
    id="channel-creation-modal"
    title="New Chat"
    v-model="showModal"
    @hide="hide"
    hide-footer
  >
    <div class="users-search">
      <input
        v-model="searchText"
        id="searchText"
        type="text"
        class="from-control"
        name="usersSearch"
        placeholder="Search"
        autofocus
      />
    </div>
    <div :style="{ marginBottom: '25px', marginTop: '25px' }" class="divider" />
    <label>Users</label>
    <div class="users-list">
      <div
        v-for="(user, i) in filteredUsers"
        :key="`chat-user-${i}`"
        class="users-list-item d-flex align-items-center"
        @click="createChannel(user._id)"
      >
        <div class="user-avatar">
          <b-avatar v-if="user.avatar" variant="secondary" :src="user.avatar" size="3rem"></b-avatar>
          <b-avatar v-else variant="secondary" :text="user.initialAvatarText" :class="`avatar-color-${user.avatarColor}`" size="3rem"></b-avatar>
        </div>
        <div class="user-name ml-1">
          <span class="text-capitalize">{{ user.fullName }}</span>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import * as firestoreService from '@/firebase/firestore'
// import * as firebaseService from '@/firebase/realtime'
// import * as storageService from '@/firebase/storage'

import { BModal, BAvatar } from 'bootstrap-vue'
import { mapState } from 'vuex'

export default {
  props: ['show', 'users'],
  components: {
    BModal,
    BAvatar
  },
  data () {
    return {
      searchText: ''
    }
  },
  computed: {
    showModal: {
      get () {
        return this.show
      },
      set (newVal) {
        return newVal
      }
    },
    filteredUsers () {
      if (!this.searchText) {
        return this.users
      }
      const searchText = this.searchText.toLowerCase()
      return this.users.filter(user => {
        return user.fullName.toLowerCase().includes(searchText)
      })
    },
    ...mapState({
      currentUser: (state) => state.auth.user
    })
  },
  methods: {
    ok () {
      this.$emit('ok')
    },
    hide () {
      this.$emit('hide')
    },
    async createChannel (userId) {
      await firestoreService.addChannel({
        users: [userId, this.currentUser.id],
        group: false,
        lastUpdated: new Date()
      })

      this.ok()
    }
  }
}
</script>

<style lang="scss">
#channel-creation-modal {
  .users-list {
    max-height: calc(100vh - 300px);
    overflow: auto;

    &::-webkit-scrollbar {
      width: 10px;
    }

    &::-webkit-scrollbar-track {
      background-color: #d1cfcf;
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #a09f9f;
      border-radius: 10px;
    }

    .users-list-item {
      padding: .3rem 0;
      border-bottom: 1px solid #a7c7c5;
      cursor: pointer;

      &:hover {
        background-color: #e9f4f3;
      }
    }
  }
  .users-search input {
    width: 100%;
    padding: 1rem 0.5rem;
    border: 2px solid #ccc;
    border-radius: 5px;
  }
}
</style>
