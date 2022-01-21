<template>
  <div class="card article-preview">
    <!-- <img :src="roomPlan.image" class="card-img-top" v-if="roomPlan.image"/> -->
    <stream-line-icon :icon="MapsDimensions.RealEstateDimensionsBlock" stroke="grey" :size="160" class="card-img-top text-center py-2" />
    <div class="card-body">
      <div class="title">{{ roomPlan.name }}</div>
      <div class="description">{{ roomPlan.description }}</div>
      <div class="creator">Room plan by {{ roomPlan.owner.fullName }}</div>
    </div>
    <button class="action-menu" :id="`roomPlan-${roomPlan.id}-action-menu`">
      <stream-line-icon :icon="Menu.NavigationMenuHorizontal" :size="20" />
    </button>
    <ActionMenuPopover
      :target="`roomPlan-${roomPlan.id}-action-menu`"
      @editTrigger="gotoRoomPlanPage"
      @deleteTrigger="showDeleteRoomPlanConfirmModal = true"
    />
    <DeleteResourceConfirmModal
      :show="showDeleteRoomPlanConfirmModal"
      resourceType="Floor Plan"
      @close="showDeleteRoomPlanConfirmModal = false"
      @ok="handleDeleteRoomPlan"
    />
  </div>
</template>
<script>
import api from '@/api'
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import MapsDimensions from '@streamlinehq/streamline-regular/lib/real-estate/MapsDimensions'
import Menu from '@streamlinehq/streamline-regular/lib/interface-essential/Menu'
import ActionMenuPopover from './popovers/ActionMenuPopover'
import DeleteResourceConfirmModal from '@/components/views/modals/DeleteResourceConfirmModal'
export default {
  components: {
    StreamLineIcon,
    ActionMenuPopover,
    DeleteResourceConfirmModal
  },
  props: {
    roomPlan: {
      required: true
    }
  },
  data () {
    return {
      MapsDimensions,
      Menu,
      showDeleteRoomPlanConfirmModal: false
    }
  },
  methods: {
    gotoRoomPlanPage () {
      this.$emit('click')
    },
    refresh () {
      this.$emit('refresh')
    },
    async handleDeleteRoomPlan () {
      try {
        await api.roomPlans.deleteRoomPlan(this.roomPlan.id)
        this.$toasted.success('Floor Plan has been removed')
        this.refresh()
      } catch (error) {
        this.$toasted.error('Floor Plan has not been removed')
      }
    }
  }
}
</script>
