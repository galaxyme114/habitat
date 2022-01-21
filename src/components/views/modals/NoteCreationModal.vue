<template>
  <div>
    <b-modal
      size="md"
      v-model="showModal"
      title="Add Note"
      ok-title="Insert"
      @ok="createNote"
      @cancel="hide"
      @hide="hide"
    >
      <div id="note-body" :style="{ backgroundColor: noteColour }">
        <Mentionable
          :keys="['@']"
          :items="mentionableUsers"
          offset="6"
          insert-space
        >
          <b-form-textarea
            id="note-input"
            v-model="noteText"
            placeholder="Type Something..."
            type="text"
            size="lg"
            max-rows="16"
            :maxlength="250"
          />
        </Mentionable>
        <div id="colour-picker" @click="handleColourPicker">
          <stream-line-icon :icon="ColorsPainting.ColorBucket1" :stroke="iconColour" :size="25" />
        </div>
        <div id="character-count">
          {{ `${noteText.length} / 250 characters` }}
        </div>
      </div>
    </b-modal>
    <b-popover id="colour-picker-menu" target="colour-picker" :placement="'topright'" :show.sync="showColourPicker">
      <chrome-picker v-model="noteColour" @input="updateColour" />
    </b-popover>
  </div>
</template>
<script>
import api from '@/api'
import { BModal, BPopover, BFormTextarea } from 'bootstrap-vue'
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import ColorsPainting from '@streamlinehq/streamline-regular/lib/design/ColorsPainting'
import { Chrome } from 'vue-color'
import { mapState } from 'vuex'
import Mentionable from '@/components/common/Mentionable'

export default {
  name: 'CreateNoteModal',
  props: ['show', 'selectedProject', 'userId', 'activeUsers'],
  components: {
    BModal,
    BPopover,
    BFormTextarea,
    StreamLineIcon,
    Mentionable,
    'chrome-picker': Chrome
  },
  data () {
    return {
      ColorsPainting,
      noteText: '',
      noteColour: '#FFC2B4',
      showColourPicker: false
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.auth.user,
      iconColour: (state) => {
        if (state.auth.user === null || state.auth.user.theme === 'light') {
          return '#000000'
        }

        return '#ffffff'
      }
    }),
    showModal: {
      get () {
        return this.show
      },
      set (newVal) {
        return newVal
      }
    },
    mentionableUsers: {
      get: function () {
        const users = []
        if (this.activeUsers) {
          this.activeUsers.forEach(user => {
            users.push({
              userId: user.id,
              value: user.firstName,
              label: user.fullName,
              searchText: `@${user.firstName}`,
              image: user.image ? user.image.url : '',
              avatarText: user.firstName ? user.firstName.substring(0, 1) + user.lastName.substring(0, 1) : ''
            })
          })
        }
        return users
      },
      set: function (newValue) {
        return newValue
      }
    }
  },
  methods: {
    hide () {
      this.$emit('close')
    },
    updateColour (value) {
      this.noteColour = value.hex
    },
    async createNote () {
      try {
        await api.notes.create(this.noteColour, this.noteText, this.selectedProject, this.userId)
        this.$emit('ok')

        // send notifications for tagged users
        const mentions = this.noteText.match(/(@\w+)/gi)
        if (mentions) {
          mentions.forEach((mention) => {
            const recipient = this.mentionableUsers.filter((detail) => detail.searchText === mention)
            const recipientId = recipient.length > 0 ? recipient[0].userId : ''
            if (recipientId) {
              // send notification
              this.sendNotification(recipientId)
            }
          })
        }
        this.$toasted.success('Note created')
      } catch (error) {
        this.$toasted.error('Note not created')
      }
      this.showModal = false
      this.showColourPicker = false
      this.noteText = ''
    },
    async sendNotification (recipientId) {
      try {
        const notificationTitle = 'You are tagged to a note.'
        const notificationText = `${this.currentUser.fullName} tagged you to his/her note.`
        await api.notifications.send(recipientId, this.currentUser.id, notificationTitle, notificationText)
      } catch (e) {
        console.error(e)
      }
    },
    handleColourPicker () {
      this.showColourPicker = !this.showColourPicker
    }
  }
}
</script>
