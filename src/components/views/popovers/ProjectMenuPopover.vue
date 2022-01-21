<template>
  <b-popover id="settings-menu-popover" :target="target" :placement="'bottomleft'" triggers="focus">
    <div v-if="!isArchived" @click="navigate" class="dropdown-item">View Project</div>
    <div v-if="!isArchived" @click="share" class="dropdown-item">Share</div>
    <div v-if="!isArchived" @click="settings" class="dropdown-item">Project Settings</div>
    <div v-if="!isArchived" class="divider"></div>
    <div @click="archive" class="dropdown-item">{{ isArchived ? 'Unarchive Project' : 'Archive Project' }}</div>
  </b-popover>
</template>
<script>
import { BPopover } from 'bootstrap-vue'

export default {
  name: 'AddContentPopover',
  props: ['target', 'isArchived'],
  components: {
    BPopover
  },
  computed: {
    showPopover: {
      get () {
        return this.show
      },
      set (newVal) {
        return newVal
      }
    }
  },
  methods: {
    navigate () {
      this.$emit('navigate')
    },
    archive () {
      if (this.isArchived) {
        console.log('unarchive')
        this.$emit('unarchive')
      } else {
        this.$emit('archive')
      }
    },
    settings () {
      this.$emit('settings')
    },
    share () {
      this.$emit('share')
    }
  }
}
</script>
