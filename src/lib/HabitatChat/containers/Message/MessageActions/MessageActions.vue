<template>
  <div class="habitat-message-actions-wrapper">
    <div
      class="habitat-options-container"
      :style="{
        display: hoverAudioProgress ? 'none' : 'initial',
        width:
          filteredMessageActions.length && showReactionEmojis ? '70px' : '45px'
      }"
    >
      <transition-group name="habitat-slide-left" tag="span">
        <div
          v-if="isMessageActions || isMessageReactions"
          key="1"
          class="habitat-blur-container"
          :class="{
            'habitat-options-me': message.senderId === currentUserId
          }"
        />

        <div
          v-if="isMessageActions"
          ref="actionIcon"
          key="2"
          class="habitat-svg-button habitat-message-options"
          @click="openOptions"
        >
          <slot name="dropdown-icon">
            <svg-icon name="dropdown" param="message" />
          </slot>
        </div>

        <emoji-picker-container
          v-if="isMessageReactions"
          key="3"
          v-click-outside="closeEmoji"
          class="habitat-message-emojis"
          :style="{ right: isMessageActions ? '30px' : '5px' }"
          :emoji-opened="emojiOpened"
          :emoji-reaction="true"
          :channel-footer-ref="channelFooterRef"
          :position-right="message.senderId === currentUserId"
          @add-emoji="sendMessageReaction"
          @open-emoji="openEmoji"
        >
          <template #emoji-picker-icon>
            <slot name="emoji-picker-reaction-icon" />
          </template>
        </emoji-picker-container>
      </transition-group>
    </div>

    <transition
      v-if="filteredMessageActions.length"
      :name="
        message.senderId === currentUserId
          ? 'habitat-slide-left'
          : 'habitat-slide-right'
      "
    >
      <div
        v-if="optionsOpened"
        ref="menuOptions"
        v-click-outside="closeOptions"
        class="habitat-menu-options"
        :class="{
          'habitat-menu-left': message.senderId !== currentUserId
        }"
        :style="{ top: `${menuOptionsTop}px` }"
      >
        <div class="habitat-menu-list">
          <div v-for="action in filteredMessageActions" :key="action.name">
            <div class="habitat-menu-item" @click="messageActionHandler(action)">
              {{ action.title }}
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import vClickOutside from 'v-click-outside'

import SvgIcon from '../../../components/SvgIcon/SvgIcon'
import EmojiPickerContainer from '../../../components/EmojiPickerContainer/EmojiPickerContainer'

export default {
  name: 'MessageActions',
  components: { SvgIcon, EmojiPickerContainer },

  directives: {
    clickOutside: vClickOutside.directive
  },

  props: {
    currentUserId: { type: [String, Number], required: true },
    message: { type: Object, required: true },
    messageActions: { type: Array, required: true },
    channelFooterRef: { type: HTMLDivElement, default: null },
    showReactionEmojis: { type: Boolean, required: true },
    hideOptions: { type: Boolean, required: true },
    messageHover: { type: Boolean, required: true },
    hoverMessageId: { type: [String, Number], default: null },
    hoverAudioProgress: { type: Boolean, required: true }
  },

  emits: [
    'update-emoji-opened',
    'update-options-opened',
    'update-message-hover',
    'hide-options',
    'message-action-handler',
    'send-message-reaction'
  ],

  data () {
    return {
      menuOptionsTop: 0,
      optionsOpened: false,
      optionsClosing: false,
      emojiOpened: false
    }
  },

  computed: {
    isMessageActions () {
      return (
        this.filteredMessageActions.length &&
        this.messageHover &&
        !this.message.deleted &&
        !this.message.disableActions &&
        !this.hoverAudioProgress
      )
    },
    isMessageReactions () {
      return (
        this.showReactionEmojis &&
        this.messageHover &&
        !this.message.deleted &&
        !this.message.disableReactions &&
        !this.hoverAudioProgress
      )
    },
    filteredMessageActions () {
      return this.message.senderId === this.currentUserId
        ? this.messageActions
        : this.messageActions.filter(message => !message.onlyMe)
    }
  },

  watch: {
    emojiOpened (val) {
      this.$emit('update-emoji-opened', val)
      if (val) this.optionsOpened = false
    },
    hideOptions (val) {
      if (val) {
        this.closeEmoji()
        this.closeOptions()
      }
    },
    optionsOpened (val) {
      this.$emit('update-options-opened', val)
    }
  },

  methods: {
    openOptions () {
      if (this.optionsClosing) return

      this.optionsOpened = !this.optionsOpened
      if (!this.optionsOpened) return

      this.$emit('hide-options', false)

      setTimeout(() => {
        if (
          !this.channelFooterRef ||
          !this.$refs.menuOptions ||
          !this.$refs.actionIcon
        ) {
          return
        }

        const menuOptionsTop = this.$refs.menuOptions.getBoundingClientRect().height

        const actionIconTop = this.$refs.actionIcon.getBoundingClientRect().top
        const channelFooterTop = this.channelFooterRef.getBoundingClientRect().top

        const optionsTopPosition =
          channelFooterTop - actionIconTop > menuOptionsTop + 50

        if (optionsTopPosition) this.menuOptionsTop = 30
        else this.menuOptionsTop = -menuOptionsTop
      })
    },
    closeOptions () {
      this.optionsOpened = false
      this.optionsClosing = true
      this.updateMessageHover()
      setTimeout(() => (this.optionsClosing = false), 100)
    },
    openEmoji () {
      this.emojiOpened = !this.emojiOpened
      this.$emit('hide-options', false)
    },
    closeEmoji () {
      this.emojiOpened = false
      this.updateMessageHover()
    },
    updateMessageHover () {
      if (this.hoverMessageId !== this.message._id) {
        this.$emit('update-message-hover', false)
      }
    },
    messageActionHandler (action) {
      this.closeOptions()
      this.$emit('message-action-handler', action)
    },
    sendMessageReaction (emoji, reaction) {
      this.$emit('send-message-reaction', { emoji, reaction })
      this.closeEmoji()
    }
  }
}
</script>
