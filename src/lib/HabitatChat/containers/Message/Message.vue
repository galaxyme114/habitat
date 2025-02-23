<template>
  <div :id="message._id" ref="message" class="habitat-message-wrapper">
    <div v-if="showDate" class="habitat-card-info habitat-card-date">
      {{ message.date }}
    </div>

    <div v-if="newMessage._id === message._id" class="habitat-line-new">
      {{ textMessages.NEW_MESSAGES }}
    </div>

    <div v-if="message.system" class="habitat-card-info habitat-card-system">
      <format-message
        :content="message.content"
        :users="channelUsers"
        :text-formatting="textFormatting"
        :link-options="linkOptions"
        @open-user-tag="openUserTag"
      >
        <template v-for="(i, name) in $scopedSlots" #[name]="data">
          <slot :name="name" v-bind="data" />
        </template>
      </format-message>
    </div>

    <div
      v-else
      class="habitat-message-box"
      :class="{ 'habitat-offset-current': message.senderId === currentUserId }"
    >
      <slot name="message" v-bind="{ message }">
        <div
          v-if="message.avatar && message.senderId !== currentUserId"
          class="habitat-avatar"
          :style="{ 'background-image': `url('${message.avatar}')` }"
        />
        <div
          v-if="hasSenderUserAvatar && !message.avatar"
          class="habitat-avatar-offset"
        />
        <div
          class="habitat-message-container"
          :class="{
            'habitat-message-container-offset': messageOffset
          }"
        >
          <div
            class="habitat-message-card"
            :class="{
              'habitat-message-highlight': isMessageHover,
              'habitat-message-current': message.senderId === currentUserId,
              'habitat-message-deleted': message.deleted
            }"
            @mouseover="onHoverMessage"
            @mouseleave="onLeaveMessage"
          >
            <div
              v-if="channelUsers.length > 2 && message.senderId !== currentUserId"
              class="habitat-text-username"
              :class="{
                'habitat-username-reply': !message.deleted && message.replyMessage
              }"
            >
              <span>{{ message.username }}</span>
            </div>

            <message-reply
              v-if="!message.deleted && message.replyMessage"
              :message="message"
              :channel-users="channelUsers"
              :text-formatting="textFormatting"
              :link-options="linkOptions"
            >
              <template v-for="(i, name) in $scopedSlots" #[name]="data">
                <slot :name="name" v-bind="data" />
              </template>
            </message-reply>

            <div v-if="message.deleted">
              <slot name="deleted-icon">
                <svg-icon name="deleted" class="habitat-icon-deleted" />
              </slot>
              <span>{{ textMessages.MESSAGE_DELETED }}</span>
            </div>

            <format-message
              v-else-if="!message.files || !message.files.length"
              :content="message.content"
              :users="channelUsers"
              :text-formatting="textFormatting"
              :link-options="linkOptions"
              @open-user-tag="openUserTag"
            >
              <template v-for="(i, name) in $scopedSlots" #[name]="data">
                <slot :name="name" v-bind="data" />
              </template>
            </format-message>

            <message-files
              v-else-if="!isAudio || message.files.length > 1"
              :current-user-id="currentUserId"
              :message="message"
              :channel-users="channelUsers"
              :text-formatting="textFormatting"
              :link-options="linkOptions"
              @open-file="openFile"
            >
              <template v-for="(i, name) in $scopedSlots" #[name]="data">
                <slot :name="name" v-bind="data" />
              </template>
            </message-files>

            <template v-else>
              <audio-player
                :message-id="message._id"
                :src="message.files[0].url"
                @update-progress-time="progressTime = $event"
                @hover-audio-progress="hoverAudioProgress = $event"
              >
                <template v-for="(i, name) in $scopedSlots" #[name]="data">
                  <slot :name="name" v-bind="data" />
                </template>
              </audio-player>

              <div v-if="!message.deleted" class="habitat-progress-time">
                {{ progressTime }}
              </div>
            </template>

            <div class="habitat-text-timestamp">
              <div
                v-if="message.edited && !message.deleted"
                class="habitat-icon-edited"
              >
                <slot name="pencil-icon">
                  <svg-icon name="pencil" />
                </slot>
              </div>
              <span>{{ message.timestamp }}</span>
              <span v-if="isCheckmarkVisible">
                <slot name="checkmark-icon" v-bind="{ message }">
                  <svg-icon
                    :name="
                      message.distributed ? 'double-checkmark' : 'checkmark'
                    "
                    :param="message.seen ? 'seen' : ''"
                    class="habitat-icon-check"
                  />
                </slot>
              </span>
            </div>

            <message-actions
              :current-user-id="currentUserId"
              :message="message"
              :message-actions="messageActions"
              :channel-footer-ref="channelFooterRef"
              :show-reaction-emojis="showReactionEmojis"
              :hide-options="hideOptions"
              :message-hover="messageHover"
              :hover-message-id="hoverMessageId"
              :hover-audio-progress="hoverAudioProgress"
              @hide-options="$emit('hide-options', false)"
              @update-message-hover="messageHover = $event"
              @update-options-opened="optionsOpened = $event"
              @update-emoji-opened="emojiOpened = $event"
              @message-action-handler="messageActionHandler"
              @send-message-reaction="sendMessageReaction"
            >
              <template v-for="(i, name) in $scopedSlots" #[name]="data">
                <slot :name="name" v-bind="data" />
              </template>
            </message-actions>
          </div>

          <message-reactions
            :current-user-id="currentUserId"
            :message="message"
            @send-message-reaction="sendMessageReaction"
          />
        </div>
        <slot name="message-failure" v-bind="{ message }">
          <div
            v-if="message.failure && message.senderId === currentUserId"
            class="habitat-failure-container habitat-svg-button"
            :class="{
              'habitat-failure-container-avatar':
                message.avatar && message.senderId === currentUserId
            }"
            @click="$emit('open-failed-message', { message })"
          >
            <div class="habitat-failure-text">
              !
            </div>
          </div>
        </slot>
        <div
          v-if="message.avatar && message.senderId === currentUserId"
          class="habitat-avatar habitat-avatar-current"
          :style="{ 'background-image': `url('${message.avatar}')` }"
        />
        <div
          v-if="hasCurrentUserAvatar && !message.avatar"
          class="habitat-avatar-current-offset"
        />
      </slot>
    </div>
  </div>
</template>

<script>
import SvgIcon from '../../components/SvgIcon/SvgIcon'
import FormatMessage from '../../components/FormatMessage/FormatMessage'

import MessageReply from './MessageReply/MessageReply'
import MessageFiles from './MessageFiles/MessageFiles'
import MessageActions from './MessageActions/MessageActions'
import MessageReactions from './MessageReactions/MessageReactions'
import AudioPlayer from './AudioPlayer/AudioPlayer'

import { messagesValidation } from '../../utils/data-validation'
import { isAudioFile } from '../../utils/media-file'

export default {
  name: 'Message',
  components: {
    SvgIcon,
    FormatMessage,
    AudioPlayer,
    MessageReply,
    MessageFiles,
    MessageActions,
    MessageReactions
  },

  props: {
    currentUserId: { type: [String, Number], required: true },
    textMessages: { type: Object, required: true },
    index: { type: Number, required: true },
    message: { type: Object, required: true },
    messages: { type: Array, required: true },
    editedMessage: { type: Object, required: true },
    channelUsers: { type: Array, default: () => [] },
    messageActions: { type: Array, required: true },
    channelFooterRef: { type: HTMLDivElement, default: null },
    newMessages: { type: Array, default: () => [] },
    showReactionEmojis: { type: Boolean, required: true },
    showNewMessagesDivider: { type: Boolean, required: true },
    textFormatting: { type: Object, required: true },
    linkOptions: { type: Object, required: true },
    hideOptions: { type: Boolean, required: true }
  },

  emits: [
    'hide-options',
    'message-added',
    'open-file',
    'open-user-tag',
    'open-failed-message',
    'message-action-handler',
    'send-message-reaction'
  ],

  data () {
    return {
      hoverMessageId: null,
      messageHover: false,
      optionsOpened: false,
      emojiOpened: false,
      newMessage: {},
      progressTime: '- : -',
      hoverAudioProgress: false
    }
  },

  computed: {
    showDate () {
      return (
        this.index > 0 &&
        this.message.date !== this.messages[this.index - 1].date
      )
    },
    messageOffset () {
      return (
        this.index > 0 &&
        this.message.senderId !== this.messages[this.index - 1].senderId
      )
    },
    isMessageHover () {
      return (
        this.editedMessage._id === this.message._id ||
        this.hoverMessageId === this.message._id
      )
    },
    isAudio () {
      return this.message.files?.some(file => isAudioFile(file))
    },
    isCheckmarkVisible () {
      return (
        this.message.senderId === this.currentUserId &&
        !this.message.deleted &&
        (this.message.saved || this.message.distributed || this.message.seen)
      )
    },
    hasCurrentUserAvatar () {
      return this.messages.some(
        message => message.senderId === this.currentUserId && message.avatar
      )
    },
    hasSenderUserAvatar () {
      return this.messages.some(
        message => message.senderId !== this.currentUserId && message.avatar
      )
    }
  },

  watch: {
    newMessages: {
      immediate: true,
      deep: true,
      handler (val) {
        if (!val.length || !this.showNewMessagesDivider) {
          this.newMessage = {}
          return
        }

        this.newMessage = val.reduce((res, obj) =>
          obj.index < res.index ? obj : res
        )
      }
    }
  },

  mounted () {
    messagesValidation(this.message)

    this.$emit('message-added', {
      message: this.message,
      index: this.index,
      ref: this.$refs.message
    })
  },

  methods: {
    onHoverMessage () {
      this.messageHover = true
      if (this.canEditMessage()) this.hoverMessageId = this.message._id
    },
    canEditMessage () {
      return !this.message.deleted
    },
    onLeaveMessage () {
      if (!this.optionsOpened && !this.emojiOpened) this.messageHover = false
      this.hoverMessageId = null
    },
    openFile (file) {
      this.$emit('open-file', { message: this.message, file: file })
    },
    openUserTag (user) {
      this.$emit('open-user-tag', { user })
    },
    messageActionHandler (action) {
      this.messageHover = false
      this.hoverMessageId = null

      setTimeout(() => {
        this.$emit('message-action-handler', { action, message: this.message })
      }, 300)
    },
    sendMessageReaction ({ emoji, reaction }) {
      this.$emit('send-message-reaction', {
        messageId: this.message._id,
        reaction: emoji,
        remove: reaction && reaction.indexOf(this.currentUserId) !== -1
      })
      this.messageHover = false
    }
  }
}
</script>
