<template>
  <div class="habitat-channel-header habitat-app-border-b">
    <slot name="channel-header" v-bind="{ channel, typingUsers, userStatus }">
      <div class="habitat-channel-wrapper">
        <div
          v-if="!singleChannel"
          class="habitat-svg-button habitat-toggle-button"
          :class="{ 'habitat-rotate-icon': !showChannelsList && !isMobile }"
          @click="$emit('toggle-channels-list')"
        >
          <slot name="toggle-icon">
            <svg-icon name="toggle" />
          </slot>
        </div>
        <div
          class="habitat-info-wrapper"
          :class="{ 'habitat-item-clickable': channelInfoEnabled }"
          @click="$emit('channel-info')"
        >
          <slot name="channel-header-avatar" v-bind="{ channel }">
            <div v-if="!channel.group">
              <b-avatar v-if="channel.avatar" variant="secondary" :src="channel.avatar" size="2.7rem" style="margin-right: 15px"></b-avatar>
              <b-avatar
                v-else variant="secondary"
                :text="channel.avatarText"
                size="2.7rem"
                :class="`avatar-color-${channel.avatarColor}`"
                style="margin-right: 15px"
              ></b-avatar>
            </div>
            <div v-else>
              <b-avatar :variant="channel.variant" icon="people-fill" size="2.7rem" style="margin-right: 15px"></b-avatar>
            </div>
          </slot>
          <slot
            name="channel-header-info"
            v-bind="{ channel, typingUsers, userStatus }"
          >
            <div class="habitat-text-ellipsis">
              <div class="habitat-channel-name habitat-text-ellipsis">
                {{ channel.channelName }}
              </div>
              <div v-if="typingUsers" class="habitat-channel-info habitat-text-ellipsis">
                {{ typingUsers }}
              </div>
              <div v-else class="habitat-channel-info habitat-text-ellipsis d-flex align-items-center">
                <span v-if="!channel.group" :class="`badge-${userStatus === 'online' ? 'online' : 'offline'} d-inline-block`"></span>
                {{ userStatusText }}
              </div>
            </div>
          </slot>
        </div>
        <slot v-if="channel.channelId" name="channel-options">
          <div
            v-if="menuActions.length"
            class=""
            @click="menuOpened = !menuOpened"
          >
            <slot name="menu-icon">
              <svg-icon name="menu" />
            </slot>
          </div>
          <transition v-if="menuActions.length" name="habitat-slide-left">
            <div
              v-if="menuOpened"
              v-click-outside="closeMenu"
              class="habitat-menu-options"
            >
              <div class="habitat-menu-list">
                <div v-for="action in menuActions" :key="action.name">
                  <div class="habitat-menu-item" @click="menuActionHandler(action)">
                    {{ action.title }}
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </slot>
      </div>
    </slot>
  </div>
</template>

<script>
import vClickOutside from 'v-click-outside'

import SvgIcon from '../../../components/SvgIcon/SvgIcon'

import typingText from '../../../utils/typing-text'

export default {
  name: 'ChannelHeader',
  components: {
    SvgIcon
  },

  directives: {
    clickOutside: vClickOutside.directive
  },

  props: {
    currentUserId: { type: [String, Number], required: true },
    textMessages: { type: Object, required: true },
    singleChannel: { type: Boolean, required: true },
    showChannelsList: { type: Boolean, required: true },
    isMobile: { type: Boolean, required: true },
    channelInfoEnabled: { type: Boolean, required: true },
    menuActions: { type: Array, required: true },
    channel: { type: Object, required: true }
  },

  emits: ['toggle-channels-list', 'channel-info', 'menu-action-handler'],

  data () {
    return {
      menuOpened: false
    }
  },

  computed: {
    typingUsers () {
      return typingText(this.channel, this.currentUserId, this.textMessages)
    },
    userStatus () {
      if (!this.channel.users || this.channel.users.length !== 1) return
      const user = this.channel.users.find(u => u._id !== this.currentUserId)
      if (user && user.status) return user.status.state

      return null
    },
    userStatusText () {
      if (!this.channel.users || this.channel.users.length !== 1) return

      const user = this.channel.users.find(u => u._id !== this.currentUserId)

      if (!user.status) return

      let text = ''

      if (user.status.state === 'online') {
        text = this.textMessages.IS_ONLINE
      } else if (user.status.lastChanged) {
        text = this.textMessages.LAST_SEEN + user.status.lastChanged
      }
      return text
    }
  },

  methods: {
    menuActionHandler (action) {
      this.closeMenu()
      this.$emit('menu-action-handler', action)
    },
    closeMenu () {
      this.menuOpened = false
    }
  }
}
</script>
