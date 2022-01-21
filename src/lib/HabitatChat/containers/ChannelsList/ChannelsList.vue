<template>
  <div
    v-show="showChannelsList"
    class="habitat-channels-container habitat-app-border-r"
    :class="{ 'habitat-channels-container-full': isMobile }"
  >
    <slot name="channels-header" />

    <slot name="channels-list-search">
      <channels-search
        :channels="channels"
        :loading-channels="loadingChannels"
        :text-messages="textMessages"
        :show-search="showSearch"
        :show-add-channel="showAddChannel"
        @search-channel="searchChannel"
        @open-add-channel-menu="openAddChannelMenu = true"
      >
        <template v-for="(i, name) in $scopedSlots" #[name]="data">
          <slot :name="name" v-bind="data" />
        </template>
      </channels-search>
    </slot>

    <!-- Channel Creation Menu -->
    <transition name="habitat-slide-up">
      <div
        v-if="openAddChannelMenu"
        v-click-outside="closeAddChannelMenu"
        class="habitat-menu-options"
        style="top: 45px"
      >
        <div class="habitat-menu-list">
          <div
            class="habitat-menu-item"
            @click.stop="channelAddActionHandler('add-channel')"
          >
            New Chat
          </div>
          <div
            class="habitat-menu-item"
            @click.stop="channelAddActionHandler('add-group-channel')"
          >
            New Group Chat
          </div>
        </div>
      </div>
    </transition>
    <!-- /. Channel Creation Menu -->

    <loader :show="loadingChannels">
      <template v-for="(idx, name) in $scopedSlots" #[name]="data">
        <slot :name="name" v-bind="data" />
      </template>
    </loader>

    <div v-if="!loadingChannels && !channels.length" class="habitat-channels-empty">
      <slot name="channels-empty">
        {{ textMessages.CHANNELS_EMPTY }}
      </slot>
    </div>

    <div v-if="!loadingChannels" id="channels-list" class="habitat-channel-list">
      <div
        v-for="fChannel in filteredChannels"
        :id="fChannel.channelId"
        :key="fChannel.channelId"
        class="habitat-channel-item"
        :class="{ 'habitat-channel-selected': selectedChannelId === fChannel.channelId }"
        @click="openChannel(fChannel)"
      >
        <channel-content
          :current-user-id="currentUserId"
          :channel="fChannel"
          :text-formatting="textFormatting"
          :link-options="linkOptions"
          :text-messages="textMessages"
          :channel-actions="channelActions"
          :group-channel-actions="groupChannelActions"
          @channel-action-handler="$emit('channel-action-handler', $event)"
        >
          <template v-for="(i, name) in $scopedSlots" #[name]="data">
            <slot :name="name" v-bind="data" />
          </template>
        </channel-content>
      </div>
      <transition name="habitat-fade-message">
        <div v-if="channels.length && !loadingChannels" id="infinite-loader-channels">
          <loader :show="showLoader" :infinite="true">
            <template v-for="(idx, name) in $scopedSlots" #[name]="data">
              <slot :name="name" v-bind="data" />
            </template>
          </loader>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import Loader from '../../components/Loader/Loader'

import ChannelsSearch from './ChannelsSearch/ChannelsSearch'
import ChannelContent from './ChannelContent/ChannelContent'

import filteredItems from '../../utils/filter-items'
import vClickOutside from 'v-click-outside'

export default {
  name: 'ChannelsList',
  components: {
    Loader,
    ChannelsSearch,
    ChannelContent
  },

  directives: {
    clickOutside: vClickOutside.directive
  },

  props: {
    currentUserId: { type: [String, Number], required: true },
    textMessages: { type: Object, required: true },
    showChannelsList: { type: Boolean, required: true },
    showSearch: { type: Boolean, required: true },
    showAddChannel: { type: Boolean, required: true },
    textFormatting: { type: Object, required: true },
    linkOptions: { type: Object, required: true },
    isMobile: { type: Boolean, required: true },
    channels: { type: Array, required: true },
    loadingChannels: { type: Boolean, required: true },
    channelsLoaded: { type: Boolean, required: true },
    channel: { type: Object, required: true },
    channelActions: { type: Array, required: true },
    groupChannelActions: { type: Array, required: true },
    scrollDistance: { type: Number, required: true }
  },

  emits: [
    'add-channel',
    'add-group-channel',
    'channel-action-handler',
    'loading-more-channels',
    'fetch-channel',
    'fetch-more-channels'
  ],

  data () {
    return {
      filteredChannels: this.channels || [],
      observer: null,
      showLoader: true,
      loadingMoreChannels: false,
      selectedChannelId: '',
      openAddChannelMenu: false
    }
  },

  watch: {
    channels: {
      deep: true,
      handler (newVal, oldVal) {
        this.filteredChannels = newVal
        if (newVal.length !== oldVal.length || this.channelsLoaded) {
          this.loadingMoreChannels = false
        }
      }
    },
    loadingChannels (val) {
      if (!val) {
        setTimeout(() => this.initIntersectionObserver())
      }
    },
    loadingMoreChannels (val) {
      this.$emit('loading-more-channels', val)
    },
    channelsLoaded: {
      immediate: true,
      handler (val) {
        if (val) {
          this.loadingMoreChannels = false
          if (!this.loadingChannels) {
            this.showLoader = false
          }
        }
      }
    },
    channel: {
      immediate: true,
      handler (val) {
        if (val && !this.isMobile) this.selectedChannelId = val.channelId
      }
    }
  },

  methods: {
    initIntersectionObserver () {
      if (this.observer) {
        this.showLoader = true
        this.observer.disconnect()
      }

      const loader = document.getElementById('infinite-loader-channels')

      if (loader) {
        const options = {
          root: document.getElementById('channels-list'),
          rootMargin: `${this.scrollDistance}px`,
          threshold: 0
        }

        this.observer = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting) {
            this.loadMoreChannels()
          }
        }, options)

        this.observer.observe(loader)
      }
    },
    searchChannel (ev) {
      this.filteredChannels = filteredItems(
        this.channels,
        'channelName',
        ev.target.value
      )
    },
    openChannel (channel) {
      if (channel.channelId === this.channel.channelId && !this.isMobile) return
      if (!this.isMobile) this.selectedChannelId = channel.channelId
      this.$emit('fetch-channel', { channel })
    },
    loadMoreChannels () {
      if (this.loadingMoreChannels) return

      if (this.channelsLoaded) {
        this.loadingMoreChannels = false
        this.showLoader = false
        return
      }

      this.$emit('fetch-more-channels')
      this.loadingMoreChannels = true
    },
    closeAddChannelMenu () {
      this.openAddChannelMenu = false
    },
    channelAddActionHandler (action) {
      this.closeAddChannelMenu()
      this.$emit(action)
    }
  }
}
</script>
