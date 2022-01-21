<template>
  <div class="habitat-card-window" :style="[{ height }, cssVars]">
    <div class="habitat-chat-container">
      <channels-list
        v-if="!singleChannel"
        :current-user-id="currentUserId"
        :channels="orderedChannels"
        :loading-channels="loadingChannels"
        :channels-loaded="channelsLoaded"
        :channel="channel"
        :channel-actions="channelActions"
        :group-channel-actions="groupChannelActions"
        :text-messages="t"
        :show-search="showSearch"
        :show-add-channel="showAddChannel"
        :show-channels-list="showChannelsList"
        :text-formatting="textFormatting"
        :link-options="linkOptions"
        :is-mobile="isMobile"
        :scroll-distance="scrollDistance"
        @fetch-channel="fetchChannel"
        @fetch-more-channels="fetchMoreChannels"
        @loading-more-channels="loadingMoreChannels = $event"
        @add-channel="addChannel"
        @add-group-channel="addGroupChannel"
        @channel-action-handler="channelActionHandler"
      >
        <template v-for="(i, name) in $scopedSlots" #[name]="data">
          <slot :name="name" v-bind="data" />
        </template>
      </channels-list>

      <channel
        :current-user-id="currentUserId"
        :channels="channels"
        :channel-id="channel.channelId || ''"
        :load-first-channel="loadFirstChannel"
        :messages="messages"
        :channel-message="channelMessage"
        :messages-loaded="messagesLoaded"
        :menu-actions="menuActions"
        :message-actions="messageActions"
        :auto-scroll="autoScroll"
        :show-send-icon="showSendIcon"
        :show-files="showFiles"
        :show-audio="showAudio"
        :audio-bit-rate="audioBitRate"
        :audio-sample-rate="audioSampleRate"
        :show-emojis="showEmojis"
        :show-reaction-emojis="showReactionEmojis"
        :show-new-messages-divider="showNewMessagesDivider"
        :show-footer="showFooter"
        :text-messages="t"
        :single-channel="singleChannel"
        :show-channels-list="showChannelsList"
        :text-formatting="textFormatting"
        :link-options="linkOptions"
        :is-mobile="isMobile"
        :loading-channels="loadingChannels"
        :channel-info-enabled="channelInfoEnabled"
        :textarea-action-enabled="textareaActionEnabled"
        :user-tags-enabled="userTagsEnabled"
        :emojis-suggestion-enabled="emojisSuggestionEnabled"
        :scroll-distance="scrollDistance"
        :accepted-files="acceptedFiles"
        :templates-text="templatesText"
        @toggle-channels-list="toggleChannelsList"
        @channel-info="channelInfo"
        @fetch-messages="fetchMessages"
        @send-message="sendMessage"
        @edit-message="editMessage"
        @delete-message="deleteMessage"
        @open-file="openFile"
        @open-user-tag="openUserTag"
        @open-failed-message="openFailedMessage"
        @menu-action-handler="menuActionHandler"
        @message-action-handler="messageActionHandler"
        @send-message-reaction="sendMessageReaction"
        @typing-message="typingMessage"
        @textarea-action-handler="textareaActionHandler"
      >
        <template v-for="(i, name) in $scopedSlots" #[name]="data">
          <slot :name="name" v-bind="data" />
        </template>
      </channel>
    </div>
    <transition name="habitat-fade-preview" appear>
      <media-preview
        v-if="showMediaPreview"
        :file="previewFile"
        @close-media-preview="showMediaPreview = false"
      />
    </transition>
  </div>
</template>

<script>
import ChannelsList from './containers/ChannelsList/ChannelsList'
import Channel from './containers/Channel/Channel'
import MediaPreview from './containers/MediaPreview/MediaPreview'

import locales from './locales'
import { defaultThemeStyles, cssThemeVars } from './themes'
import { channelsValidation, partcipantsValidation } from './utils/data-validation'

export default {
  name: 'ChatMain',
  components: {
    ChannelsList,
    Channel,
    MediaPreview
  },

  props: {
    height: { type: String, default: '600px' },
    theme: { type: String, default: 'light' },
    styles: { type: Object, default: () => ({}) },
    responsiveBreakpoint: { type: Number, default: 900 },
    singleChannel: { type: Boolean, default: false },
    channelsListOpened: { type: Boolean, default: true },
    textMessages: { type: Object, default: null },
    currentUserId: { type: [String, Number], default: '' },
    channels: { type: Array, default: () => [] },
    channelsOrder: { type: String, default: 'desc' },
    loadingChannels: { type: Boolean, default: false },
    channelsLoaded: { type: Boolean, default: false },
    channelId: { type: [String, Number], default: null },
    loadFirstChannel: { type: Boolean, default: true },
    messages: { type: Array, default: () => [] },
    messagesLoaded: { type: Boolean, default: false },
    channelActions: { type: Array, default: () => [] },
    groupChannelActions: { type: Array, default: () => [] },
    menuActions: { type: Array, default: () => [] },
    messageActions: {
      type: Array,
      default: () => [
        { name: 'replyMessage', title: 'Reply' },
        { name: 'editMessage', title: 'Edit Message', onlyMe: true },
        { name: 'deleteMessage', title: 'Delete Message', onlyMe: true }
      ]
    },
    autoScroll: {
      type: Object,
      default: () => {
        return {
          send: {
            new: true,
            newAfterScrollUp: true
          },
          receive: {
            new: true,
            newAfterScrollUp: false
          }
        }
      }
    },
    showSearch: { type: Boolean, default: true },
    showAddChannel: { type: Boolean, default: true },
    showSendIcon: { type: Boolean, default: true },
    showFiles: { type: Boolean, default: true },
    showAudio: { type: Boolean, default: true },
    audioBitRate: { type: Number, default: 128 },
    audioSampleRate: { type: Number, default: 44100 },
    showEmojis: { type: Boolean, default: true },
    showReactionEmojis: { type: Boolean, default: true },
    showNewMessagesDivider: { type: Boolean, default: true },
    showFooter: { type: Boolean, default: true },
    textFormatting: {
      type: Object,
      default: () => ({
        disabled: false,
        italic: '_',
        bold: '*',
        strike: '~',
        underline: '°',
        multilineCode: '```',
        inlineCode: '`'
      })
    },
    linkOptions: {
      type: Object,
      default: () => ({ disabled: false, target: '_blank', rel: null })
    },
    channelInfoEnabled: { type: Boolean, default: false },
    textareaActionEnabled: { type: Boolean, default: false },
    userTagsEnabled: { type: Boolean, default: true },
    emojisSuggestionEnabled: { type: Boolean, default: true },
    channelMessage: { type: String, default: '' },
    scrollDistance: { type: Number, default: 60 },
    acceptedFiles: { type: String, default: '*' },
    templatesText: { type: Array, default: null },
    mediaPreviewEnabled: { type: Boolean, default: true }
  },

  emits: [
    'toggle-channels-list',
    'channel-info',
    'fetch-messages',
    'send-message',
    'edit-message',
    'delete-message',
    'open-file',
    'open-user-tag',
    'open-failed-message',
    'menu-action-handler',
    'message-action-handler',
    'send-message-reaction',
    'typing-message',
    'textarea-action-handler',
    'fetch-more-channels',
    'add-channel',
    'add-group-channel',
    'channel-action-handler'
  ],

  data () {
    return {
      channel: {},
      loadingMoreChannels: false,
      showChannelsList: true,
      isMobile: false,
      showMediaPreview: false,
      previewFile: {}
    }
  },

  computed: {
    t () {
      return {
        ...locales,
        ...this.textMessages
      }
    },
    cssVars () {
      const defaultStyles = defaultThemeStyles[this.theme]
      const customStyles = {}

      Object.keys(defaultStyles).map(key => {
        customStyles[key] = {
          ...defaultStyles[key],
          ...(this.styles[key] || {})
        }
      })

      return cssThemeVars(customStyles)
    },
    orderedChannels () {
      return this.channels.slice().sort((a, b) => {
        const aVal = a.index || 0
        const bVal = b.index || 0

        if (this.channelsOrder === 'asc') {
          return aVal < bVal ? -1 : bVal < aVal ? 1 : 0
        }

        return aVal > bVal ? -1 : bVal > aVal ? 1 : 0
      })
    }
  },

  watch: {
    channels: {
      immediate: true,
      deep: true,
      handler (newVal, oldVal) {
        if (
          !newVal[0] ||
          !newVal.find(channel => channel.channelId === this.channel.channelId)
        ) {
          this.showChannelsList = true
        }

        if (
          !this.loadingMoreChannels &&
          this.loadFirstChannel &&
          newVal[0] &&
          (!oldVal || newVal.length !== oldVal.length)
        ) {
          if (this.channelId) {
            const channel = newVal.find(r => r.channelId === this.channelId) || {}
            this.fetchChannel({ channel })
          } else if (!this.isMobile || this.singleChannel) {
            this.fetchChannel({ channel: this.orderedChannels[0] })
          } else {
            this.showChannelsList = true
          }
        }
      }
    },

    loadingChannels (val) {
      if (val) this.channel = {}
    },

    channelId: {
      immediate: true,
      handler (newVal, oldVal) {
        if (newVal && !this.loadingChannels && this.channels.length) {
          const channel = this.channels.find(r => r.channelId === newVal)
          this.fetchChannel({ channel })
        } else if (oldVal && !newVal) {
          this.channel = {}
        }
      }
    },

    channel (val) {
      if (!val || Object.entries(val).length === 0) return

      channelsValidation(val)

      val.users.forEach(user => {
        partcipantsValidation(user)
      })
    },

    channelsListOpened (val) {
      this.showChannelsList = val
    }
  },

  created () {
    this.updateResponsive()
    window.addEventListener('resize', ev => {
      if (ev.isTrusted) this.updateResponsive()
    })
  },

  methods: {
    updateResponsive () {
      this.isMobile = window.innerWidth < this.responsiveBreakpoint
    },
    toggleChannelsList () {
      this.showChannelsList = !this.showChannelsList
      if (this.isMobile) this.channel = {}
      this.$emit('toggle-channels-list', { opened: this.showChannelsList })
    },
    fetchChannel ({ channel }) {
      this.channel = channel
      this.fetchMessages({ reset: true })
      if (this.isMobile) this.showChannelsList = false
    },
    fetchMoreChannels () {
      this.$emit('fetch-more-channels')
    },
    channelInfo () {
      this.$emit('channel-info', this.channel)
    },
    addChannel () {
      this.$emit('add-channel')
    },
    addGroupChannel () {
      this.$emit('add-group-channel')
    },
    fetchMessages (options) {
      this.$emit('fetch-messages', { channel: this.channel, options })
    },
    sendMessage (message) {
      this.$emit('send-message', { ...message, channelId: this.channel.channelId })
    },
    editMessage (message) {
      this.$emit('edit-message', { ...message, channelId: this.channel.channelId })
    },
    deleteMessage (message) {
      this.$emit('delete-message', { message, channelId: this.channel.channelId })
    },
    openFile ({ message, file }) {
      if (this.mediaPreviewEnabled && file.action === 'preview') {
        this.previewFile = file.file
        this.showMediaPreview = true
      } else {
        this.$emit('open-file', { message, file })
      }
    },
    openUserTag ({ user }) {
      this.$emit('open-user-tag', { user })
    },
    openFailedMessage ({ message }) {
      this.$emit('open-failed-message', {
        message,
        channelId: this.channel.channelId
      })
    },
    menuActionHandler (ev) {
      this.$emit('menu-action-handler', {
        action: ev,
        channelId: this.channel.channelId
      })
    },
    channelActionHandler ({ action, channelId }) {
      this.$emit('channel-action-handler', {
        action,
        channelId
      })
    },
    messageActionHandler (ev) {
      this.$emit('message-action-handler', {
        ...ev,
        channelId: this.channel.channelId
      })
    },
    sendMessageReaction (messageReaction) {
      this.$emit('send-message-reaction', {
        ...messageReaction,
        channelId: this.channel.channelId
      })
    },
    typingMessage (message) {
      this.$emit('typing-message', {
        message,
        channelId: this.channel.channelId
      })
    },
    textareaActionHandler (message) {
      this.$emit('textarea-action-handler', {
        message,
        channelId: this.channel.channelId
      })
    }
  }
}
</script>

<style lang="scss">
@import './styles/index.scss';
</style>
