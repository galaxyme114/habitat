<template>
  <validation-observer ref="createHabitat" tag="form" v-slot="{ invalid }">
    <b-modal id="new-habitat-modal" :visible="show" @hidden="hideModal">
      <template #modal-header="{ close }">
        <!-- Emulate built in modal header close button action -->
        <div id="close-button" class="pointer" @click="close()">
          <stream-line-icon :icon="FormValidation.Close" :stroke="iconColour" :size="16" />
        </div>
        <div id="title">Project Settings</div>
      </template>
      <template #default>
        <PSTextValidate id="name" label="Project Name" placeholder="Your Habitats Name" v-model="projectPlaceholder.name" />
        <PSTextArea
          id="description"
          label="Project Description"
          v-model="projectPlaceholder.description"
          placeholder="Enter a description for your project."
          :optional="true"
        />
        <div class="followed-project-tags">
          <div class="tag-pill" v-for="(tag, i) in projectPlaceholder.tags" :key="`followed-project-tag-${i}`">
            <span class="mr-1"># </span>{{ tag }}
            <div class="pointer" @click="removeTag(tag)">
              <stream-line-icon :icon="FormValidation.Close" :stroke="iconColour" :size="10" />
            </div>
          </div>
        </div>
        <input id="tag-input" placeholder="#Add Project Tags" v-on:keyup.enter="addTag()" v-model="newTag" />
        <label class="ml-2">Make Project Public?</label>
        <div class="d-flex justify-content-center">
          <span :style="{marginRight: '10px', color: '#2a5a57'}">No</span
          ><b-form-checkbox
            v-model="projectPlaceholder.isPublic"
            switch
            size="lg"
            label="Public Project"
            >Yes</b-form-checkbox
          >
        </div>
      </template>
      <template #modal-footer>
        <button class="btn btn-rounded btn-primary" :disabled="invalid || !changed" @click="saveProjectSettings">
          Save
        </button>
      </template>
    </b-modal>
  </validation-observer>
</template>
<script>
import api from '@/api'
import { mapState } from 'vuex'
import { BModal, BFormCheckbox } from 'bootstrap-vue'
import { ValidationObserver } from 'vee-validate'
import PSTextValidate from '@/components/form/PSTextValidate'
import PSTextArea from '@/components/form/PSTextArea'
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import FormValidation from '@streamlinehq/streamline-regular/lib/interface-essential/FormValidation'
import Settings from '@streamlinehq/streamline-regular/lib/interface-essential/Settings'

export default {
  name: 'ProjectSettingsModal',
  props: ['show', 'project'],
  components: {
    BModal,
    ValidationObserver,
    PSTextValidate,
    PSTextArea,
    BFormCheckbox,
    // PSInput,
    StreamLineIcon
    // VueGoogleAutocomplete
  },
  data () {
    return {
      FormValidation,
      Settings,
      showSettings: false,
      invitee: '',
      invitees: [],
      newTag: '',
      changed: false,
      projectPlaceholder: {
        id: this.project.id,
        name: this.project.name,
        description: this.project.description,
        tags: this.project.tags,
        isPublic: this.project.isPublic
      },
      opposite: !this.project.isPublic
    }
  },
  computed: {
    ...mapState({
      iconColour: (state) => {
        if (state.auth.user === null || state.auth.user.theme === 'light') {
          return '#1E212B'
        }

        return 'ffffff'
      },
      user: (state) => state.auth.user
    })
  },
  watch: {
    projectPlaceholder: {
      deep: true,
      handler: function () {
        this.changed = true
      }
    }
  },
  methods: {
    hideModal () {
      this.$emit('closeModal')
    },
    async saveProjectSettings () {
      await api.projects.update(this.projectPlaceholder)
      this.$emit('projectSaved')
      this.hideModal()
    },
    addTag () {
      this.project.tags.push(this.newTag)
      this.newTag = ''
    },
    removeTag (tag) {
      this.project.tags.splice(tag, 1)
    }
  }
}
</script>
