<template>
  <div class="habitat-message-files-container">
    <div v-for="(file, idx) in imageVideoFiles" :key="idx + 'iv'">
      <message-file
        :file="file"
        :current-user-id="currentUserId"
        :message="message"
        :index="idx"
        @open-file="$emit('open-file', $event)"
      >
        <template v-for="(i, name) in $scopedSlots" #[name]="data">
          <slot :name="name" v-bind="data" />
        </template>
      </message-file>
    </div>

    <div v-for="(file, idx) in otherFiles" :key="idx + 'a'">
      <progress-bar
        v-if="file.progress >= 0"
        :progress="file.progress"
        :style="{ top: '54px' }"
      />
      <div
        class="habitat-file-container"
        :class="{ 'habitat-file-container-progress': file.progress >= 0 }"
        @click.stop="openFile(file, 'download')"
      >
        <div class="habitat-svg-button">
          <slot name="document-icon">
            <svg-icon name="document" />
          </slot>
        </div>
        <div class="habitat-text-ellipsis">
          {{ file.name }}
        </div>
        <div v-if="file.extension" class="habitat-text-ellipsis habitat-text-extension">
          {{ file.extension }}
        </div>
      </div>
    </div>

    <format-message
      :content="message.content"
      :users="channelUsers"
      :text-formatting="textFormatting"
      :link-options="linkOptions"
      @open-user-tag="$emit('open-user-tag')"
    >
      <template v-for="(i, name) in $scopedSlots" #[name]="data">
        <slot :name="name" v-bind="data" />
      </template>
    </format-message>
  </div>
</template>

<script>
import SvgIcon from '../../../components/SvgIcon/SvgIcon'
import FormatMessage from '../../../components/FormatMessage/FormatMessage'
import ProgressBar from '../../../components/ProgressBar/ProgressBar'

import MessageFile from './MessageFile/MessageFile'

import { isImageVideoFile } from '../../../utils/media-file'

export default {
  name: 'MessageFiles',
  components: { SvgIcon, FormatMessage, ProgressBar, MessageFile },

  props: {
    currentUserId: { type: [String, Number], required: true },
    message: { type: Object, required: true },
    channelUsers: { type: Array, required: true },
    textFormatting: { type: Object, required: true },
    linkOptions: { type: Object, required: true }
  },

  emits: ['open-file', 'open-user-tag'],

  computed: {
    imageVideoFiles () {
      return this.message.files.filter(file => isImageVideoFile(file))
    },
    otherFiles () {
      return this.message.files.filter(file => !isImageVideoFile(file))
    }
  },

  methods: {
    openFile (file, action) {
      this.$emit('open-file', { file, action })
    }
  }
}
</script>
