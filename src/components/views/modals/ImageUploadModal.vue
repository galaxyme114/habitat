<template>
  <b-modal v-model="showModal" title="Upload Images" ok-only ok-title="Done" @ok="onOk" @hide="close">
    <dropzone id="dropzone" :url="url" accepted-file-types="image/*" :header="headers" :moodboardId="moodboardId" />
  </b-modal>
</template>
<script>
import { mapState } from 'vuex'
import { BModal } from 'bootstrap-vue'
import Dropzone from '../../form/DropZone'

export default {
  name: 'ArticleCreationModal',
  props: ['show', 'selectedProject', 'userId', 'moodboardId'],
  components: {
    BModal,
    Dropzone
  },
  data () {
    return {
      url: process.env.VUE_APP_API_URL + '/v1/media/dropzone'
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
    ...mapState({
      headers: (state) => {
        return { Authorization: 'Bearer ' + state.auth.tokens.access.token }
      }
    })
  },
  methods: {
    close () {
      this.$emit('close')
    },
    onOk () {
      this.$emit('ok')
    }
  }
}
</script>
