<template>
  <b-popover id="team-member-settings-menu" :key="target" :target="target" :placement="'bottom'" :show.sync="showPopover">
    <div class="dropdown-item" @click="updateUserRole('user')">
      <span v-if="current.role === 'user'" class="px-1">
        <stream-line-icon :icon="FormValidation.Check1" :stroke="iconColour" :size="10" />
      </span>
      Can View
    </div>
    <div class="dropdown-item" @click="updateUserRole('admin')">
      <span v-if="current.role !== 'user'" class="px-1">
        <stream-line-icon :icon="FormValidation.Check1" :stroke="iconColour" :size="10" />
      </span>
      Can Edit
    </div>
    <div class="divider" />
    <div
      v-if="habitat.owners.map((owner) => owner.id).includes(currentUser.id)"
      class="dropdown-item"
      @click="handleRemoveUser(current.id)"
    >
      Remove User
    </div>
  </b-popover>
</template>
<script>
import api from '@/api'
import { mapState } from 'vuex'
import { BPopover } from 'bootstrap-vue'
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import FormValidation from '@streamlinehq/streamline-regular/lib/interface-essential/FormValidation'
import { ALOADHABITATS } from '@/store/action-types'

export default {
  props: ['target', 'show', 'currentTeamMember', 'habitat'],
  components: {
    BPopover,
    StreamLineIcon
  },
  computed: {
    showPopover: {
      get () {
        return this.show
      },
      set (newVal) {
        return newVal
      }
    },
    current: {
      get () {
        return this.currentTeamMember
      },
      set (newVal) {
        return newVal
      }
    },
    ...mapState({
      currentUser: (state) => state.auth.user,
      iconColour: (state) => {
        if (state.auth.user === null || state.auth.user.theme === 'light') {
          return '#000000'
        }
        return '#ffffff'
      }
    })
  },
  data () {
    return {
      FormValidation
    }
  },
  methods: {
    async updateUserRole (role) {
      try {
        const updatedUser = await api.user.update(this.currentTeamMember.id, { role: role }, this.habitat.id)
        this.current = updatedUser.data
        this.$emit('updatedUser', updatedUser.data)
        await this.$store.dispatch(ALOADHABITATS)
      } catch (e) {
        this.$toasted.error(e.response.data.message)
      }
    },
    async handleRemoveUser (userId) {
      try {
        await api.habitats.removeUser(userId, this.habitat.id)
        await this.$store.dispatch(ALOADHABITATS)
        this.$toasted.success('User removed')
      } catch (e) {
        this.$toasted.error(e.response.data.message)
      }
    }
  }
}
</script>
