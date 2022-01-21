<template>
  <div class="habitat-channel-container">
    <slot name="channel-list-item" v-bind="{ channel }">
      <slot name="channel-list-avatar" v-bind="{ channel }">
        <div v-if="channel.group">
          <b-avatar :variant="channel.variant" icon="people-fill" size="2.7rem" style="margin-right: 15px"></b-avatar>
        </div>
        <div v-else>
          <b-avatar
            v-if="channel.avatar"
            variant="secondary"
            :src="channel.avatar"
            size="2.7rem"
            style="margin-right: 15px"
            badge
            :badge-variant="userStatus === 'online' ? 'success' : 'warning'"
          ></b-avatar>
          <b-avatar
            v-else variant="secondary"
            :text="channel.avatarText"
            size="2.7rem"
            :class="`avatar-color-${channel.avatarColor}`"
            style="margin-right: 15px"
            badge
            :badge-variant="userStatus === 'online' ? 'success' : 'warning'"
          ></b-avatar>
        </div>
      </slot>
      <div class="habitat-name-container habitat-text-ellipsis">
        <div class="habitat-title-container">
          <div class="habitat-channel-name habitat-text-ellipsis">
            {{ channel.channelName }}
          </div>
          <div v-if="channel.lastMessage" class="habitat-text-date">
            {{ channel.lastMessage.timestamp }}
          </div>
        </div>
        <div
          class="habitat-text-last"
          :class="{
            'habitat-message-new':
              channel.lastMessage && channel.lastMessage.new && !typingUsers
          }"
        >
          <span v-if="isMessageCheckmarkVisible">
            <slot name="checkmark-icon" v-bind="{ message: channel.lastMessage }">
              <svg-icon
                :name="
                  channel.lastMessage.distributed
                    ? 'double-checkmark'
                    : 'checkmark'
                "
                :param="channel.lastMessage.seen ? 'seen' : ''"
                class="habitat-icon-check"
              />
            </slot>
          </span>
          <div
            v-if="channel.lastMessage && !channel.lastMessage.deleted && isAudio"
            class="habitat-text-ellipsis"
          >
            <slot name="microphone-icon">
              <svg-icon name="microphone" class="habitat-icon-microphone" />
              {{ formattedDuration }}
            </slot>
          </div>
          <format-message
            v-else-if="channel.lastMessage"
            :content="getLastMessage"
            :deleted="!!channel.lastMessage.deleted && !typingUsers"
            :users="channel.users"
            :linkify="false"
            :text-formatting="textFormatting"
            :link-options="linkOptions"
            :single-line="true"
          >
            <template #deleted-icon="data">
              <slot name="deleted-icon" v-bind="data" />
            </template>
          </format-message>
          <div
            v-if="!channel.lastMessage && typingUsers"
            class="habitat-text-ellipsis"
          >
            {{ typingUsers }}
          </div>
          <div class="habitat-channel-options-container">
            <div
              v-if="channel.unreadCount"
              class="habitat-badge-counter habitat-channel-badge"
            >
              {{ channel.unreadCount }}
            </div>
            <slot name="channel-list-options" v-bind="{ channel }">
              <div
                v-if="channelActions.length || groupChannelActions"
                class="habitat-svg-button habitat-list-channel-options"
                @click.stop="channelMenuOpened = channel.channelId"
              >
                <slot name="channel-list-options-icon">
                  <svg-icon name="dropdown" para="channel" />
                </slot>
              </div>
              <transition v-if="channelActions.length || groupChannelActions.length" name="habitat-slide-left">
                <div
                  v-if="channelMenuOpened === channel.channelId"
                  v-click-outside="closeChannelMenu"
                  class="habitat-menu-options"
                >
                  <div class="habitat-menu-list" v-if="channel.group">
                    <div v-for="action in groupChannelActions" :key="action.name">
                      <div
                        class="habitat-menu-item"
                        @click.stop="channelActionHandler(action)"
                      >
                        {{ action.title }}
                      </div>
                    </div>
                  </div>
                  <div class="habitat-menu-list" v-else>
                    <div v-for="action in channelActions" :key="action.name">
                      <div
                        class="habitat-menu-item"
                        @click.stop="channelActionHandler(action)"
                      >
                        {{ action.title }}
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
            </slot>
          </div>
        </div>
      </div>
    </slot>
  </div>
</template>

<script>
import vClickOutside from 'v-click-outside'

import SvgIcon from '../../../components/SvgIcon/SvgIcon'
import FormatMessage from '../../../components/FormatMessage/FormatMessage'

import typingText from '../../../utils/typing-text'
import { isAudioFile } from '../../../utils/media-file'

import { BAvatar } from 'bootstrap-vue'

export default {
  name: 'ChannelContent',
  components: {
    SvgIcon,
    FormatMessage,
    BAvatar
  },

  directives: {
    clickOutside: vClickOutside.directive
  },

  props: {
    currentUserId: { type: [String, Number], required: true },
    channel: { type: Object, required: true },
    textFormatting: { type: Object, required: true },
    linkOptions: { type: Object, required: true },
    textMessages: { type: Object, required: true },
    channelActions: { type: Array, required: true },
    groupChannelActions: { type: Array, required: true }
  },

  emits: ['channel-action-handler'],

  data () {
    return {
      channelMenuOpened: null
    }
  },

  computed: {
    getLastMessage () {
      const isTyping = this.typingUsers
      if (isTyping) return isTyping

      const content = this.channel.lastMessage.deleted
        ? this.textMessages.MESSAGE_DELETED
        : this.channel.lastMessage.content

      if (this.channel.users.length <= 2) {
        return content
      }

      const user = this.channel.users.find(
        user => user._id === this.channel.lastMessage.senderId
      )

      if (this.channel.lastMessage.username) {
        return `${this.channel.lastMessage.username} - ${content}`
      } else if (!user || user._id === this.currentUserId) {
        return content
      }

      return `${user.username} - ${content}`
    },
    userStatus () {
      if (!this.channel.users || this.channel.users.length !== 1) return
      const user = this.channel.users.find(u => u._id !== this.currentUserId)
      if (user && user.status) return user.status.state

      return null
    },
    typingUsers () {
      return typingText(this.channel, this.currentUserId, this.textMessages)
    },
    isMessageCheckmarkVisible () {
      return (
        !this.typingUsers &&
        this.channel.lastMessage &&
        !this.channel.lastMessage.deleted &&
        this.channel.lastMessage.senderId === this.currentUserId &&
        (this.channel.lastMessage.saved ||
          this.channel.lastMessage.distributed ||
          this.channel.lastMessage.seen)
      )
    },
    formattedDuration () {
      const file = this.channel.lastMessage.files[0]

      if (!file.duration) {
        return `${file.name}.${file.extension}`
      }

      let s = Math.floor(file.duration)
      return (s - (s %= 60)) / 60 + (s > 9 ? ':' : ':0') + s
    },
    isAudio () {
      return this.channel.lastMessage.files
        ? isAudioFile(this.channel.lastMessage.files[0])
        : false
    }
  },

  methods: {
    channelActionHandler (action) {
      this.closeChannelMenu()
      this.$emit('channel-action-handler', { action, channelId: this.channel.channelId })
    },
    closeChannelMenu () {
      this.channelMenuOpened = null
    }
  }
}
</script>
