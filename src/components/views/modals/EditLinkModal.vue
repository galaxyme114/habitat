<template>
  <b-modal
    size="md"
    v-model="showModal"
    title="Edit Url"
    ok-title="Save"
    @ok="handleUpdateLink"
    @cancel="hide"
    :ok-disabled="okDisabled"
    id="update-link-modal"
    @hide="hide"
  >
    <label for="url-input">Content URL</label>
    <div class="d-flex">
      <b-form-input
        id="url-input"
        placeholder="Paste URL for media you want to attach"
        v-model="urlValue"
        :disabled="loading"
        @input="fetchLinkData"
      />
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
import { BModal, BFormInput } from 'bootstrap-vue'
import { debounce } from 'lodash'
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import LinkUnlink from '@streamlinehq/streamline-regular/lib/interface-essential/LinkUnlink'
import Loader from '@/components/Loader'

export default {
  name: 'EditLinkModal',
  props: ['show', 'link'],
  components: {
    BModal,
    BFormInput,
    Loader,
    StreamLineIcon
  },
  data () {
    return {
      linkUrl: 'http://',
      LinkUnlink,
      linkPreviewData: {},
      loading: false,
      okDisabled: true
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
    },
    urlValue: {
      get () {
        return this.link.domain
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
      this.linkPreviewData = {}
      this.$emit('hide')
    },
    fetchLinkData: debounce(async function (e) {
      this.loading = true
      this.okDisabled = true
      try {
        const response = await api.links.getPreview(e)
        this.linkPreviewData = response.data
        this.okDisabled = false
      } catch (error) {
        this.$toasted.error('Could not fetch link preview')
        this.okDisabled = true
      }
      this.loading = false
    }, 500),
    async handleUpdateLink () {
      const payload = {
        description: this.linkPreviewData.description,
        title: this.linkPreviewData.title,
        img: this.linkPreviewData.images.length ? this.linkPreviewData.images[0] : '',
        domain: this.linkPreviewData.url
      }
      try {
        await api.links.update(this.link.id, payload)
        this.$toasted.success('Link preview updated')
        this.ok()
      } catch (error) {
        this.$toasted.error('Link preview not updated')
      }
    }
  }
}
</script>
