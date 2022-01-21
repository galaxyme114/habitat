<template>
  <div class="habitat-reply-message">
    <div class="habitat-reply-username">
      {{ replyUsername }}
    </div>

    <div v-if="isImage" class="habitat-image-reply-container">
      <div
        class="habitat-message-image habitat-message-image-reply"
        :style="{
          'background-image': `url('${firstFile.url}')`
        }"
      />
    </div>

    <div v-else-if="isVideo" class="habitat-video-reply-container">
      <video width="100%" height="100%" controls>
        <source :src="firstFile.url" />
      </video>
    </div>

    <audio-player
      v-else-if="isAudio"
      :src="firstFile.url"
      @update-progress-time="progressTime = $event"
      @hover-audio-progress="hoverAudioProgress = $event"
    >
      <template v-for="(i, name) in $scopedSlots" #[name]="data">
        <slot :name="name" v-bind="data" />
      </template>
    </audio-player>

    <div v-else-if="isOtherFile" class="habitat-file-container">
      <div>
        <slot name="file-icon">
          <svg-icon name="file" />
        </slot>
      </div>
      <div class="habitat-text-ellipsis">
        {{ firstFile.name }}
      </div>
      <div
        v-if="firstFile.extension"
        class="habitat-text-ellipsis habitat-text-extension"
      >
        {{ firstFile.extension }}
      </div>
    </div>

    <div class="habitat-reply-content">
      <format-message
        :content="message.replyMessage.content"
        :users="channelUsers"
        :text-formatting="textFormatting"
        :link-options="linkOptions"
        :reply="true"
      >
        <template v-for="(i, name) in $scopedSlots" #[name]="data">
          <slot :name="name" v-bind="data" />
        </template>
      </format-message>
    </div>
  </div>
</template>

<script>
import SvgIcon from '../../../components/SvgIcon/SvgIcon'
import FormatMessage from '../../../components/FormatMessage/FormatMessage'

import AudioPlayer from '../AudioPlayer/AudioPlayer'

import {
  isAudioFile,
  isImageFile,
  isVideoFile
} from '../../../utils/media-file'

export default {
  name: 'MessageReply',
  components: { AudioPlayer, SvgIcon, FormatMessage },

  props: {
    message: { type: Object, required: true },
    textFormatting: { type: Object, required: true },
    linkOptions: { type: Object, required: true },
    channelUsers: { type: Array, required: true }
  },

  computed: {
    replyUsername () {
      const { senderId } = this.message.replyMessage
      const replyUser = this.channelUsers.find(user => user._id === senderId)
      return replyUser ? replyUser.username : ''
    },
    firstFile () {
      return this.message.replyMessage.files?.length
        ? this.message.replyMessage.files[0]
        : {}
    },
    isAudio () {
      return isAudioFile(this.firstFile)
    },
    isImage () {
      return isImageFile(this.firstFile)
    },
    isVideo () {
      return isVideoFile(this.firstFile)
    },
    isOtherFile () {
      return (
        this.message.replyMessage.files?.length &&
        !this.isAudio &&
        !this.isVideo &&
        !this.isImage
      )
    }
  }
}
</script>
