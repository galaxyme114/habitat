<template>
  <b-modal
    size="md"
    v-model="showModal"
    title="Add Url"
    ok-title="Insert"
    @ok="handleSaveLink"
    ok-only
    :ok-disabled="loading"
    id="add-link-modal"
    @hide="hide"
  >
    <label for="url-input">Content URL</label>
    <div class="d-flex">
      <b-form-input
        id="url-input"
        placeholder="Paste URL for media you want to attach"
        v-model="linkUrl"
        :disabled="loading"
        @input="fetchLinkData"
      />
      <!-- <b-button class="load-button" variant="primary" :disabled="loading" :loading="loading" @click="fetchLinkData"
        >Load</b-button
      > -->
    </div>
    <div class="d-flex justify-content-center mt-2">
      <loader v-if="loading" :loading="loading" colour="#f26b6b" />
    </div>
    <div class="card" id="link-preview" v-if="Object.keys(linkPreviewData).length">
      <img v-if="linkPreviewData.images.length" :src="linkPreviewData.images[0]" class="card-img-top" />
      <div class="card-body">
        <h5 class="card-title">{{ linkPreviewData.title }}</h5>
        <p class="card-text">
          {{ linkPreviewData.description }}
        </p>
        <span>
          <stream-line-icon :icon="LinkUnlink.Hyperlink3" stroke="#F26B6B" :size="20" />
          <a :href="linkPreviewData.url">{{ linkPreviewData.url }}</a>
        </span>
      </div>
    </div>
  </b-modal>
</template>
<script>
import api from '@/api'
import {
  BModal,
  // BButton,
  BFormInput
} from 'bootstrap-vue'
import { debounce } from 'lodash'
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import LinkUnlink from '@streamlinehq/streamline-regular/lib/interface-essential/LinkUnlink'
import Loader from '@/components/Loader'

export default {
  name: 'AddLinkModal',
  props: ['show', 'selectedProject'],
  components: {
    BModal,
    BFormInput,
    // BButton,
    Loader,
    StreamLineIcon
  },
  data () {
    return {
      LinkUnlink,
      linkPreviewData: {},
      linkUrl: 'http://',
      loading: false
    }
  },
  computed: {
    showModal: {
      get () {
        return this.show
      },
      set (newVal) {
        return newVal
      }
    }
  },
  methods: {
    ok () {
      this.$emit('ok')
    },
    hide () {
      this.$emit('hide')
    },
    fetchLinkData: debounce(async function () {
      this.loading = true
      try {
        const response = await api.links.getPreview(this.linkUrl)
        this.linkPreviewData = response.data
      } catch (error) {
        this.$toasted.error('Could not fetch link preview')
      }
      this.loading = false
    }, 500),
    async handleSaveLink () {
      const payload = {
        description: this.linkPreviewData.description,
        title: this.linkPreviewData.title,
        img: this.linkPreviewData.images.length ? this.linkPreviewData.images[0] : '',
        domain: this.linkPreviewData.url
      }
      try {
        await api.links.create(payload, this.selectedProject)
        this.$toasted.success('Link preview created')
        this.ok()
      } catch (error) {
        this.$toasted.error('Link preview not created')
      }
    }
  }
}
</script>
