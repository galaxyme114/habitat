<template>
  <div class="habitat-message-file-container">
    <div
      v-if="isImage"
      :ref="'imageRef' + index"
      class="habitat-message-image-container"
      @mouseover="imageHover = true"
      @mouseleave="imageHover = false"
      @click.stop="openFile('preview')"
    >
      <progress-bar
        v-if="file.progress >= 0"
        :progress="file.progress"
        :style="{ top: `${imageResponsive.loaderTop}px` }"
      />
      <loader
        v-else
        :show="isImageLoading"
        :style="{ top: `${imageResponsive.loaderTop}px` }"
      >
        <template v-for="(idx, name) in $scopedSlots" #[name]="data">
          <slot :name="name" v-bind="data" />
        </template>
      </loader>
      <div
        class="habitat-message-image"
        :class="{
          'habitat-blur-loading':
            isImageLoading && message.senderId === currentUserId
        }"
        :style="{
          'background-image': `url('${
            isImageLoading ? file.preview || file.url : file.url
          }')`,
          'max-height': `${imageResponsive.maxHeight}px`
        }"
      >
        <transition name="habitat-fade-image">
          <div v-if="imageHover && !isImageLoading" class="habitat-image-buttons">
            <div
              class="habitat-svg-button habitat-button-view"
              @click.stop="openFile('preview')"
            >
              <slot name="eye-icon">
                <svg-icon name="eye" />
              </slot>
            </div>
            <div
              class="habitat-svg-button habitat-button-download"
              @click.stop="openFile('download')"
            >
              <slot name="document-icon">
                <svg-icon name="document" />
              </slot>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <div
      v-else-if="isVideo"
      class="habitat-video-container"
      @click.stop.prevent="openFile('preview')"
    >
      <progress-bar v-if="file.progress >= 0" :progress="file.progress" />
      <video width="100%" height="100%" controls>
        <source :src="file.url" />
      </video>
    </div>
  </div>
</template>

<script>
import Loader from '../../../../components/Loader/Loader'
import ProgressBar from '../../../../components/ProgressBar/ProgressBar'
import SvgIcon from '../../../../components/SvgIcon/SvgIcon'

import { isImageFile, isVideoFile } from '../../../../utils/media-file'

export default {
  name: 'MessageFile',
  components: { SvgIcon, Loader, ProgressBar },

  props: {
    currentUserId: { type: [String, Number], required: true },
    message: { type: Object, required: true },
    file: { type: Object, required: true },
    index: { type: Number, required: true }
  },

  emits: ['open-file'],

  data () {
    return {
      imageResponsive: '',
      imageLoading: false,
      imageHover: false
    }
  },

  computed: {
    isImageLoading () {
      return this.file.url.indexOf('blob:http') !== -1 || this.imageLoading
    },
    isImage () {
      return isImageFile(this.file)
    },
    isVideo () {
      return isVideoFile(this.file)
    }
  },

  watch: {
    file: {
      immediate: true,
      handler () {
        this.checkImgLoad()
      }
    }
  },

  mounted () {
    const ref = this.$refs['imageRef' + this.index]

    if (ref) {
      this.imageResponsive = {
        maxHeight: ref.clientWidth - 18,
        loaderTop: ref.clientHeight / 2 - 9
      }
    }
  },

  methods: {
    checkImgLoad () {
      if (!isImageFile(this.file)) return
      this.imageLoading = true
      const image = new Image()
      image.src = this.file.url
      image.addEventListener('load', () => (this.imageLoading = false))
    },
    openFile (action) {
      this.$emit('open-file', { file: this.file, action })
    }
  }
}
</script>
