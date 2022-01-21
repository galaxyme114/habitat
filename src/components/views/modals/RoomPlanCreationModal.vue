<template>
  <b-modal
    ref="roomPlanModal"
    size="md"
    v-model="showModal"
    title="Create a new Room Plan"
    ok-title="Create"
    @ok="handleCreateRoomPlan"
    ok-only
    id="add-room-plan-modal"
    @hide="close"
  >
    <div class="form-group">
      <label for="room-plan-input">Name</label>
      <b-form-input id="room-plan-input" placeholder="Name" v-model="roomPlan.name" />
    </div>
    <div class="form-group">
      <label for="room-plan-description">Description</label>
      <b-form-textarea id="room-plan-description" placeholder="Description" v-model="roomPlan.description" />
    </div>
  </b-modal>
</template>
<script>
import api from '@/api'
import { mapState } from 'vuex'
import { BModal, BFormTextarea, BFormInput } from 'bootstrap-vue'

export default {
  props: ['show', 'selectedProject', 'habitat'],
  components: {
    BFormInput,
    BFormTextarea,
    BModal
  },
  data () {
    return {
      roomPlan: {
        name: null,
        description: null
      }
    }
  },
  computed: {
    ...mapState({
      iconColour: (state) => {
        if (state.auth.user === null || state.auth.user.theme === 'light') {
          return '#000000'
        }
        return '#ffffff'
      }
    }),
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
    close () {
      this.roomPlan.name = null
      this.roomPlan.description = null
      this.$emit('close')
    },
    async handleCreateRoomPlan (e) {
      e.preventDefault()
      try {
        const roomPlan = await api.roomPlans.create(this.roomPlan, this.selectedProject)
        this.$toasted.success('Room plan created')
        this.$refs.roomPlanModal.hide()
        this.roomPlan.name = null
        this.roomPlan.description = null
        this.$router.push({
          name: 'room-plans-edit',
          params: { habitatId: this.habitat, projectId: this.selectedProject, roomPlanId: roomPlan.id }
        })
      } catch (e) {
        this.$toasted.error('Room plan not created, please try again')
        console.error(e)
      }
    }
  }
}
</script>
