<template>
  <b-modal id="add-image-modal" v-model="showModal" size="xl" hide-footer>
    <template #modal-header>
      <!-- Emulate built in modal header close button action -->
      <div id="close-button" class="pointer" @click="close()">
        <stream-line-icon :icon="FormValidation.Close" stroke="white" :size="16" />
      </div>
    </template>
    <template #default="{}">
      <img id="left-image" :src="selectedImage.src" />
      <div id="right">
        <!-- <v-select
          :options="options"
          label="text"
          v-model="selectedOption"
          :clearable="false"
          @option:selected="handleImageSelect"
        >
          <template v-slot:option="option">
            <div v-if="!option.value"></div>
            <div v-else-if="option.type === 'project'" class="select-option">
              <img v-if="option.image" :src="option.image" />
              <span v-else :style="{ backgroundColor: '#F8F8F8', padding: '10px', borderRadius: '8px', marginRight: '10px' }"
                ><stream-line-icon :icon="Pictures.PictureLandscape" :size="20"
              /></span>
              <div class="d-flex flex-column habitat-option">
                <div class="title">{{ option.text }}</div>
                <div class="details">
                  {{ option.habitat }}
                </div>
              </div>
            </div>
            <div v-else-if="option.type === 'habitat'" class="select-option">
              <img v-if="option.image" :src="option.image" />
              <span v-else :style="{ backgroundColor: '#F8F8F8', padding: '10px', borderRadius: '8px', marginRight: '10px' }"
                ><stream-line-icon :icon="Pictures.PictureLandscape" :size="20"
              /></span>
              <div class="d-flex flex-column habitat-option">
                <div class="title">{{ option.text }}</div>
                <div class="details">
                  Habitat<span class="habitat-details">{{
                    `&#183; ${option.members} Members &#183; ${option.projects} Projects`
                  }}</span>
                </div>
              </div>
            </div>
          </template>
          <template v-slot:selected-option="option">
            <div v-if="!option.value">
              <div class="select-option default-option">
                <span :style="{ backgroundColor: '#F8F8F8', padding: '10px', borderRadius: '8px', marginRight: '10px' }"
                  ><stream-line-icon :icon="ConceptionProjects.ProjectNotesBuildings" :size="20"
                /></span>
                <div class="option-text">
                  <div class="option-title">Add to a Project or Habitat</div>
                  <div class="option-description">Curate Images, Articles & Room plans into one space.</div>
                </div>
              </div>
            </div>
            <div v-else-if="option.type === 'project'" class="select-option">
              <img v-if="option.image" :src="option.image" />
              <span v-else :style="{ backgroundColor: '#F8F8F8', padding: '10px', borderRadius: '8px', marginRight: '10px' }"
                ><stream-line-icon :icon="Pictures.PictureLandscape" :size="20"
              /></span>
              {{ option.text }}
            </div>
            <div v-else-if="option.type === 'habitat'" class="select-option">
              <img v-if="option.image" :src="option.image" />
              <span v-else :style="{ backgroundColor: '#F8F8F8', padding: '10px', borderRadius: '8px', marginRight: '10px' }"
                ><stream-line-icon :icon="Pictures.PictureLandscape" :size="20"
              /></span>
              <div class="d-flex flex-column habitat-option">
                <div class="title">{{ option.text }}</div>
                <div class="details">
                  Habitat<span class="habitat-details">{{
                    `&#183; ${option.members} Members &#183; ${option.projects} Projects`
                  }}</span>
                </div>
              </div>
            </div>
          </template>
          <template #list-footer>
            <div id="list-footer" class="pointer">Create a new Habitat</div>
          </template>
        </v-select> -->
        <div id="select">
          <div v-if="!showSelectDropdown">
            <div @click="openSelectDropdown()" class="select-option default-option">
              <div class="default-description">
                <span :style="{ backgroundColor: '#F8F8F8', padding: '10px', borderRadius: '8px', marginRight: '10px' }">
                  <stream-line-icon :icon="ConceptionProjects.ProjectNotesBuildings" :size="20"/>
                </span>
                <div class="option-text">
                  <div class="option-title">Add to a Project or Habitat</div>
                  <div class="option-description">Curate Images, Articles & Room plans into one space.</div>
                </div>
              </div>
              <div class="select-action">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" role="presentation" class="vs__open-indicator">
                  <path d="M9.211364 7.59931l4.48338-4.867229c.407008-.441854.407008-1.158247 0-1.60046l-.73712-.80023c-.407008-.441854-1.066904-.441854-1.474243 0L7 5.198617 2.51662.33139c-.407008-.441853-1.066904-.441853-1.474243 0l-.737121.80023c-.407008.441854-.407008 1.158248 0 1.600461l4.48338 4.867228L7 10l2.211364-2.40069z"></path>
                </svg>
              </div>
            </div>
          </div>
          <div v-else-if="selectedOption.type === 'project'" @click="openSelectDropdown()" class="select-option default-option">
            <div class="default-description">
              <img v-if="selectedOption.image" :src="selectedOption.image" />
              <span v-else :style="{ backgroundColor: '#F8F8F8', padding: '10px', borderRadius: '8px', marginRight: '10px' }"
                ><stream-line-icon :icon="Pictures.PictureLandscape" :size="20"
              /></span>
              <div class="d-flex flex-column habitat-option">
                <div class="title">{{ selectedOption.name }}</div>
              </div>
            </div>
            <div class="select-action">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" role="presentation" class="vs__open-indicator">
                <path d="M9.211364 7.59931l4.48338-4.867229c.407008-.441854.407008-1.158247 0-1.60046l-.73712-.80023c-.407008-.441854-1.066904-.441854-1.474243 0L7 5.198617 2.51662.33139c-.407008-.441853-1.066904-.441853-1.474243 0l-.737121.80023c-.407008.441854-.407008 1.158248 0 1.600461l4.48338 4.867228L7 10l2.211364-2.40069z"></path>
              </svg>
            </div>
          </div>
          <div v-else-if="selectedOption.type === 'habitat'" @click="openSelectDropdown()" class="select-option default-option">
            <div class="default-description">
              <img v-if="selectedOption.image" :src="selectedOption.image" />
              <span v-else :style="{ backgroundColor: '#F8F8F8', padding: '10px', borderRadius: '8px', marginRight: '10px' }"
                ><stream-line-icon :icon="Pictures.PictureLandscape" :size="20"
              /></span>
              <div class="d-flex flex-column habitat-option">
                <div class="title">{{ selectedOption.name }}</div>
                <div class="details">
                  <span class="habitat-details">{{ selectedOption.text }}</span>
                </div>
              </div>
            </div>
            <div class="select-action">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" role="presentation" class="vs__open-indicator">
                <path d="M9.211364 7.59931l4.48338-4.867229c.407008-.441854.407008-1.158247 0-1.60046l-.73712-.80023c-.407008-.441854-1.066904-.441854-1.474243 0L7 5.198617 2.51662.33139c-.407008-.441853-1.066904-.441853-1.474243 0l-.737121.80023c-.407008.441854-.407008 1.158248 0 1.600461l4.48338 4.867228L7 10l2.211364-2.40069z"></path>
              </svg>
            </div>
          </div>

          <div class="select-dropdown d-none" id="selectDropdown">
            <vsa-list>
              <vsa-item v-for="(habitat, i) in habitats" :key="`habitat-${i}`">
                <vsa-heading>
                  <label class="habitat" @click="handleImageSelect({value: habitat.moodboard.id, type: 'habitat', name: habitat.name, detail: habitat})">
                    <img v-if="habitat.moodboard.images.length" :src="habitat.moodboard.images[0].url" />
                    <span v-else :style="{ backgroundColor: '#F8F8F8', padding: '10px', borderRadius: '8px', marginRight: '10px' }"
                      ><stream-line-icon :icon="Pictures.PictureLandscape" :size="20"
                    /></span>
                    <div class="d-flex flex-column habitat-info">
                      <div class="title">{{ habitat.name }}</div>
                      <div class="details">
                        <span class="habitat-details">
                          {{`${habitat.owners.length + habitat.users.length} Members &#183; ${habitat.projects.length} Projects`}}
                        </span>
                      </div>
                    </div>
                  </label>
                </vsa-heading>
                <vsa-icon v-if="habitat.projects.length">
                  <span class="open"><stream-line-icon :icon="Arrows.ArrowRight1" stroke="#2A5A57" :size="12" /></span>
                  <span class="close"><stream-line-icon :icon="Arrows.ArrowDown1" stroke="#2A5A57" :size="12" /></span>
                </vsa-icon>
                <vsa-icon v-else>
                  <span class="open"></span>
                  <span class="close"></span>
                </vsa-icon>
                <vsa-content v-if="habitat.projects.length">
                  <div v-for="(project, i) in habitat.projects" :key="`project-${i}`">
                    <label class="project d-flex align-items-center" @click="handleImageSelect({value: project.moodboard.id, type: 'project', name: project.name, detail: project})">
                      <img v-if="project.moodboard.images.length" :src="project.moodboard.images[0].url" />
                      <span v-else :style="{ backgroundColor: '#F8F8F8', padding: '10px', borderRadius: '8px', marginRight: '10px' }"
                        ><stream-line-icon :icon="Pictures.PictureLandscape" :size="20"
                      /></span>
                      <div class="project-info">
                        <div class="title">{{ project.name }}</div>
                      </div>
                    </label>
                  </div>
                </vsa-content>
              </vsa-item>
            </vsa-list>
            <div class="dropdown-footer">
              <div @click="handleNewProject()" class="create-habitat">Create a new Project</div>
            </div>
          </div>
        </div>
        <div class="image-link">
          <span><stream-line-icon :icon="LinkUnlink.Hyperlink2" stroke="#f26b6b" :size="12"/></span>
          <a :href="selectedImage.link" class="ml-1">{{ selectedImage.displayLink }}</a>
        </div>
        <h3>{{ selectedImage.title }}</h3>
        <p>Similar Images</p>
        <stack monitor-images-loaded :column-min-width="200" :gutter-width="8" :gutter-height="8">
          <stack-item v-for="(image, i) in images" :key="`similar-image-${i}`" class="fade-in">
            <div class="card radius">
              <img :src="image.src" class="card-img-top radius-top pointer" @click="selectImage(image)" />
              <div class="card-body">
                <h6>{{ image.title }}</h6>
                <div>
                  <span><stream-line-icon :icon="LinkUnlink.Hyperlink2" stroke="#f26b6b" :size="12"/></span>
                  <a :href="image.link" class="ml-1">{{ image.displayLink }}</a>
                </div>
              </div>
            </div>
          </stack-item>
        </stack>
      </div>
    </template>
  </b-modal>
</template>
<script>
import api from '@/api'
import { mapState } from 'vuex'
import { BModal } from 'bootstrap-vue'
import Arrows from '@streamlinehq/streamline-regular/lib/arrows-diagrams/Arrows'
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import LinkUnlink from '@streamlinehq/streamline-regular/lib/interface-essential/LinkUnlink'
import FormValidation from '@streamlinehq/streamline-regular/lib/interface-essential/FormValidation'
import ConceptionProjects from '@streamlinehq/streamline-regular/lib/building-construction/ConceptionProjects'
import Pictures from '@streamlinehq/streamline-regular/lib/images-photography/Pictures'
// import vSelect from 'vue-select'
import { Stack, StackItem } from 'vue-stack-grid'
// import 'vue-select/dist/vue-select.css'
import { VsaList, VsaItem, VsaHeading, VsaContent, VsaIcon } from 'vue-simple-accordion'
import 'vue-simple-accordion/dist/vue-simple-accordion.css'

export default {
  name: 'AddImageModal',
  props: ['show', 'habitats', 'selectedImage', 'images'],
  components: {
    BModal,
    StreamLineIcon,
    // vSelect,
    Stack,
    StackItem,
    VsaList,
    VsaItem,
    VsaHeading,
    VsaContent,
    VsaIcon
  },
  data () {
    return {
      LinkUnlink,
      Pictures,
      FormValidation,
      ConceptionProjects,
      Arrows,
      showSelectDropdown: false,
      selectedOption: {
        value: null,
        type: '',
        name: '',
        image: '',
        text: ''
      }
    }
  },
  computed: {
    showModal: {
      get: function () {
        return this.show
      }
      // set: function (newVal) {
      //   return newVal
      // }
    },
    ...mapState({
      user: state => state.auth.user
    })
  },
  methods: {
    selectImage (image) {
      this.$emit('selectImage', image)
    },
    close () {
      this.$emit('close')
    },
    openSelectDropdown () {
      this.showSelectDropdown = false
      if (!document.querySelector('#selectDropdown').classList.contains('d-none') && this.selectedOption.value) {
        this.showSelectDropdown = true
      }
      document.querySelector('#selectDropdown').classList.toggle('d-none')
      document.querySelector('.default-option').classList.toggle('open')
    },
    handleNewProject () {
      this.$router.push({ name: 'project-new' })
    },
    async handleImageSelect (option) {
      try {
        document.querySelector('#selectDropdown').classList.add('d-none')
        document.querySelector('.default-option').classList.remove('open')

        this.selectedOption = {
          value: option.value,
          name: option.name,
          image: this.selectedImage.src,
          type: option.type
        }
        if (option.type === 'habitat') {
          this.selectedOption.text = `${option.detail.owners.length + option.detail.users.length} Members &#183; ${option.detail.projects.length} Projects`
        }

        this.showSelectDropdown = true

        const response = await api.media.uploadImage(this.selectedImage.src,
          this.selectedImage.layout, this.user.id)
        await api.moodBoard.addImage(response.data.id, option.value)
        this.$toasted.success(`Image added to ${option.type === 'project' ? 'Project' : 'Habitat'}`)
        this.$emit('refresh')
      } catch (e) {
        this.$toasted.error('Image not added')
      }
    }
  },
  mounted () {
    this.$root.$on('bv::modal::hidden', () => {
      this.$emit('close')
    })
  }
}
</script>
