<template>
  <div class="note-preview" :style="{ backgroundColor: note.colour }">
    <div class="note-header">
      <div class="note-tag" :style="{ color: note.colour }">Note</div>
      <div
        v-if="note.owner.image"
        class="profile-image"
        :style="{ backgroundImage: `url(${note.owner.image.url})`, height: '32px', width: '32px' }"
      />
      <img v-else :src="placeholder" :alt="note.owner.fullName" />
    </div>
    <div class="note-text">
      <p v-for="(text, i) in noteText.split('\n')" :key="`text-${i}`">
        <span v-html="text"></span>
      </p>
    </div>
    <button class="action-menu" :id="`note-${note.id}-action-menu`">
      <stream-line-icon :icon="Menu.NavigationMenuHorizontal" :size="20" />
    </button>
    <ActionMenuPopover
      :target="`note-${note.id}-action-menu`"
      @editTrigger="showEditNoteModal = true"
      @deleteTrigger="showDeleteNoteConfirmModal = true"
    />
    <EditNoteModal
      :show="showEditNoteModal"
      :note="note"
      @close="showEditNoteModal = false"
      @ok="refresh"
      :activeUsers="activeUsers"
    />
    <DeleteResourceConfirmModal
      :show="showDeleteNoteConfirmModal"
      resourceType="Note"
      @close="showDeleteNoteConfirmModal = false"
      @ok="handleDeleteNote"
    />
  </div>
</template>
<script>
import api from '@/api'
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import placeholder from '@/assets/icons/placeholder@2x.png'
import Menu from '@streamlinehq/streamline-regular/lib/interface-essential/Menu'
import ActionMenuPopover from './popovers/ActionMenuPopover'
import DeleteResourceConfirmModal from '@/components/views/modals/DeleteResourceConfirmModal'
import EditNoteModal from '@/components/views/modals/EditNoteModal'
export default {
  props: ['note', 'activeUsers'],
  components: {
    StreamLineIcon,
    ActionMenuPopover,
    DeleteResourceConfirmModal,
    EditNoteModal
  },
  data () {
    return {
      placeholder,
      Menu,
      showDeleteNoteConfirmModal: false,
      showEditNoteModal: false
    }
  },
  computed: {
    noteText: {
      get: function () {
        return this.note.text.replace(/(@\w+)/gi, '<span class="tagged-user">$1</span>')
      },
      set: function (newValue) {
        return newValue
      }
    }
  },
  methods: {
    refresh () {
      this.$emit('refresh')
    },
    async handleDeleteNote () {
      try {
        await api.notes.deleteNote(this.note.id)
        this.$toasted.success('Note has been removed')
        this.refresh()
      } catch (error) {
        this.$toasted.error('Note not removed')
      }
    }
  }
}
</script>
<style>
  .tagged-user {
    background-color: #f26b6b;
    padding: 0 0.5rem;
    border-radius: 5px;
    display: inline-block;
    margin: 3px;
  }
</style>
