<template>
  <transition name="habitat-slide-up">
    <div
      v-if="files.length"
      class="habitat-channel-files-container"
      :style="{ bottom: `${$parent.$refs.channelFooter.clientHeight}px` }"
    >
      <div class="habitat-files-box">
        <div v-for="(file, i) in files" :key="i">
          <channel-file
            :file="file"
            :index="i"
            @remove-file="$emit('remove-file', $event)"
          />
        </div>
      </div>

      <div class="habitat-icon-close">
        <div class="habitat-svg-button" @click="$emit('reset-message')">
          <slot name="reply-close-icon">
            <svg-icon name="close-outline" />
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import SvgIcon from '../../../components/SvgIcon/SvgIcon'

import ChannelFile from './ChannelFile/ChannelFile'

export default {
  name: 'ChannelFiles',
  components: {
    SvgIcon,
    ChannelFile
  },

  props: {
    files: { type: Array, required: true }
  },

  emits: ['remove-file', 'reset-message']
}
</script>
