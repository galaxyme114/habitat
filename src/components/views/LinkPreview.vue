<template>
  <div class="card link-preview" id="link-preview">
    <img :src="link.img" class="card-img-top" />
    <div class="card-body">
      <h5 class="card-title">{{ link.title }}</h5>
      <p class="card-text">
        {{ link.description }}
      </p>
      <span>
        <stream-line-icon :icon="LinkUnlink.Hyperlink3" stroke="#F26B6B" :size="20" />
        <a :href="link.domain">{{ link.domain }}</a>
      </span>
    </div>
    <button class="action-menu" :id="`link-${link.id}-action-menu`">
      <stream-line-icon :icon="Menu.NavigationMenuHorizontal" :size="20" />
    </button>
    <ActionMenuPopover
      :target="`link-${link.id}-action-menu`"
      @editTrigger="showEditLinkModal = true"
      @deleteTrigger="showDeleteLinkConfirmModal = true"
    />
    <EditLinkModal :show="showEditLinkModal" :link="link" @hide="showEditLinkModal = false" @ok="refresh" />
    <DeleteResourceConfirmModal
      :show="showDeleteLinkConfirmModal"
      resourceType="Link Preview"
      @close="showDeleteLinkConfirmModal = false"
      @ok="handleDeleteLink"
    />
  </div>
</template>
<script>
import api from '@/api'
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import LinkUnlink from '@streamlinehq/streamline-regular/lib/interface-essential/LinkUnlink'
import Menu from '@streamlinehq/streamline-regular/lib/interface-essential/Menu'
import ActionMenuPopover from './popovers/ActionMenuPopover'
import EditLinkModal from '@/components/views/modals/EditLinkModal'
import DeleteResourceConfirmModal from '@/components/views/modals/DeleteResourceConfirmModal'

export default {
  props: ['link'],
  components: {
    StreamLineIcon,
    ActionMenuPopover,
    EditLinkModal,
    DeleteResourceConfirmModal
  },
  data () {
    return {
      LinkUnlink,
      Menu,
      showEditLinkModal: false,
      showDeleteLinkConfirmModal: false
    }
  },
  methods: {
    openEditLinkModal () {
      this.showEditLinkModal = true
    },
    refresh () {
      this.$emit('refresh')
    },
    async handleDeleteLink () {
      try {
        await api.links.deleteLink(this.link.id)
        this.$toasted.success('Link preview removed')
        this.refresh()
      } catch (error) {
        this.$toasted.error('Link preview not removed')
      }
    }
  }
}
</script>
