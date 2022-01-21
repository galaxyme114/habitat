<template>
  <div id="explore" class="entry" :style="{ height: dynamicHeight }">
    <div class="container-fluid">
      <div id="header-box" class="justify-content-center">
        <h3 id="title" class="mb-1">Looking for some <strong>inspiration?</strong></h3>
        <p id="description" class="text-center">{{ description }}</p>
        <div class="input-wrap shadow">
          <span class="mr-2">
            <stream-line-icon :icon="Search.SearchBar" :stroke="iconColour" />
          </span>
          <input class="input  pl-2" placeholder="Search" v-model="terms" v-on:keyup.enter="onEnter" />
        </div>
      </div>
      <div :style="{ height: '50px', width: '50px', margin: '10px 0px 10px -25px', position: 'absolute', left: '50%' }">
        <loader :loading="loading" colour="#f26b6b" />
      </div>

      <div>
        <b-card-group columns monitor-images-loaded id="infinite-scroll" class="idk">
          <div v-for="(image, i) in images" :key="i" class="fade-in card card-explore radius ">
            <div v-on:click="handleSelect(image, `scroll-image-${i}`)">
              <stream-line-icon
                :id="`scroll-image-${i}`"
                :icon="TagsBookmarks.TagsAdd"
                :stroke="show === `scroll-image-${i}` ? 'black' : 'white'"
                class="icon-add"
                :class="{ bigger: show === `scroll-image-${i}` }"
                :size="20"
              />
            </div>
            <img :src="image.src" class="card-img-top radius-top pointer" @click="handleImageModal(image)" />
            <div class="card-body">
              <h6>{{ image.title }}</h6>
              <div>
                <span> <b-icon icon="link-45deg"></b-icon></span>
                <a :href="image.link">{{ image.displayLink }}</a>
              </div>
            </div>
          </div>

          <!-- <b-card
            title="Card title that wraps to a new line"
            img-src="https://placekitten.com/g/400/450"
            img-alt="Image"
            img-top
          >
            <b-card-text>
              This is a wider card with supporting text below as a natural lead-in to additional content. This content is a
              little bit longer.
            </b-card-text>
          </b-card>

          <b-card header="Quote">
            <blockquote class="blockquote mb-0">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
              <footer class="blockquote-footer">Someone famous in <cite title="Source Title">Source Title</cite></footer>
            </blockquote>
          </b-card>

          <b-card title="Title" img-src="https://placekitten.com/500/350" img-alt="Image" img-top>
            <b-card-text>
              This card has supporting text below as a natural lead-in to additional content.
            </b-card-text>
            <b-card-text class="small text-muted">Last updated 3 mins ago</b-card-text>
          </b-card>

          <b-card bg-variant="primary" text-variant="white">
            <blockquote class="card-blockquote">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
              <footer>
                <small>Someone famous in <cite title="Source Title">Source Title</cite></small>
              </footer>
            </blockquote>
          </b-card>

          <b-card>
            <b-card-title>Title</b-card-title>
            <b-card-text>
              This card has supporting text below as a natural lead-in to additional content.
            </b-card-text>
            <b-card-text class="small text-muted">Last updated 3 mins ago</b-card-text>
          </b-card>

          <b-card img-src="https://picsum.photos/400/400/?image=41" img-alt="Image" overlay></b-card>

          <b-card img-src="https://picsum.photos/400/200/?image=41" img-alt="Image" img-top>
            <b-card-text>
              This is a wider card with supporting text below as a natural lead-in to additional content. This card has even
              longer content than the first.
            </b-card-text>
            <template #footer>
              <small class="text-muted">Footer Text</small>
            </template>
          </b-card> -->
        </b-card-group>
      </div>

      <!-- <div class="px-0 w-100">
        <stack
          monitor-images-loaded
          :column-min-width="320"
          :gutter-width="8"
          :gutter-height="8"
          id="infinite-scroll"
          class="idk"
        >
          <stack-item v-for="(image, i) in images" :key="i" class="fade-in">
            <div class="card radius">
              <div v-on:click="handleSelect(image, `scroll-image-${i}`)">
                <stream-line-icon
                  :id="`scroll-image-${i}`"
                  :icon="TagsBookmarks.TagsAdd"
                  :stroke="show === `scroll-image-${i}` ? 'black' : 'white'"
                  class="icon-add"
                  :class="{ bigger: show === `scroll-image-${i}` }"
                  :size="20"
                />
              </div>
              <img :src="image.src" class="card-img-top radius-top pointer" @click="handleImageModal(image)" />
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
      </div> -->
    </div>

    <!--
    <div class="d-block d-sm-none container px-0 px-md-2 w-100">
      <stack
        monitor-images-loaded
        :column-min-width="160"
        :gutter-width="16"
        :gutter-height="16"
        id="infinite-scroll"
        class="idk"
      >
        <stack-item v-for="(image, i) in images" :key="i" class="fade-in">
          <div class="card radius">
            <div v-on:click="handleSelect(image, `mobile-scroll-image-${i}`)">
              <stream-line-icon
                :id="`mobile-scroll-image-${i}`"
                :icon="TagsBookmarks.TagsAdd"
                :stroke="show === `mobile-scroll-image-${i}` ? 'black' : 'white'"
                class="icon-add"
                :class="{ bigger: show === `mobile-scroll-image-${i}` }"
                :size="20"
              />
            </div>
            <img :src="image.src" class="card-img-top radius-top pointer" @click="handleImageModal(image)" />
            <div class="card-body">
              <h6>{{ image.title }}</h6>
              <div>
                <a :href="image.link" class="card-img-link">{{ image.displayLink }}</a>
              </div>
            </div>
          </div>
        </stack-item>
      </stack>
    </div>
    -->

    <b-popover id="explore-popover" :key="targetId" :target="targetId" :placement="'bottom'" :show="popoverShow">
      <!-- <b-form-checkbox
        v-model="selectedHabitat"
        :value="habitat.value"
        v-for="(habitat, i) in habitatOptions"
        :key="`checkbox-${i}`"
        class="checkbox-padding"
        :class="{ 'checkbox-active': selectedHabitat.includes(habitat.value) }"
        >{{ habitat.text }}</b-form-checkbox
      > -->
      <vsa-list>
        <vsa-item v-for="(habitat, i) in habitats" :key="`habitat-${i}`">
          <vsa-heading>
            <label class="habitat">
              <input type="checkbox" v-model="toAdd" :value="habitat.moodboard.id" class="d-none" />
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
            <label class="project d-flex align-items-center" v-for="(project, i) in habitat.projects" :key="`project-${i}`">
              <input type="checkbox" v-model="toAdd" :value="project.moodboard.id" class="d-none" />
              <img v-if="project.moodboard.images.length" :src="project.moodboard.images[0].url" />
              <span v-else :style="{ backgroundColor: '#F8F8F8', padding: '10px', borderRadius: '8px', marginRight: '10px' }"
                ><stream-line-icon :icon="Pictures.PictureLandscape" :size="20"
              /></span>
              <div class="project-info">
                <div class="title">{{ project.name }}</div>
              </div>
            </label>
          </vsa-content>
        </vsa-item>
      </vsa-list>
      <div :style="{ height: '1px', background: '#D5D8E2', margin: '10px' }" />
      <div class="btn btn-rounded btn-loader btn-primary alt-button mb-1" @click="handleImageSelect()">Add</div>
      <div @click="handleNewProject()" class="create-habitat">Create a new Project</div>
    </b-popover>
    <validation-observer ref="loginForm" tag="form" v-slot="{ invalid }" class="text-center">
      <b-modal id="habitat-modal" v-model="showModal" title="Create new Habitat">
        <fieldset>
          <PSTextValidate id="name" label="" v-model="newHabitatName" placeholder="Kitchen Renovation" />
        </fieldset>
        <template #modal-footer="{ cancel }">
          <b-button size="sm" variant="primary" @click="handleNewHabitat" :disabled="invalid"> OK </b-button>
          <b-button size="sm" variant="secondary" @click="cancel()"> Cancel </b-button>
        </template>
      </b-modal>
    </validation-observer>
    <AddImageModal
      :show="showImageModal"
      :habitats="habitats"
      :selectedImage="selectedImage"
      :images="images"
      @selectImage="handleChangeImage"
      @close="showImageModal = false"
      @refresh="refresh"
    />
  </div>
</template>
<script>
import api from '@/api'
import { mapState } from 'vuex'
// import { debounce } from 'lodash'
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import Search from '@streamlinehq/streamline-regular/lib/interface-essential/Search'
import LinkUnlink from '@streamlinehq/streamline-regular/lib/interface-essential/LinkUnlink'
import TagsBookmarks from '@streamlinehq/streamline-regular/lib/interface-essential/TagsBookmarks'
import FormValidation from '@streamlinehq/streamline-regular/lib/interface-essential/FormValidation'
import ConceptionProjects from '@streamlinehq/streamline-regular/lib/building-construction/ConceptionProjects'
import Pictures from '@streamlinehq/streamline-regular/lib/images-photography/Pictures'
import Arrows from '@streamlinehq/streamline-regular/lib/arrows-diagrams/Arrows'
// import { Stack, StackItem } from 'vue-stack-grid'
import {
  BPopover,
  // BFormCheckbox,
  BModal,
  BButton,
  BIcon
} from 'bootstrap-vue'

import PSTextValidate from '@/components/form/PSTextValidate'
import { ValidationObserver } from 'vee-validate'
import { ALOADHABITATS } from '@/store/action-types'
import 'vue-select/dist/vue-select.css'
import AddImageModal from './common/AddImageModal.vue'
import { VsaList, VsaItem, VsaHeading, VsaContent, VsaIcon } from 'vue-simple-accordion'
import Loader from '@/components/Loader'
import 'vue-simple-accordion/dist/vue-simple-accordion.css'

export default {
  components: {
    StreamLineIcon,
    // Stack,
    // StackItem,
    BPopover,
    BModal,
    BButton,
    BIcon,
    // BIconLink,
    // BFormCheckbox,
    PSTextValidate,
    AddImageModal,
    ValidationObserver,
    VsaList,
    VsaItem,
    VsaHeading,
    VsaContent,
    VsaIcon,
    Loader
  },
  data () {
    return {
      Search,
      LinkUnlink,
      TagsBookmarks,
      FormValidation,
      ConceptionProjects,
      Pictures,
      Arrows,
      dynamicHeight: '80vh',
      images: [],
      nextIndex: 0,
      terms: '',
      targetId: '',
      popoverShow: false,
      selectedImage: '',
      toAdd: [],
      selectedHabitat: [],
      loading: false,
      show: '',
      showModal: false,
      showImageModal: false,
      newHabitatName: ''
      // projectOptions: [
      //   {
      //     value: null,
      //     image: '',
      //     text: ''
      //   }
      // ]
    }
  },
  computed: {
    ...mapState({
      iconColour: state => {
        if (state.auth.user === null || state.auth.user.theme === 'light') {
          return '#000000'
        }

        return '#ffffff'
      },
      habitats: state => state.habitats.habitats,
      user: state => state.auth.user
    }),
    description: function () {
      if (this.$route.params && this.$route.params.description) {
        return this.$route.params.description
      } else {
        return 'Start your journey here'
      }
    }
  },
  methods: {
    async fetchImages () {
      this.loading = true
      try {
        const response = await api.google.getImages(this.terms, this.nextIndex)
        this.nextIndex = response.data.data.queries.nextPage[0].startIndex
        response.data.data.items.forEach(element => {
          this.images.push({
            src: element.link,
            title: element.title,
            displayLink: element.displayLink,
            link: element.image.contextLink,
            mime: element.mime,
            layout: element.image.height > element.image.width ? 'portrait' : 'landscape'
          })
        })
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    onEnter () {
      this.images = []
      this.fetchImages()
    },
    animateSearch () {
      const element = document.querySelector('#explore')
      element.addEventListener('scroll', () => {
        if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
          this.fetchImages()
        }
        if (element.scrollTop > 40) {
          document.querySelector('#title').classList.add('hidden')
          document.querySelector('#description').classList.add('hidden')
          document.querySelector('.input-wrap').classList.add('move', 'position')
        } else if (element.scrollTop <= 80) {
          document.querySelector('.input-wrap').classList.remove('move')
          setTimeout(() => {
            document.querySelector('#title').classList.remove('hidden')
            document.querySelector('#description').classList.remove('hidden')
            document.querySelector('.input-wrap').classList.remove('position')
          }, [400])
        }
      })
    },
    handleSelect (image, id) {
      // applying class for expanding bullet
      if (this.show === id) {
        this.show = ''
      } else {
        this.show = id
      }

      this.selectedImage = image

      if (this.popoverShow && this.targetId === id) {
        this.popoverShow = false
        this.targetId = ''
      } else {
        this.popoverShow = false
        this.timeout = setTimeout(() => {
          this.targetId = id
          this.popoverShow = true
        }, 500)
      }
    },
    handleImageModal (image) {
      this.selectedImage = image
      this.showImageModal = true
    },
    handleNewProject () {
      this.popoverShow = false
      this.$router.push({ name: 'project-new' })
    },
    async handleImageSelect () {
      for (let i = 0; i < this.toAdd.length; i++) {
        const response = await api.media.uploadImage(this.selectedImage.src, this.selectedImage.layout, this.user.id)
        await api.moodBoard.addImage(response.data.id, this.toAdd[i])
      }

      this.popoverShow = false
      this.toAdd = []
      this.show = ''
    },
    async handleNewHabitat () {
      const habitatResponse = await api.habitats.add({ name: this.newHabitatName, owners: [this.user.id] })
      const imageResponse = await api.media.uploadImage(this.selectedImage.src, this.selectedImage.layout, this.user.id)
      await api.moodBoard.addImage(imageResponse.data.id, habitatResponse.moodBoard)
      await this.$store.dispatch(ALOADHABITATS)
      this.showModal = false
      this.show = ''
    },
    handleChangeImage (image) {
      this.selectedImage = image
    },
    refresh () {
      this.$store.dispatch(ALOADHABITATS)
    }
  },
  // watch: {
  //   habitats (newVal) {
  //     this.projectOptions = [
  //       {
  //         value: null,
  //         image: '',
  //         text: ''
  //       }
  //     ]
  //     newVal.forEach(habitat => {
  //       this.projectOptions.push({
  //         type: 'habitat',
  //         value: habitat.moodboard.id,
  //         text: habitat.name,
  //         image: habitat.moodboard.images.length ? habitat.moodboard.images[0].url : '',
  //         projects: habitat.projects.length,
  //         members: habitat.owners.length + habitat.users.length
  //       })
  //       habitat.projects.forEach(project => {
  //         this.projectOptions.push({
  //           type: 'project',
  //           habitat: project.habitat.name,
  //           value: project.moodboard.id,
  //           text: project.name,
  //           image: project.moodboard.images.length ? project.moodboard.images[0].url : ''
  //         })
  //       })
  //     })
  //   }
  // },
  async mounted () {
    await this.$store.dispatch(ALOADHABITATS)
    this.dynamicHeight = document.body.scrollHeight - 128 + 'px'
    this.animateSearch()
    this.fetchImages()
  }
}
</script>
<style>
#title,
#description {
  opacity: 1;
  transition: opacity 500ms ease;
}
.alt {
  border-radius: 12px;
}
.input {
  border: none;
  border-left: 2px solid #e8e8e9;
}
.input-wrap {
  width: 30%;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  margin: 0 0 20px 0;
}
.input:focus {
  outline: none;
}
.radius {
  border-radius: 16px !important;
}
.radius-top {
  border-top-left-radius: 16px !important;
  border-top-right-radius: 16px !important;
}
.idk {
  overflow: auto;
}
.normal {
  font-weight: normal;
}
.icon-add {
  position: absolute;
  right: 20px;
  top: 20px;
  padding: 5px;
  border-radius: 30px;
  z-index: 99;
  background-color: rgba(30, 33, 43, 0.5);
  width: 34px;
  transition: all 0.5s;
  align-self: center;
}
.icon-add:hover {
  background-color: #a7c7c5;
  cursor: pointer;
}
.bigger {
  width: 220px;
  background-color: white;
}
@media (max-width: 576px) {
  .bigger {
    width: 140px;
  }
}
.fade-in {
  animation: fadeIn ease 0.3s;
  -webkit-animation: fadeIn ease 0.3s;
  -moz-animation: fadeIn ease 0.3s;
  -o-animation: fadeIn ease 0.3s;
  -ms-animation: fadeIn ease 0.3s;
}
.colored {
  background: 'green';
}
.checkbox-padding {
  padding-top: 8px;
  padding-bottom: 5px;
}
.checkbox-active {
  background-color: #e9f4f3;
}
.checkbox-active label {
  font-weight: 700;
}
.create-habitat {
  display: flex;
  justify-content: center;
  padding: 10px;
  border-radius: 12px;
  margin: 0px 10px 0px 10px;
  transition: transform 0.6s cubic-bezier(0.65, 0, 0.35, 1);
  font-weight: 600;
}
.create-habitat:hover {
  cursor: pointer;
  background-color: #f8f8f8;
  text-decoration: underline;
}
.habitat {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 14px;
  font-weight: 700;
}
.habitat img, .project img {
  height: 40px;
  width: 40px;
  border-radius: 8px;
  margin-right: 10px;
}
.habitat .title, .project .title {
  font-size: 14px;
  font-weight: 700;
  margin-left: 4px;
  color: #333;
}
.habitat .habitat-details {
  color: #999999;
  font-size: 12px;
  font-weight: 500;
  margin-left: 4px;
}
.habitat input:checked+img,
.project input:checked+img,
.habitat input:checked+span,
.project input:checked+span {
  box-shadow: 0 0 0 0.2rem rgb(115 168 252 / 60%);
}
.habitat input:checked+img+.habitat-info>.title,
.project input:checked+img+.project-info>.title,
.habitat input:checked+span+.habitat-info>.title,
.project input:checked+span+.project-info>.title {
  color: #5897FB;
}
.habitat input:checked+img+.habitat-info>.details span,
.habitat input:checked+span+.habitat-info>.details span {
  color: #5897FB;
}
.project {
  padding: 5px 0 5px 20px;
  cursor: pointer;
}
.project:hover {
  outline: none;
  background-color: var(--vsa-highlight-color);
  color: var(--vsa-bg-color);
}
.hidden {
  opacity: 0 !important;
}
.move {
  top: 96px !important;
}
@media (max-width: 576px) {
  .move {
    top: 70px !important;
  }
}

.position {
  z-index: 10;
  position: absolute !important;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@-moz-keyframes fadeIn {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-webkit-keyframes fadeIn {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-o-keyframes fadeIn {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-ms-keyframes fadeIn {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
