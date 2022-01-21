<template>
  <b-modal
    size="sm"
    v-model="showModal"
    title="Delete Image"
    ok-title="Delete"
    @ok="handleDeleteImage"
    @cancel="close"
    @hide="close"
    :ok-disabled="loading"
    id="delete-image-modal"
    centered
    hide-header
  >
    <label for="url-input">Are you sure?</label>
  </b-modal>
</template>
<script>
import api from '@/api'
import { BModal } from 'bootstrap-vue'

export default {
  name: 'DeleteImageModal',
  props: ['show', 'selectedImageId', 'moodboardId'],
  components: {
    BModal
  },
  data () {
    return {
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
    close () {
      this.$emit('close')
    },
    async handleDeleteImage () {
      this.loading = true
      try {
        await api.moodBoard.deleteImage(this.selectedImageId, this.moodboardId)
        this.$toasted.success('Image removed')
        this.ok()
      } catch (error) {
        this.$toasted.error('Image not removed')
      }
      this.loading = false
    }
  }
}
</script>
