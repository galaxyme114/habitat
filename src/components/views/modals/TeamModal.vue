<template>
  <b-modal title="Manage Team" v-model="showModal" @hide="hide">
    <!-- <validation-observer ref="userForm"> -->
    <div class="form-group">
      <!-- <validation-provider name="email" rules="required" v-slot="{ errors, classes }"> -->
      <label for="email">Invite Teammates</label>
      <vue-simple-suggest
        v-model="userEmail"
        :list="activeUsers"
        :filter-by-query="true"
        placeholder="user@email.com"
        display-attribute="value"
        value-attribute="value"
      >
        <div slot="suggestion-item" slot-scope="{ suggestion }">
          <div class="autocomplete-item d-flex align-items-center">
            <div style="margin-right: .7rem">
              <b-avatar v-if="suggestion.image" variant="secondary" :src="suggestion.image" size="2.5rem"></b-avatar>
              <b-avatar v-else variant="secondary" :text="suggestion.initialAvatarText" size="2.5rem"></b-avatar>
            </div>
            <div class="autocomplete-item-detail">
              <span class="title">{{ suggestion.label }}</span>
              <span class="description">{{ suggestion.value }}</span>
            </div>
          </div>
        </div>
      </vue-simple-suggest>
      <!-- <transition name="fade-grow" mode="out-in">
        <div class="invalid-feedback" v-if="errors">{{ errors[0] }}</div>
      </transition> -->
      <b-button size="md" variant="primary" @click="handleAddUser" class="mt-2">Add</b-button>
      <!-- </validation-provider> -->
    </div>
    <div :style="{ marginBottom: '25px', marginTop: '25px' }" class="divider" />
    <label>Project Teammates</label>
    <div v-if="habitat" class="team-container">
      <div class="team-member" v-for="(owner, i) in habitat.owners" :key="`${habitat.id}-owner-${i}`">
        <div :style="{ display: 'flex', flexDirection: 'row', alignItems: 'center' }">
          <div
            v-if="owner.image"
            class="profile-image"
            :style="{ backgroundImage: `url(${owner.image.url})`, height: '32px', width: '32px' }"
          />
          <img v-else :src="placeholder" :alt="owner.fullName" />
          <div class="team-member-info">
            <div class="team-member-name">{{ owner.fullName }}</div>
            <div class="team-member-email">{{ owner.email }}</div>
          </div>
        </div>
        <div :style="{ display: 'flex', flexDirection: 'row', paddingRight: '10px' }">Owner</div>
      </div>
      <div v-for="(user, i) in habitat.users" :key="`${habitat.id}-team-member-${i}`" class="team-member">
        <div :style="{ display: 'flex', flexDirection: 'row', alignItems: 'center' }">
          <div
            v-if="user.image"
            class="profile-image"
            :style="{ backgroundImage: `url(${user.image.url})`, height: '32px', width: '32px' }"
          />
          <img v-else :src="placeholder" :alt="user.fullName" />
          <div class="team-member-info">
            <div class="team-member-name">{{ user.fullName }}</div>
            <div class="team-member-email">{{ user.email }}</div>
          </div>
        </div>
        <div
          :style="{ display: 'flex', flexDirection: 'row', paddingRight: '10px', alignItems: 'center' }"
          :id="user.id"
          class="team-member-options"
          @click="handleTeamMemberSelect(user)"
        >
          <div>
            {{ user.role === 'user' ? 'Can View' : 'Can Edit' }}
            <span class="px-1">
              <stream-line-icon :icon="Arrows.ArrowDown1" :stroke="iconColour" :size="14" />
            </span>
          </div>
        </div>
      </div>
      <div class="team-member" v-for="(invitee, i) in habitat.invites" :key="`${habitat.id}-pending-${i}`">
        <div :style="{ display: 'flex', flexDirection: 'row', alignItems: 'center' }">
          <img :src="placeholder" :alt="`pending-${i}`" />
          <div class="team-member-info">
            <div class="team-member-name">{{ invitee }}</div>
          </div>
        </div>
        <div :style="{ display: 'flex', flexDirection: 'row', paddingRight: '10px' }">Pending</div>
      </div>
    </div>
    <!-- </validation-observer> -->
    <TeamMemberSettingsPopover
      :show="teamMemberPopoverShow"
      :target="teamMemberTarget"
      :currentTeamMember="currentTeamMember"
      :habitat="habitat"
      @updatedUser="handleUpdatedUser"
      @close="teamMemberPopoverShow = false"
    />
  </b-modal>
</template>
<script>
import api from '@/api'
import { BModal, BButton } from 'bootstrap-vue'
// import { ValidationProvider, ValidationObserver } from 'vee-validate'
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import Arrows from '@streamlinehq/streamline-regular/lib/arrows-diagrams/Arrows'
import TeamMemberSettingsPopover from '../popovers/TeamMemberSettingsPopover'
import { mapState } from 'vuex'
import placeholder from '@/assets/icons/placeholder@2x.png'
import VueSimpleSuggest from 'vue-simple-suggest'
import 'vue-simple-suggest/dist/styles.css' // Optional CSS

export default {
  props: ['show', 'habitat'],
  components: {
    BModal,
    BButton,
    // ValidationProvider,
    // ValidationObserver,
    StreamLineIcon,
    TeamMemberSettingsPopover,
    VueSimpleSuggest
  },
  data () {
    return {
      Arrows,
      placeholder,
      userEmail: '',
      recipientId: '',
      teamMemberTarget: '',
      teamMemberPopoverShow: false,
      currentTeamMember: null
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
      currentUser: (state) => state.auth.user,
      habitats: state => state.habitats.habitats,
      iconColour: (state) => {
        if (state.auth.user === null || state.auth.user.theme === 'light') {
          return '#000000'
        }
        return '#ffffff'
      }
    }),
    activeUsers: function () {
      const habitats = this.habitats
      const activeUsers = []
      habitats.forEach(habitat => {
        habitat.users.forEach(user => {
          activeUsers.push({
            value: user.email,
            userId: user.id,
            label: user.fullName,
            image: user.image ? user.image.url : '',
            initialAvatarText: user.firstName ? user.firstName.substring(0, 1) + user.lastName.substring(0, 1) : ''
          })
        })
      })
      return activeUsers
    }
  },
  methods: {
    ok () {
      this.$emit('ok')
    },
    hide () {
      this.$emit('hide')
    },
    handleTeamMemberSelect (user) {
      if (this.teamMemberPopoverShow) {
        this.teamMemberPopoverShow = false
      }

      this.currentTeamMember = user

      setTimeout(() => {
        this.teamMemberTarget = user.id
        this.teamMemberPopoverShow = true
      }, [100])
    },
    async handleAddUser () {
      try {
        const response = await api.habitats.addUser(this.userEmail, this.habitat.id, this.currentUser.fullName)
        this.habitat = response.data
        this.$toasted.success('Invite email sent')

        const result = this.activeUsers.filter(user => user.value === this.userEmail)
        this.recipientId = result[0] ? result[0].userId : ''
        this.userEmail = ''

        // send a notification
        this.sendNotification()
      } catch (e) {
        this.$toasted.error(e.response.data.message)
      }
      this.userEmail = ''
      this.$refs.userForm.reset()
    },
    async sendNotification () {
      if (this.recipientId) {
        try {
          const notificationText = `${this.currentUser.fullName} have invited you to his/her project. Please check your email for the invitation link.`
          const notificationTitle = 'You are invited to a project!'
          await api.notifications.send(this.recipientId, this.currentUser.id, notificationTitle, notificationText)
        } catch (e) {
          console.error(e)
        }
      }
    },
    toggleModal () {
      this.$refs['team-modal'].toggle()
    },
    handleUpdatedUser (updatedUser) {
      this.currentTeamMember = updatedUser
    }
  }
}
</script>

<style>
.autocomplete-item .autocomplete-item-detail {
  display: grid;
}
.autocomplete-item .autocomplete-item-detail .title {
  color: #626264;
}
.autocomplete-item .autocomplete-item-detail .description {
  color: #96989C;
  font-size: 14px;
}
.vue-simple-suggest.designed .suggestions .suggest-item.hover {
  background-color: #E8EAED !important;
}
.vue-simple-suggest.designed .suggestions .suggest-item.selected {
    background-color: #d4d7da !important;
}
</style>
