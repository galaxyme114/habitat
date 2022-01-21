<template>
  <div>
    <span v-if="unreadChats > 0" class="badge-notify d-inline-block"></span>
  </div>
</template>

<script>
import * as firestoreService from '@/firebase/firestore'

export default {
  name: 'NewChatNotify',
  components: {},

  props: ['currentUserId'],

  data () {
    return {
      channels: [],
      listeners: [],
      listenedNewChannels: null
    }
  },
  computed: {
    unreadChats () {
      let count = 0
      this.channels.forEach(channel => {
        if (channel.unreadCount > 0) {
          count++
        }
      })
      return count
    }
  },
  watch: {
    listenedNewChannels (val) {
      if (val > 0) {
        this.fetchChannels()
      }
    }
  },
  methods: {
    refresh () {
      this.listeners.forEach(listener => listener())
      this.listeners = []
      this.fetchChannels()
    },
    async fetchChannels () {
      const channelList = []
      const query = firestoreService.allChannelsQuery(this.currentUserId)
      const channels = await firestoreService.getChannels(query)

      channels.forEach(channel => {
        channelList.push({ channelId: channel.id })
      })

      this.channels = channelList

      channelList.forEach(channel => {
        this.listenNewChats(channel)
      })

      this.listenChannels(query)
    },

    listenNewChats (channel) {
      const query = firestoreService.newMessagesQuery(channel.channelId, this.currentUserId)
      const listener = firestoreService.firestoreListener(
        query,
        messages => {
          let unreadCount = 0
          messages.forEach(message => {
            if (!message.data().seen || !message.data().seen[this.currentUserId]) {
              unreadCount++
            }
          })

          const channelIndex = this.channels.findIndex(
            r => channel.channelId === r.channelId
          )
          this.channels[channelIndex].unreadCount = unreadCount
          this.channels = [...this.channels]
        }
      )

      this.listeners.push(listener)
    },
    async listenChannels (query) {
      const listener = firestoreService.firestoreListener(query, channels => {
        const newChannels = []
        channels.forEach(channel => {
          const foundChannel = this.channels.find(r => r.channelId === channel.id)
          if (!foundChannel) {
            newChannels.push(channel.id)
            if (!newChannels.includes(channel.id)) {
              newChannels.push(channel.id)
            }
          }
        })
        this.listenedNewChannels = newChannels.length
      })
      this.listeners.push(listener)
    }
  },

  async mounted () {
    this.fetchChannels()
  }
}
</script>
