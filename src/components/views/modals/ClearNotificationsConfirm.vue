<template>
  <b-modal
    size="sm"
    v-model="showModal"
    title="Clear Notifications"
    ok-title="Clear All"
    @ok="ok"
    @cancel="close"
    @hide="close"
    centered
  >
    <span class="text-danger">Notifications will be deleted permanently. Make a sure.</span>
  </b-modal>
</template>
<script>
import { BModal } from 'bootstrap-vue'
export default {
  name: 'ClearNotificationsConfirm',
  props: ['show'],
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
