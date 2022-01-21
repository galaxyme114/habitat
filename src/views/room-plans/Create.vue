<template>
  <div class="container max-lg">
    <h2>Create a new room plan</h2>
    <validation-observer ref="loginForm" tag="form" v-slot="{ invalid }" @submit.prevent="submit" class="w-50">
      <fieldset>
        <PSTextValidate id="name" label="" v-model="roomPlan.name" placeholder="Kitchen" class="mb-3"/>
        <PSTextArea id="description" label="" v-model="roomPlan.description" placeholder="Description" class="mb-3"/>
        <PSSelectValidate
          @change="selectOption"
          :options="projectOptions"
          footerButtonLabel="Create a new Project"
          :value="selectedProject"
          class="mb-3"
          variant="project"
        />
        <div class="form-group mb-3">
          <button type="submit" class="btn btn-rounded btn-primary" :disabled="invalid">Get started</button>
        </div>
      </fieldset>
    </validation-observer>
  </div>
</template>
<script>

import PSTextValidate from '@/components/form/PSTextValidate'
import PSTextArea from '@/components/form/PSTextArea'
import PSSelectValidate from '@/components/form/PSSelectValidate'
import { mapState } from 'vuex'
import { ValidationObserver } from 'vee-validate'
import api from '@/api'

export default {
  components: {
    ValidationObserver,
    PSTextValidate,
    PSTextArea,
    PSSelectValidate
  },
  data () {
    return {
      roomPlan: {
        name: null,
        description: null
      },
      selectedProject: {
        value: null,
        image: '',
        text: ''
      },
      projectOptions: [
        {
          value: null,
          image: '',
          text: ''
        }
      ]
    }
  },
  computed: {
    ...mapState({
      habitats: (state) => state.habitats.habitats
    })
  },
  methods: {
    selectOption (value) {
      this.selectedProject = value
    },
    async submit () {
      try {
        const roomPlan = await api.roomPlans.create(this.roomPlan, this.selectedProject.value)
        this.$toasted.success('Room plan created')
        this.roomPlan.name = null
        this.roomPlan.description = null
        this.$router.push({
          name: 'room-plans-edit',
          params: { habitatId: this.selectedProject.habitat, projectId: this.selectedProject.value, roomPlanId: roomPlan.id }
        })
      } catch (e) {
        this.$toasted.error('Room plan not created, please try again')
        console.error(e)
      }
    }
  },
  watch: {
    habitats (newVal) {
      this.projectOptions = []
      newVal.forEach((habitat) => {
        habitat.projects.forEach((project) => {
          this.projectOptions.push({
            value: project.id,
            habitat: project.habitat.id,
            text: project.name,
            image: project.moodboard.images.length ? project.moodboard.images[0].url : ''
          })
        })
      })
    }
  },
  mounted () {
    this.habitats.forEach((habitat) => {
      habitat.projects.forEach((project) => {
        this.projectOptions.push({
          value: project.id,
          habitat: project.habitat,
          text: project.name,
          image: project.moodboard.images.length ? project.moodboard.images[0].url : ''
        })
      })
    })
  }
}
</script>
