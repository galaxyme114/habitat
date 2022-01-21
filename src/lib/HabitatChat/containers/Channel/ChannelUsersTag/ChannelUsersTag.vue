<template>
  <transition name="habitat-slide-up">
    <div
      v-if="filteredUsersTag.length"
      class="habitat-tags-container"
      :style="{ bottom: `${$parent.$refs.channelFooter.clientHeight}px` }"
    >
      <div
        v-for="(user, index) in filteredUsersTag"
        :key="user._id"
        class="habitat-tags-box"
        :class="{ 'habitat-tags-box-active': index === activeItem }"
        @mouseover="activeItem = index"
        @click="$emit('select-user-tag', user)"
      >
        <div class="habitat-tags-info">
          <div
            v-if="user.avatar"
            class="habitat-avatar habitat-tags-avatar"
            :style="{ 'background-image': `url('${user.avatar}')` }"
          />
          <div class="habitat-tags-username">
            {{ user.firstName }}
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ChannelUsersTag',

  props: {
    filteredUsersTag: { type: Array, required: true },
    selectItem: { type: Boolean, default: null },
    activeUpOrDown: { type: Number, default: null }
  },

  emits: ['select-user-tag', 'activate-item'],

  data () {
    return {
      activeItem: null
    }
  },

  watch: {
    filteredUsersTag () {
      this.activeItem = 0
    },
    selectItem (val) {
      if (val) {
        this.$emit('select-user-tag', this.filteredUsersTag[this.activeItem])
      }
    },
    activeUpOrDown () {
      if (
        this.activeUpOrDown > 0 &&
        this.activeItem < this.filteredUsersTag.length - 1
      ) {
        this.activeItem++
      } else if (this.activeUpOrDown < 0 && this.activeItem > 0) {
        this.activeItem--
      }
      this.$emit('activate-item')
    }
  }
}
</script>
