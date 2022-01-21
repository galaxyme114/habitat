<template>
  <transition name="habitat-slide-up">
    <div
      v-if="messageReply"
      class="habitat-reply-container"
      :style="{ bottom: `${$parent.$refs.channelFooter.clientHeight}px` }"
    >
      <div class="habitat-reply-box">
        <div class="habitat-reply-info">
          <div class="habitat-reply-username">
            {{ messageReply.username }}
          </div>
          <div class="habitat-reply-content">
            <format-message
              :content="messageReply.content"
              :users="channel.users"
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

        <img v-if="isImage" :src="firstFile.url" class="habitat-image-reply" />

        <video v-else-if="isVideo" controls class="habitat-image-reply">
          <source :src="firstFile.url" />
        </video>

        <audio-player
          v-else-if="isAudio"
          :src="firstFile.url"
          class="habitat-audio-reply"
        >
          <template v-for="(i, name) in $scopedSlots" #[name]="data">
            <slot :name="name" v-bind="data" />
          </template>
        </audio-player>

        <div v-else-if="isOtherFile" class="habitat-image-reply habitat-file-container">
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
      </div>

      <div class="habitat-icon-reply">
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
import FormatMessage from '../../../components/FormatMessage/FormatMessage'

import AudioPlayer from '../../Message/AudioPlayer/AudioPlayer'

import { isAudioFile, isImageFile, isVideoFile } from '../../../utils/media-file'

export default {
  name: 'ChannelMessageReply',
  components: {
    SvgIcon,
    FormatMessage,
    AudioPlayer
  },

  props: {
    channel: { type: Object, required: true },
    messageReply: { type: Object, default: null },
    textFormatting: { type: Object, required: true },
    linkOptions: { type: Object, required: true }
  },

  emits: ['reset-message'],

  computed: {
    firstFile () {
      return this.messageReply.files?.length ? this.messageReply.files[0] : {}
    },
    isImage () {
      return isImageFile(this.firstFile)
    },
    isVideo () {
      return isVideoFile(this.firstFile)
    },
    isAudio () {
      return isAudioFile(this.firstFile)
    },
    isOtherFile () {
      return (
        this.messageReply.files?.length &&
        !this.isAudio &&
        !this.isVideo &&
        !this.isImage
      )
    }
  }
}
</script>
