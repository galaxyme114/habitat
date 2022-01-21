<template>
  <b-modal
    id="group-channel-creation-modal"
    title="Create new group "
    v-model="showModal"
    @hide="hide"
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
    <div class="selected-users-preview mt-1 d-flex" style="overflow-x: auto">
      <div v-for="(selectedUser, j) in selectedUsers" :key="`selected-user-${j}`" class="d-inline-block d-flex-column text-center" style="margin: .1rem">
        <div>
          <b-avatar v-if="selectedUser.avatar" variant="secondary" :src="selectedUser.avatar" size="4rem" badge badge-top>
            <template #badge><b-icon icon="x" style="cursor: pointer" @click="detachGroupUser(selectedUser._id)"></b-icon></template>
          </b-avatar>
          <b-avatar v-else variant="secondary" :text="selectedUser.initialAvatarText" :class="`avatar-color-${selectedUser.avatarColor}`" badge badge-top size="4rem">
            <template #badge><b-icon icon="x" style="cursor: pointer" @click="detachGroupUser(selectedUser._id)"></b-icon></template>
          </b-avatar>
        </div>
        <small>{{ selectedUser.firstName }}</small>
      </div>
    </div>
    <div class="divider mb-3 mt-1" />
    <label>Users</label>
    <div class="users-list">
      <div
        v-for="(user, i) in filteredUsers"
        :key="`chat-user-${i}`"
        class="users-list-item d-flex align-items-center justify-content-between"
      >
        <div class="d-flex align-items-center">
          <div class="user-avatar">
            <b-avatar v-if="user.avatar" variant="secondary" :src="user.avatar" size="3rem"></b-avatar>
            <b-avatar v-else variant="secondary" :text="user.initialAvatarText" :class="`avatar-color-${user.avatarColor}`" size="3rem"></b-avatar>
          </div>
          <div class="user-name ml-1">
            <span class="text-capitalize">{{ user.fullName }}</span>
          </div>
        </div>
        <label class="color-checkbox primary" :key="i">
          <input type="checkbox" v-model="toGroup" :value="user._id" />
          <span class="checkmark"></span>
        </label>
      </div>
    </div>
    <template #modal-footer>
      <div class="w-100 text-center">
        <b-button
          variant="primary"
          @click="createGroupChannel"
        >
          Done
        </b-button>
      </div>
    </template>
  </b-modal>
</template>

<script>
import * as firestoreService from '@/firebase/firestore'
// import * as firebaseService from '@/firebase/realtime'
// import * as storageService from '@/firebase/storage'

import { BModal, BAvatar, BButton, BIcon } from 'bootstrap-vue'
import { mapState } from 'vuex'

export default {
  props: ['show', 'users'],
  components: {
    BModal,
    BAvatar,
    BButton,
    BIcon
  },
  data () {
    return {
      searchText: '',
      toGroup: []
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
    selectedUsers () {
      return this.users.filter(user => {
        return this.toGroup.includes(user._id)
      })
    },
    ...mapState({
      currentUser: (state) => state.auth.user
    })
  },
  methods: {
    ok () {
      this.toGroup = []
      this.$emit('ok')
    },
    hide () {
      this.$emit('hide')
    },
    async createGroupChannel () {
      if (this.toGroup.length < 2) {
        this.$toasted.error('Please select above 2 users')
        return
      }

      const variants = [
        'primary',
        'secondary',
        'success',
        'warning',
        'danger',
        'info',
        'dark'
      ]
      await firestoreService.addChannel({
        users: [...this.toGroup, this.currentUser.id],
        group: true,
        variant: variants[Math.floor(Math.random() * 7)],
        lastUpdated: new Date()
      })

      this.ok()
    },
    detachGroupUser (userId) {
      const groupUsers = this.toGroup
      const index = groupUsers.indexOf(userId)
      if (index !== -1) {
        groupUsers.splice(index, 1)
      }
      this.toGroup = groupUsers
    }
  }
}
</script>

<style lang="scss">
#group-channel-creation-modal {
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
  .color-checkbox {
    margin-bottom: 22px;
  }
}
</style>
