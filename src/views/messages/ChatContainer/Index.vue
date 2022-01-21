<template>
  <div class="window-container" :class="{ 'window-mobile': isDevice }">
    <chat-main
      :height="screenHeight"
      :theme="theme"
      :styles="styles"
      :current-user-id="currentUserId"
      :channel-id="channelId"
      :channels="loadedChannels"
      :loading-channels="loadingChannels"
      :messages="messages"
      :messages-loaded="messagesLoaded"
      :channels-loaded="channelsLoaded"
      :channel-actions="channelActions"
      :group-channel-actions="groupChannelActions"
      :menu-actions="menuActions"
      :channel-message="channelMessage"
      :templates-text="templatesText"
      @fetch-more-channels="fetchMoreChannels"
      @fetch-messages="fetchMessages"
      @send-message="sendMessage"
      @edit-message="editMessage"
      @delete-message="deleteMessage"
      @open-file="openFile"
      @open-user-tag="openUserTag"
      @add-channel="channelCreationModalShow = true"
      @add-group-channel="groupChannelCreationModalShow = true"
      @channel-action-handler="channelActionHandler"
      @menu-action-handler="menuActionHandler"
      @send-message-reaction="sendMessageReaction"
      @typing-message="typingMessage"
    />
    <ChannelCreationModal
      :show="channelCreationModalShow"
      @hide="channelCreationModalShow = false"
      @ok="refresh"
      :users="users"
    />
    <GroupChannelCreationModal
      :show="groupChannelCreationModalShow"
      @hide="groupChannelCreationModalShow = false"
      @ok="refresh"
      :users="users"
    />
    <GroupManageModal
      :show="showGroupManageModal"
      :selectedGroupId="selectedGroupId"
      :group="group"
      @hide="showGroupManageModal = false"
      @ok="refresh"
      @remove-group-user="removeGroupUser"
      @leave-group="leaveGroup"
      :users="users"
    />
    <SettingsModal
      :show="showSettingsModal"
      :theme="theme"
      @hide="showSettingsModal = false"
      @ok="showSettingsModal = false"
      @theme="$emit('theme', $event)"
    />
  </div>
</template>

<script>
import * as firestoreService from '@/firebase/firestore'
import * as firebaseService from '@/firebase/realtime'
import * as storageService from '@/firebase/storage'
import { parseTimestamp, formatTimestamp } from '@/utils/dates'

import ChatMain from '../../../lib/HabitatChat/ChatMain'

import ChannelCreationModal from './common/ChannelCreationModal'
import SettingsModal from './common/SettingsModal'
import GroupChannelCreationModal from './common/GroupChannelCreationModal'
import GroupManageModal from './common/GroupManageModal'

export default {
  components: {
    ChatMain,
    ChannelCreationModal,
    SettingsModal,
    GroupChannelCreationModal,
    GroupManageModal
  },

  props: {
    currentUserId: { type: String, required: true },
    users: { type: Array, required: true },
    theme: { type: String, required: true },
    isDevice: { type: Boolean, required: true }
  },

  data () {
    return {
      channelsPerPage: 15,
      channels: [],
      channelId: '',
      startChannels: null,
      endChannels: null,
      channelsLoaded: false,
      loadingChannels: true,
      allUsers: [],
      loadingLastMessageByChannel: 0,
      channelsLoadedCount: false,
      selectedChannel: null,
      messagesPerPage: 20,
      messages: [],
      messagesLoaded: false,
      channelMessage: '',
      lastLoadedMessage: null,
      previousLastLoadedMessage: null,
      channelsListeners: [],
      listeners: [],
      typingMessageCache: '',
      disableForm: false,
      inviteChannelId: null,
      invitedUsername: '',
      removeChannelId: null,
      removeUserId: '',
      removeUsers: [],
      channelCreationModalShow: false,
      groupChannelCreationModalShow: false,
      showGroupManageModal: false,
      showSettingsModal: false,
      selectedGroupId: null,
      group: null,
      listenedNewChannels: null,
      channelActions: [
        { name: 'deleteChannel', title: 'Delete Chat' }
      ],
      groupChannelActions: [
        { name: 'leaveGroup', title: 'Leave Group' },
        { name: 'manageGroup', title: 'Manage Group' }
      ],
      menuActions: [
        { name: 'settings', title: 'Settings' }
      ],
      styles: { container: { borderRadius: '4px' } },
      templatesText: [
        {
          tag: 'help',
          text: 'This is the help'
        },
        {
          tag: 'action',
          text: 'This is the action'
        },
        {
          tag: 'action 2',
          text: 'This is the second action'
        }
      ]
    }
  },

  computed: {
    loadedChannels () {
      return this.channels.slice(0, this.channelsLoadedCount)
    },
    screenHeight () {
      return this.isDevice ? window.innerHeight + 'px' : 'calc(100vh - 150px)'
    }
  },

  watch: {
    listenedNewChannels (val) {
      if (val > 0) {
        this.fetchChannels()
      }
    }
  },

  mounted () {
    this.fetchChannels()
    firebaseService.updateUserOnlineStatus(this.currentUserId)
  },

  methods: {
    resetChannels () {
      this.loadingChannels = true
      this.loadingLastMessageByChannel = 0
      this.channelsLoadedCount = 0
      this.channels = []
      this.channelsLoaded = true
      this.startChannel = null
      this.endChannels = null
      this.channelsListeners.forEach(listener => listener())
      this.channelsListeners = []
      this.resetMessages()
    },

    resetMessages () {
      this.messages = []
      this.messagesLoaded = false
      this.lastLoadedMessage = null
      this.previousLastLoadedMessage = null
      this.listeners.forEach(listener => listener())
      this.listeners = []
    },

    fetchChannels () {
      this.resetChannels()
      this.fetchMoreChannels()
    },

    async fetchMoreChannels () {
      if (this.endChannels && !this.startChannels) {
        this.channelsLoaded = true
        return
      }

      const query = firestoreService.channelsQuery(
        this.currentUserId,
        this.channelsPerPage,
        this.startChannel
      )

      const channels = await firestoreService.getChannels(query)
      this.channelsLoaded = channels.empty || channels.size < this.channelsPerPage

      if (this.startChannel) this.endChannel = this.startChannel
      this.startChannel = channels.docs[channels.docs.length - 1]

      const channelUserIds = []
      channels.forEach(channel => {
        channel.data().users.forEach(userId => {
          const foundUser = this.allUsers.find(user => user?._id === userId)
          if (!foundUser && channelUserIds.indexOf(userId) === -1) {
            channelUserIds.push(userId)
          }
        })
      })

      const channelList = {}
      channels.forEach(channel => {
        channelList[channel.id] = { ...channel.data(), users: [] }

        channel.data().users.forEach(userId => {
          const foundUser = this.users.find(user => user?._id === userId)
          if (foundUser) channelList[channel.id].users.push(foundUser)
        })
      })

      const formattedChannels = []

      Object.keys(channelList).forEach(key => {
        const channel = channelList[key]
        const channelContacts = channel.users.filter(
          user => user._id !== this.currentUserId
        )

        channel.channelName =
          channelContacts.map(user => user.fullName).join(', ') || 'Myself'

        const channelAvatar =
          channelContacts.length === 1 && channelContacts[0].avatar
            ? channelContacts[0].avatar
            : ''

        const channelInitialAvatarText =
          channelContacts.length === 1 && channelContacts[0].initialAvatarText
            ? channelContacts[0].initialAvatarText
            : ''

        const channelAvatarColor =
          channelContacts.length === 1 && channelContacts[0].avatarColor
            ? channelContacts[0].avatarColor
            : ''

        formattedChannels.push({
          ...channel,
          channelId: key,
          avatar: channelAvatar,
          avatarText: channelInitialAvatarText,
          avatarColor: channelAvatarColor,
          index: channel.lastUpdated.seconds,
          unreadCount: 0,
          lastMessage: {
            content: 'Channel created',
            timestamp: formatTimestamp(
              new Date(channel.lastUpdated.seconds),
              channel.lastUpdated
            )
          }
        })
      })

      this.channels = this.channels.concat(formattedChannels)

      formattedChannels.forEach(channel => {
        this.listenLastMessage(channel)
        this.listenNewMessages(channel)
      })

      if (!this.channels.length) {
        this.loadingChannels = false
        this.channelsLoadedCount = 0
      }

      this.listenUsersOnlineStatus(formattedChannels)
      this.listenChannels(query)
    },

    listenLastMessage (channel) {
      const listener = firestoreService.firestoreListener(
        firestoreService.lastMessageQuery(channel.channelId),
        messages => {
          messages.forEach(message => {
            const lastMessage = this.formatLastMessage(message.data(), channel)
            const channelIndex = this.channels.findIndex(
              r => channel.channelId === r.channelId
            )
            this.channels[channelIndex].lastMessage = lastMessage
            this.channels = [...this.channels]
          })
          if (this.loadingLastMessageByChannel < this.channels.length) {
            this.loadingLastMessageByChannel++

            if (this.loadingLastMessageByChannel === this.channels.length) {
              this.loadingChannels = false
              this.channelsLoadedCount = this.channels.length
            }
          }
        }
      )

      this.channelsListeners.push(listener)
    },

    listenNewMessages (channel) {
      const listener = firestoreService.firestoreListener(
        firestoreService.newMessagesQuery(channel.channelId, this.currentUserId),
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

      this.channelsListeners.push(listener)
    },

    formatLastMessage (message, channel) {
      if (!message.timestamp) return

      let content = message.content
      if (message.files?.length) {
        const file = message.files[0]
        content = `${file.name}.${file.extension || file.type}`
      }

      const username =
        message.sender_id !== this.currentUserId
          ? channel.users.find(user => message.sender_id === user._id)?.firstName
          : ''

      return {
        ...message,
        ...{
          content,
          timestamp: formatTimestamp(
            new Date(message.timestamp.seconds * 1000),
            message.timestamp
          ),
          username: username,
          distributed: true,
          seen: message.sender_id === this.currentUserId ? message.seen : null,
          new:
            message.sender_id !== this.currentUserId &&
            (!message.seen || !message.seen[this.currentUserId])
        }
      }
    },

    fetchMessages ({ channel, options = {} }) {
      if (options.reset) {
        this.resetMessages()
        this.channelId = channel.channelId
      }

      if (this.previousLastLoadedMessage && !this.lastLoadedMessage) {
        this.messagesLoaded = true
        return
      }

      this.selectedChannel = channel.channelId

      firestoreService
        .getMessages(channel.channelId, this.messagesPerPage, this.lastLoadedMessage)
        .then(messages => {
          if (this.selectedChannel !== channel.channelId) return

          if (messages.empty || messages.docs.length < this.messagesPerPage) {
            setTimeout(() => (this.messagesLoaded = true), 0)
          }

          if (options.reset) this.messages = []

          messages.forEach(message => {
            const formattedMessage = this.formatMessage(channel, message)
            this.messages.unshift(formattedMessage)
          })

          if (this.lastLoadedMessage) {
            this.previousLastLoadedMessage = this.lastLoadedMessage
          }
          this.lastLoadedMessage = messages.docs[messages.docs.length - 1]

          const listener = firestoreService.firestoreListener(
            firestoreService.paginatedMessagesQuery(
              channel.channelId,
              this.lastLoadedMessage,
              this.previousLastLoadedMessage
            ),
            snapshots => {
              this.listenMessages(snapshots, channel)
            }
          )
          this.listeners.push(listener)
        })
    },

    listenMessages (messages, channel) {
      messages.forEach(message => {
        const formattedMessage = this.formatMessage(channel, message)
        const messageIndex = this.messages.findIndex(m => m._id === message.id)

        if (messageIndex === -1) {
          this.messages = this.messages.concat([formattedMessage])
        } else {
          this.messages[messageIndex] = formattedMessage
          this.messages = [...this.messages]
        }

        this.markMessagesSeen(channel, message)
      })
    },

    markMessagesSeen (channel, message) {
      if (
        message.data().sender_id !== this.currentUserId &&
        (!message.data().seen || !message.data().seen[this.currentUserId])
      ) {
        firestoreService.updateMessage(channel.channelId, message.id, {
          [`seen.${this.currentUserId}`]: new Date()
        })
      }
    },

    formatMessage (channel, message) {
      const { timestamp } = message.data()

      const formattedMessage = {
        ...message.data(),
        ...{
          senderId: message.data().sender_id,
          _id: message.id,
          seconds: timestamp.seconds,
          timestamp: parseTimestamp(timestamp, 'HH:mm'),
          date: parseTimestamp(timestamp, 'DD MMMM YYYY'),
          username: channel.users.find(
            user => message.data().sender_id === user._id
          )?.username,
          // avatar: senderUser ? senderUser.avatar : null,
          distributed: true
        }
      }

      if (message.data().replyMessage) {
        formattedMessage.replyMessage = {
          ...message.data().replyMessage,
          ...{
            senderId: message.data().replyMessage.sender_id
          }
        }
      }

      return formattedMessage
    },

    async sendMessage ({ content, channelId, files, replyMessage }) {
      const message = {
        sender_id: this.currentUserId,
        content,
        timestamp: new Date()
      }

      if (files) {
        message.files = this.formattedFiles(files)
      }

      if (replyMessage) {
        message.replyMessage = {
          _id: replyMessage._id,
          content: replyMessage.content,
          sender_id: replyMessage.senderId
        }

        if (replyMessage.files) {
          message.replyMessage.files = replyMessage.files
        }
      }

      const { id } = await firestoreService.addMessage(channelId, message)

      if (files) {
        for (let index = 0; index < files.length; index++) {
          await this.uploadFile({ file: files[index], messageId: id, channelId })
        }
      }

      firestoreService.updateChannel(channelId, { lastUpdated: new Date() })
    },

    async editMessage ({ messageId, newContent, channelId, files }) {
      const newMessage = { edited: new Date() }
      newMessage.content = newContent

      if (files) {
        newMessage.files = this.formattedFiles(files)
      } else {
        newMessage.files = firestoreService.deleteDbField
      }

      await firestoreService.updateMessage(channelId, messageId, newMessage)

      if (files) {
        for (let index = 0; index < files.length; index++) {
          if (files[index]?.blob) {
            await this.uploadFile({ file: files[index], messageId, channelId })
          }
        }
      }
    },

    async deleteMessage ({ message, channelId }) {
      await firestoreService.updateMessage(channelId, message._id, {
        deleted: new Date()
      })

      const { files } = message

      if (files) {
        files.forEach(file => {
          storageService.deleteFile(this.currentUserId, message._id, file)
        })
      }
    },

    async uploadFile ({ file, messageId, channelId }) {
      return new Promise(resolve => {
        let type = file.extension || file.type
        if (type === 'svg' || type === 'pdf') {
          type = file.type
        }

        const uploadTask = storageService.uploadFileTask(
          this.currentUserId,
          messageId,
          file,
          type
        )

        uploadTask.on(
          'state_changed',
          snap => {
            const progress = Math.round(
              (snap.bytesTransferred / snap.totalBytes) * 100
            )
            this.updateFileProgress(messageId, file.localUrl, progress)
          },
          error => {
            console.error(error)
            resolve(false)
          },
          async () => {
            const url = await storageService.getFileDownloadUrl(
              uploadTask.snapshot.ref
            )

            const messageDoc = await firestoreService.getMessage(
              channelId,
              messageId
            )

            const files = messageDoc.data().files

            files.forEach(f => {
              if (f.url === file.localUrl) {
                f.url = url
              }
            })

            await firestoreService.updateMessage(channelId, messageId, { files })
            resolve(true)
          }
        )
      })
    },

    updateFileProgress (messageId, fileUrl, progress) {
      const message = this.messages.find(message => message._id === messageId)

      if (!message || !message.files) return

      message.files.find(file => file.url === fileUrl).progress = progress
      this.messages = [...this.messages]
    },

    formattedFiles (files) {
      const formattedFiles = []

      files.forEach(file => {
        const messageFile = {
          name: file.name,
          size: file.size,
          type: file.type,
          extension: file.extension || file.type,
          url: file.url || file.localUrl
        }

        if (file.audio) {
          messageFile.audio = true
          messageFile.duration = file.duration
        }

        formattedFiles.push(messageFile)
      })

      return formattedFiles
    },

    openFile ({ file }) {
      window.open(file.file.url, '_blank')
    },

    async openUserTag ({ user }) {
      let channelId

      this.channels.forEach(channel => {
        if (channel.users.length === 2) {
          const userId1 = channel.users[0]._id
          const userId2 = channel.users[1]._id
          if (
            (userId1 === user._id || userId1 === this.currentUserId) &&
            (userId2 === user._id || userId2 === this.currentUserId)
          ) {
            channelId = channel.channelId
          }
        }
      })

      if (channelId) {
        this.channelId = channelId
        return
      }

      const query1 = await firestoreService.getUserChannels(
        this.currentUserId,
        user._id
      )

      if (!query1.empty) {
        return this.loadChannel(query1)
      }

      const query2 = await firestoreService.getUserChannels(
        user._id,
        this.currentUserId
      )

      if (!query2.empty) {
        return this.loadChannel(query2)
      }

      const channel = await firestoreService.addChannel({
        users: [user._id, this.currentUserId],
        lastUpdated: new Date()
      })

      this.channelId = channel.id
      this.fetchChannels()
    },

    async loadChannel (query) {
      query.forEach(async channel => {
        if (this.loadingChannels) return
        await firestoreService.updateChannel(channel.id, { lastUpdated: new Date() })
        this.channelId = channel.id
        this.fetchChannels()
      })
    },

    menuActionHandler ({ action }) {
      switch (action.name) {
        case 'settings':
          return this.openSettingsModal()
      }
    },

    channelActionHandler ({ action, channelId }) {
      switch (action.name) {
        case 'deleteChannel':
          return this.deleteChannel(channelId)
        case 'leaveGroup':
          return this.leaveGroup(channelId)
        case 'manageGroup':
          return this.openGroupManageModal(channelId)
      }
    },

    async sendMessageReaction ({ reaction, remove, messageId, channelId }) {
      firestoreService.updateMessageReactions(
        channelId,
        messageId,
        this.currentUserId,
        reaction.unicode,
        remove ? 'remove' : 'add'
      )
    },

    typingMessage ({ message, channelId }) {
      if (channelId) {
        if (message?.length > 1) {
          this.typingMessageCache = message
          return
        }

        if (message?.length === 1 && this.typingMessageCache) {
          this.typingMessageCache = message
          return
        }

        this.typingMessageCache = message

        firestoreService.updateChannelTypingUsers(
          channelId,
          this.currentUserId,
          message ? 'add' : 'remove'
        )
      }
    },

    async listenChannels (query) {
      const listener = firestoreService.firestoreListener(query, channels => {
        const newChannels = []
        channels.forEach(channel => {
          const foundChannel = this.channels.find(r => r.channelId === channel.id)
          if (foundChannel) {
            foundChannel.typingUsers = channel.data().typingUsers
            foundChannel.index = channel.data().lastUpdated.seconds
          } else {
            newChannels.push(channel.id)
            if (!newChannels.includes(channel.id)) {
              newChannels.push(channel.id)
            }
          }
        })
        this.listenedNewChannels = newChannels.length
      })
      this.channelsListeners.push(listener)
    },

    listenUsersOnlineStatus (channels) {
      channels.forEach(channel => {
        channel.users.forEach(user => {
          const listener = firebaseService.firebaseListener(
            firebaseService.userStatusRef(user._id),
            snapshot => {
              if (!snapshot || !snapshot.val()) return

              const lastChanged = formatTimestamp(
                new Date(snapshot.val().lastChanged),
                new Date(snapshot.val().lastChanged)
              )

              user.status = { ...snapshot.val(), lastChanged }

              const channelIndex = this.channels.findIndex(
                r => channel.channelId === r.channelId
              )

              this.channels[channelIndex] = channel
              this.channels = [...this.channels]
            }
          )
          this.channelsListeners.push(listener)
        })
      })
    },

    inviteUser (channelId) {
      this.resetForms()
      this.invitechannelId = channelId
    },

    // async addChannelUser () {
    //   this.disableForm = true

    //   const { id } = await firestoreService.addUser({
    //     username: this.invitedUsername
    //   })
    //   await firestoreService.updateUser(id, { _id: id })

    //   await firestoreService.addChannelUser(this.invitechannelId, id)

    //   this.invitechannelId = null
    //   this.invitedUsername = ''
    //   this.fetchChannels()
    // },

    removeUser (channelId) {
      this.resetForms()
      this.removechannelId = channelId
      this.removeUsers = this.channels.find(channel => channel.channelId === channelId).users
    },

    async leaveGroup (channelId) {
      await firestoreService.removeChannelUser(
        channelId,
        this.currentUserId
      )
      this.fetchChannels()
    },

    openGroupManageModal (channelId) {
      this.selectedGroupId = channelId
      this.getGroup(channelId)
      this.showGroupManageModal = true
    },

    async removeGroupUser (channelId, userId) {
      await firestoreService.removeChannelUser(
        channelId,
        userId
      )

      const updatedGroupUsers = this.group.users.filter(user => {
        return user._id !== userId
      })
      this.group.users = updatedGroupUsers
      this.fetchChannels()
    },

    async deleteChannel (channelId) {
      firestoreService.getMessages(channelId).then(messages => {
        messages.forEach(message => {
          firestoreService.deleteMessage(channelId, message.id)
          if (message.data().files) {
            message.data().files.forEach(file => {
              storageService.deleteFile(this.currentUserId, message.id, file)
            })
          }
        })
      })

      await firestoreService.deleteChannel(channelId)

      this.fetchChannels()
    },

    resetForms () {
      this.disableForm = false
      this.addNewChannel = null
      // this.addChannelUsername = ''
      this.invitechannelId = null
      this.invitedUsername = ''
      this.removechannelId = null
      this.removeUserId = ''
    },

    refresh () {
      this.channelCreationModalShow = false
      this.groupChannelCreationModalShow = false
      this.showGroupManageModal = false
      this.fetchChannels()
    },

    openSettingsModal () {
      this.showSettingsModal = true
    },

    async getGroup (channelId) {
      const group = this.channels.find(channel => channel.channelId === channelId)
      this.group = group
    }
  }
}
</script>

<style lang="scss" scoped>
.window-container {
  width: 100%;
}

.window-mobile {
  form {
    padding: 0 10px 10px;
  }
}

form {
  padding-bottom: 20px;
}

input {
  padding: 5px;
  width: 140px;
  height: 21px;
  border-radius: 4px;
  border: 1px solid #d2d6da;
  outline: none;
  font-size: 14px;
  vertical-align: middle;

  &::placeholder {
    color: #9ca6af;
  }
}

button {
  background: #1976d2;
  color: #fff;
  outline: none;
  cursor: pointer;
  border-radius: 4px;
  padding: 8px 12px;
  margin-left: 10px;
  border: none;
  font-size: 14px;
  transition: 0.3s;
  vertical-align: middle;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.6;
  }

  &:disabled {
    cursor: initial;
    background: #c6c9cc;
    opacity: 0.6;
  }
}

.button-cancel {
  color: #a8aeb3;
  background: none;
  margin-left: 5px;
}

select {
  vertical-align: middle;
  height: 33px;
  width: 152px;
  font-size: 13px;
  margin: 0 !important;
}
</style>
