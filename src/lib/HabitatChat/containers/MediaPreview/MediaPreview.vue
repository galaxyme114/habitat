<template>
  <div
    ref="modal"
    tabindex="0"
    class="habitat-media-preview"
    @click.stop="closeModal"
    @keydown.esc="closeModal"
  >
    <transition name="habitat-bounce-preview" appear>
      <div v-if="isImage" class="habitat-media-preview-container">
        <div
          class="habitat-image-preview"
          :style="{
            'background-image': `url('${file.url}')`
          }"
        />
      </div>

      <div v-else-if="isVideo" class="habitat-media-preview-container">
        <video width="100%" height="100%" controls autoplay>
          <source :src="file.url" />
        </video>
      </div>
    </transition>

    <div class="habitat-svg-button">
      <slot name="preview-close-icon">
        <svg-icon name="close-outline" param="preview" />
      </slot>
    </div>
  </div>
</template>

<script>
import SvgIcon from '../../components/SvgIcon/SvgIcon'

import { isImageFile, isVideoFile } from '../../utils/media-file'

export default {
  name: 'MediaPreview',
  components: {
    SvgIcon
  },

  props: {
    file: { type: Object, required: true }
  },

  emits: ['close-media-preview'],

  computed: {
    isImage () {
      return isImageFile(this.file)
    },
    isVideo () {
      return isVideoFile(this.file)
    }
  },

  mounted () {
    this.$refs.modal.focus()
  },

  methods: {
    closeModal () {
      this.$emit('close-media-preview')
    }
  }
}
</script>
