<template>
  <b-popover id="settings-menu-popover" :target="target" :placement="'bottomleft'" triggers="focus">
    <!-- <div @click="toggleModal('Add User')" class="dropdown-item">Add user</div>
      <div @click="toggleModal('Remove User')" class="dropdown-item">Remove user</div> -->
    <div v-if="!isArchived" class="dropdown-item" @click="settingsClicked">Settings</div>
    <div v-if="!isArchived" class="dropdown-item" @click="teamClicked">Manage Team</div>
    <div v-if="!isArchived" class="divider"></div>
    <div class="dropdown-item" @click="archiveClicked">{{ isArchived ? 'Unarchive Habitat' : 'Archive Habitat' }}</div>
  </b-popover>
</template>
<script>
import { BPopover } from 'bootstrap-vue'
export default {
  props: ['target', 'isArchived'],
  components: {
    BPopover
  },
  methods: {
    teamClicked () {
      this.$emit('team')
    },
    settingsClicked () {
      this.$emit('settings')
    },
    archiveClicked () {
      this.$emit('archive')
    }
  }
}
</script>
