<template>
  <b-modal
    size="sm"
    v-model="showModal"
    :title="`Delete ${resourceType}`"
    ok-title="Yes"
    @ok="ok"
    @cancel="close"
    @hide="close"
    centered
    hide-header
  >
    <span class="text-danger">{{ `Are you sure to delete this ${resourceType}?` }}</span>
  </b-modal>
</template>
<script>
import { BModal } from 'bootstrap-vue'
export default {
  name: 'DeleteResourceConfirmModal',
  props: ['show', 'resourceType'],
  components: {
    BModal
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
    }
  }
}
</script>
