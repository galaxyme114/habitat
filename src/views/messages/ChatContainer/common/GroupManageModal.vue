<template>
  <b-modal
    id="group-manage-modal"
    v-model="showModal"
    @hide="hide"
    :hide-footer="!showAddMoreUsers"
  >
    <template #modal-header>
      <div v-if="showAddMoreUsers" class="w-100 d-flex justify-content-between">
        <h5 class="w-100 text-center">Add to Group</h5>
        <div id="close-button" class="pointer" @click="hide">
          <stream-line-icon :icon="FormValidation.Close" :size="16" />
        </div>
      </div>
      <div v-else class="w-100">
        <div id="close-button" class="pointer w-100 text-right" @click="hide">
          <stream-line-icon :icon="FormValidation.Close" :size="16" />
        </div>
        <div class="group-avatar text-center">
          <b-avatar :variant="group.variant" icon="people-fill" size="7rem"></b-avatar>
        </div>
      </div>
    </template>
    <div v-if="!showAddMoreUsers">
      <h5 class="text-center habitat-text-ellipsis mt-4 px-3">{{ group.channelName }}</h5>
      <div class="divider mb-3 mt-1" />
      <label class="text-uppercase">{{ participants.length }} participants</label>
      <div class="participants-list">
        <div class="d-flex align-items-center participants-list-item" @click="showAddMoreUsers = true">
          <button class="add-participant-icon btn btn-primary">
            <stream-line-icon :icon="RemoveAdd.Add" stroke="#ffffff" :size="17" stroke-width="3" />
          </button>
          <div class="ml-1">
            <span class="text-capitalize">Add participant</span>
          </div>
        </div>
        <div
          v-for="(participant, i) in participants"
          :key="`chat-user-${i}`"
          class="participants-list-item d-flex align-items-center justify-content-between"
        >
          <div class="d-flex align-items-center">
            <div class="user-avatar">
              <b-avatar v-if="participant.avatar" variant="secondary" :src="participant.avatar" size="3rem"></b-avatar>
              <b-avatar v-else variant="secondary" :text="participant.initialAvatarText" :class="`avatar-color-${participant.avatarColor}`" size="3rem"></b-avatar>
            </div>
            <div class="user-name ml-1">
              <span class="text-capitalize">{{ participant.fullName }}</span>
            </div>
          </div>
          <b-button
            v-if="participant._id !== currentUser.id"
            pill
            size="sm"
            variant="outline-danger"
            class="participant-remove-btn"
            @click="$emit('remove-group-user', selectedGroupId, participant._id)"
          >
            Remove
          </b-button>
        </div>
      </div>
      <span class="leave-group-btn" @click="leaveGroup">Leave group</span>
    </div>
    <div v-else>
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
      <div v-if="filteredUsers.length > 0" class="users-list">
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
      <div v-else>
        <h5>No users</h5>
      </div>
    </div>
    <template #modal-footer>
      <div class="w-100 text-center">
        <b-button
          variant="primary"
          @click="addUsersToGroup"
        >
          Done
        </b-button>
      </div>
    </template>
  </b-modal>
</template>

<script>
import * as firestoreService from '@/firebase/firestore'

import FormValidation from '@streamlinehq/streamline-regular/lib/interface-essential/FormValidation'
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import RemoveAdd from '@streamlinehq/streamline-regular/lib/interface-essential/RemoveAdd'

import { BModal, BAvatar, BButton, BIcon } from 'bootstrap-vue'
import { mapState } from 'vuex'

export default {
  props: ['show', 'users', 'selectedGroupId', 'group'],
  components: {
    StreamLineIcon,
    BModal,
    BAvatar,
    BButton,
    BIcon
  },
  data () {
    return {
      FormValidation,
      RemoveAdd,
      searchText: '',
      showAddMoreUsers: false,
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
    ...mapState({
      currentUser: (state) => state.auth.user
    }),
    filerableUsers () {
      const groupUserIds = []
      console.log('====', this.group.users)
      this.group.users.forEach(gUser => {
        groupUserIds.push(gUser._id)
      })

      return this.users.filter(user => {
        return !groupUserIds.includes(user._id)
      })
    },
    participants () {
      const currentUser = {
        _id: this.currentUser.id,
        avatar: this.currentUser.image ? this.currentUser.image.url : '',
        avatarColor: this.currentUser.avatarColor ? this.currentUser.avatarColor : '',
        initialAvatarText: this.currentUser.firstName ? this.currentUser.firstName.substring(0, 1) + this.currentUser.lastName.substring(0, 1) : '',
        fullName: this.currentUser.fullName,
        firstName: this.currentUser.firstName
      }

      return [...this.group.users, currentUser]
    },
    filteredUsers () {
      if (!this.searchText) {
        return this.filerableUsers
      }
      const searchText = this.searchText.toLowerCase()
      return this.filerableUsers.filter(user => {
        return user.fullName.toLowerCase().includes(searchText)
      })
    },
    selectedUsers () {
      return this.filerableUsers.filter(user => {
        return this.toGroup.includes(user._id)
      })
    }
  },
  methods: {
    ok () {
      this.showAddMoreUsers = false
      this.toGroup = []
      this.$emit('ok')
    },
    hide () {
      this.showAddMoreUsers = false
      this.toGroup = []
      this.$emit('hide')
    },
    async addUsersToGroup () {
      if (this.toGroup.length < 1) {
        this.$toasted.error('Please select users')
        return
      }

      await firestoreService.addChannelUsers(this.selectedGroupId, this.toGroup)
      this.ok()
    },
    detachGroupUser (userId) {
      const groupUsers = this.toGroup
      const index = groupUsers.indexOf(userId)
      if (index !== -1) {
        groupUsers.splice(index, 1)
      }
      this.toGroup = groupUsers
    },
    leaveGroup () {
      this.$emit('leave-group', this.selectedGroupId)
      this.$emit('hide')
    }
  }

}
</script>

<style lang="scss">
#group-manage-modal {
  .group-avatar {
    margin-bottom: -3rem;
  }
  .add-participant-icon {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
  }
  .participant-remove-btn {
    display: none;
  }
  .leave-group-btn {
    margin-top: 2rem;
    display: block;
    margin-bottom: 2rem;
    font-weight: bold;
    color: #f26b6b;
    cursor: pointer;

    &:hover {
      color: #ee3c3c;
    }
  }
  .users-list,
  .participants-list {
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

    .users-list-item,
    .participants-list-item {
      padding: .3rem 0;
      border-bottom: 1px solid #a7c7c5;
      cursor: pointer;

      &:hover {
        background-color: #e9f4f3;

        .participant-remove-btn {
          display: block;
        }
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
