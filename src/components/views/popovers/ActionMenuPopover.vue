<template>
  <b-popover id="action-menu-popover" :target="target" :placement="'bottomLeft'" triggers="focus">
    <div @click="editTrigger" class="dropdown-item edit">Edit</div>
    <div @click="deleteTrigger" class="dropdown-item delete">Delete</div>
  </b-popover>
</template>
<script>
import { BPopover } from 'bootstrap-vue'
export default {
  props: ['target'],
  components: {
    BPopover
  },
  methods: {
    editTrigger () {
      this.$emit('editTrigger')
    },
    deleteTrigger () {
      this.$emit('deleteTrigger')
    }
  }
}
</script>
