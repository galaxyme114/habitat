<template>
  <div
    :class="{
      'habitat-box-search': showSearchBar,
      'habitat-box-empty': !showSearchBar
    }"
  >
    <template v-if="showSearch">
      <div v-if="!loadingChannels && channels.length" class="habitat-icon-search">
        <slot name="search-icon">
          <svg-icon name="search" />
        </slot>
      </div>
      <input
        v-if="!loadingChannels && channels.length"
        type="search"
        :placeholder="textMessages.SEARCH"
        autocomplete="off"
        class="habitat-input"
        @input="$emit('search-channel', $event)"
      />
    </template>
    <div
      v-if="showAddChannel"
      class="habitat-svg-button habitat-add-icon"
      @click="$emit('open-add-channel-menu')"
    >
      <slot name="add-icon">
        <svg-icon name="add" />
      </slot>
    </div>
  </div>
</template>

<script>
import SvgIcon from '../../../components/SvgIcon/SvgIcon'

export default {
  name: 'ChannelsSearch',
  components: { SvgIcon },

  props: {
    textMessages: { type: Object, required: true },
    showSearch: { type: Boolean, required: true },
    showAddChannel: { type: Boolean, required: true },
    channels: { type: Array, required: true },
    loadingChannels: { type: Boolean, required: true }
  },

  emits: ['search-channel', 'open-add-channel-menu'],

  computed: {
    showSearchBar () {
      return this.showSearch || this.showAddChannel
    }
  }
}
</script>
