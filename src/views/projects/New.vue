<template>
  <div id="new-project">
    <div class="left" :style="{ display: !featureImage ? 'flex' : 'block' }">
      <div v-if="!featureImage" id="no-images" class="no-images" @click="handleAddImage">
        <p>Add your first image</p>
      </div>
      <div v-else id="feature-image-container">
        <img :src="featureImage.url" class="feature-image" />
        <div id="close-button" class="pointer" @click="removeImage">
          <stream-line-icon :icon="FormValidation.Close" stroke="white" :size="12" />
        </div>
        <div id="tag-row" class="tag-row" :style="{ bottom: rowHeight }">
          <div v-for="(tag, i) of featureImage.tags" :key="`tag-${i}`" class="feature-tag">
            <span class="icon"><stream-line-icon :icon="Rating.RatingStar1" :size="14" stroke="#D18C08"/></span>
            {{ tag }}
          </div>
          <span class="divider" />
          <span id="add-tag" @click="handleAddTag" class="add-tag pointer">
            <stream-line-icon :icon="RemoveAdd.Add" stroke="white" :size="12" />
          </span>
          <div v-for="(tag, i) of chosenTags" :key="`select-tag-${i}`" class="image-tag">
            {{ tag }}
          </div>
        </div>
      </div>
    </div>
    <validation-observer class="right" ref="observer" tag="form" v-slot="{ invalid }" @submit.prevent="createProject">
      <div>
        <p>Let’s get started and bring your project to life.</p>
        <p class="pb-2">Don’t worry, you can edit this later, too.</p>
        <PSTextValidate
          id="name"
          label="Project Name"
          placeholder="Your Projects Name"
          v-model="project.name"
          class="pb-2"
        />
        <PSTextArea
          id="description"
          label="Project Description"
          v-model="project.description"
          placeholder="Enter a description for your project."
          :optional="true"
          class="pb-2"
        />
        <div class="d-flex justify-content-between pb-2" :style="{ borderBottom: '1px solid #D5D8E2' }">
          <label class="ml-2" for="public-switch">Hide from public feeds</label
          ><b-form-checkbox id="public-switch" v-model="publicFlag" switch size="xl" />
        </div>
        <PSSelectValidate
          @change="selectOption"
          :options="habitatOptions"
          footerButtonLabel="Create a new Habitat"
          :value="selectedHabitat"
        />
      </div>
      <div id="create-footer">
        <div class="footer-content">
          <PSButtonLoader class="btn-primary" text="Create Project" :disabled="invalid" :loading="loading" />
        </div>
      </div>
    </validation-observer>
    <b-modal v-model="showAddImageModal" title="Upload Images" ok-only ok-title="Done">
      <dropzone
        id="dropzone"
        :url="url"
        accepted-file-types="image/*"
        :header="headers"
        @success="handleUploadedImage"
        :maxNumberOfFiles="1"
      />
    </b-modal>
    <b-popover placement="bottom" :show="showAddTagPopover" :key="render" :target="targetId" id="tag-popover">
      <b-form-checkbox-group stacked v-model="chosenTags">
        <b-form-checkbox v-for="(tag, i) in tags" :key="`tag-option-${i}`" class="p-default p-round" :value="tag">{{
          tag
        }}</b-form-checkbox>
      </b-form-checkbox-group>
    </b-popover>
  </div>
</template>
<script>
import api from '@/api'
import { mapState } from 'vuex'
import PSTextValidate from '@/components/form/PSTextValidate'
import PSTextArea from '@/components/form/PSTextArea'
import PSButtonLoader from '@/components/form/PSButtonLoader'
import PSSelectValidate from '@/components/form/PSSelectValidate'
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import FormValidation from '@streamlinehq/streamline-regular/lib/interface-essential/FormValidation'
import Folders from '@streamlinehq/streamline-regular/lib/files-folders/Folders'
import Rating from '@streamlinehq/streamline-regular/lib/social-medias-rewards-rating/Rating'
import RemoveAdd from '@streamlinehq/streamline-regular/lib/interface-essential/RemoveAdd'
import { BFormCheckbox, BFormCheckboxGroup, BModal, BPopover } from 'bootstrap-vue'
import { ValidationObserver } from 'vee-validate'
import Dropzone from '../../components/form/DropZone'

export default {
  components: {
    PSTextValidate,
    PSTextArea,
    PSButtonLoader,
    PSSelectValidate,
    BFormCheckbox,
    StreamLineIcon,
    BModal,
    Dropzone,
    BPopover,
    BFormCheckboxGroup,
    ValidationObserver
  },
  data () {
    return {
      FormValidation,
      Folders,
      Rating,
      RemoveAdd,
      project: {
        name: '',
        description: ''
      },
      publicFlag: true,
      habitatOptions: [
        {
          value: null,
          image: '',
          text: ''
        }
      ],
      selectedHabitat: {
        value: null,
        image: '',
        text: ''
      },
      showAddImageModal: false,
      showAddTagPopover: false,
      url: process.env.VUE_APP_API_URL + '/v1/media/dropzone/new-project',
      render: '',
      loading: false,
      targetId: '',
      rowHeight: '56px',
      tags: ['lighting', 'flooring', 'appliances', 'wall-coverings', 'misc', 'other', 'furniture', 'colours'],
      chosenTags: [],
      featureImage: null
    }
  },
  computed: {
    ...mapState({
      habitats: state => state.habitats.habitats,
      user: state => state.auth.user,
      iconColour: state => {
        if (state.auth.user === null || state.auth.user.theme === 'light') {
          return '#000000'
        }

        return '#ffffff'
      },
      headers: state => {
        return { Authorization: 'Bearer ' + state.auth.tokens.access.token }
      }
    })
  },
  watch: {
    chosenTags () {
      setTimeout(() => {
        this.rowHeight = document.getElementById('tag-row').clientHeight + 'px'
      }, 100)
    }
  },
  methods: {
    handleAddImage () {
      this.showAddImageModal = !this.showAddImageModal
    },
    handleAddTag () {
      this.render = 're-render'
      this.targetId = 'add-tag'
      this.showAddTagPopover = !this.showAddTagPopover
    },
    handleUploadedImage (value) {
      this.featureImage = value
      this.featureImage.tags.push('featured')
      this.showAddImageModal = false
    },
    selectOption (value) {
      this.selectedHabitat = value
    },
    async createProject () {
      this.loading = true

      const payload = {
        ...this.project,
        isPublic: this.publicFlag,
        habitat: this.selectedHabitat.value
      }

      try {
        const project = await api.projects.create(payload)
        if (this.featureImage) {
          await api.media.addTagToImage(this.featureImage.id, this.chosenTags)
          await api.moodBoard.addImage(this.featureImage.id, project.moodboard)
        }
        this.$toasted.success('Project created')
        this.$router.push({
          name: 'project-view',
          params: { habitatId: this.selectedHabitat.value, projectId: project.id }
        })
        // this.$router.push({ name: 'explore', params: { description: 'Find inspiration for new project' } })
      } catch (error) {
        this.$toasted.error('Project not created')
      }
      this.loading = false
    },
    removeImage () {
      this.featureImage = null
      this.chosenTags = []
    }
  },
  mounted () {
    this.habitats.forEach(habitat => {
      this.habitatOptions.push({
        value: habitat.id,
        text: habitat.name,
        image: habitat.moodboard.images.length ? habitat.moodboard.images[0].url : ''
      })
    })
  }
}
</script>
